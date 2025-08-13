import React, { createContext, useContext, useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { notificationService, NotificationData } from '../lib/notificationService';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  expoPushToken: string | null;
  notification: Notifications.Notification | null;
  isNotificationEnabled: boolean;
  registerForNotifications: () => Promise<void>;
  sendLocalNotification: (data: NotificationData) => Promise<void>;
  notifyNewLike: (userName: string, postContent: string) => Promise<void>;
  notifyNewComment: (userName: string, postContent: string) => Promise<void>;
  notifyNewFollower: (userName: string) => Promise<void>;
  notifyNewMessage: (userName: string, messagePreview: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Initialize notifications when user is authenticated
    if (user) {
      initializeNotifications();
    }
  }, [user]);

  useEffect(() => {
    // Set up notification listeners
    const notificationListener = notificationService.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
        console.log('Notification received:', notification);
      }
    );

    const responseListener = notificationService.addNotificationResponseReceivedListener(
      (response) => {
        console.log('Notification response:', response);
        handleNotificationResponse(response);
      }
    );

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  const initializeNotifications = async () => {
    try {
      // Check if already have stored token
      let token = await notificationService.getStoredPushToken();
      
      if (!token) {
        // Register for new token
        token = await notificationService.registerForPushNotifications();
      }

      if (token) {
        setExpoPushToken(token);
        setIsNotificationEnabled(true);
        console.log('Push token:', token);
      }
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  };

  const registerForNotifications = async () => {
    try {
      const token = await notificationService.registerForPushNotifications();
      if (token) {
        setExpoPushToken(token);
        setIsNotificationEnabled(true);
      }
    } catch (error) {
      console.error('Error registering for notifications:', error);
    }
  };

  const sendLocalNotification = async (data: NotificationData) => {
    try {
      await notificationService.sendLocalNotification(data);
    } catch (error) {
      console.error('Error sending local notification:', error);
    }
  };

  const notifyNewLike = async (userName: string, postContent: string) => {
    if (isNotificationEnabled) {
      await notificationService.notifyNewLike(userName, postContent);
    }
  };

  const notifyNewComment = async (userName: string, postContent: string) => {
    if (isNotificationEnabled) {
      await notificationService.notifyNewComment(userName, postContent);
    }
  };

  const notifyNewFollower = async (userName: string) => {
    if (isNotificationEnabled) {
      await notificationService.notifyNewFollower(userName);
    }
  };

  const notifyNewMessage = async (userName: string, messagePreview: string) => {
    if (isNotificationEnabled) {
      await notificationService.notifyNewMessage(userName, messagePreview);
    }
  };

  const handleNotificationResponse = (response: Notifications.NotificationResponse) => {
    const data = response.notification.request.content.data;
    
    // Handle different notification types
    switch (data?.type) {
      case 'like':
        // Navigate to post or profile
        console.log('Navigate to liked post');
        break;
      case 'comment':
        // Navigate to post comments
        console.log('Navigate to post comments');
        break;
      case 'follower':
        // Navigate to profile
        console.log('Navigate to follower profile');
        break;
      case 'message':
        // Navigate to chat
        console.log('Navigate to chat');
        break;
      default:
        console.log('Unknown notification type');
    }
  };

  const value: NotificationContextType = {
    expoPushToken,
    notification,
    isNotificationEnabled,
    registerForNotifications,
    sendLocalNotification,
    notifyNewLike,
    notifyNewComment,
    notifyNewFollower,
    notifyNewMessage,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
