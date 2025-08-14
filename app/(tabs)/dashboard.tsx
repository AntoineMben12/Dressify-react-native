import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { apiService } from '../../lib/api';
import { router } from 'expo-router';

function Dashboard() {
  const { user, signOut, isLoading } = useAuth();
  const { isNotificationEnabled, registerForNotifications, sendLocalNotification } = useNotification();
  const [posts, setPosts] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(false);

  // Load user posts
  const loadPosts = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoadingPosts(true);
      const response = await apiService.getUserPosts(user.id, 1, 10);
      if (response.success && response.posts) {
        setPosts(response.posts);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoadingPosts(false);
    }
  }, [user]);

  // Handle refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadPosts();
    setRefreshing(false);
  }, [loadPosts]);

  // Enable notifications
  const handleEnableNotifications = async () => {
    if (!isNotificationEnabled) {
      await registerForNotifications();
      await sendLocalNotification({
        title: '🎉 Notifications Enabled!',
        body: 'You will now receive updates about likes, comments, and messages.',
      });
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive",
          onPress: async () => {
            try {
              await signOut();
              router.replace("/login");
            } catch (error) {
              console.error("Logout error:", error);
            }
          }
        }
      ]
    );
  };

  // Load posts when component mounts
  useEffect(() => {
    if (user) {
      loadPosts();
    }
  }, [user, loadPosts]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.name || "Fashion Lover"}!</Text>
        </View>
        <View style={styles.headerActions}>
          {!isNotificationEnabled && (
            <TouchableOpacity 
              style={styles.notificationButton} 
              onPress={handleEnableNotifications}
            >
              <Ionicons name="notifications-outline" size={24} color="#8B5CF6" />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <MaterialIcons name="logout" size={24} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      {/* User Info Card */}
      <View style={styles.userCard}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </Text>
          </View>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userNameCard}>{user?.name || "User"}</Text>
          <Text style={styles.userEmail}>{user?.email || "user@example.com"}</Text>
          <View style={styles.statusContainer}>
            <View style={[styles.statusBadge, isNotificationEnabled ? styles.statusEnabled : styles.statusDisabled]}>
              <Ionicons 
                name={isNotificationEnabled ? "notifications" : "notifications-off"} 
                size={16} 
                color={isNotificationEnabled ? "#10B981" : "#6B7280"} 
              />
              <Text style={[styles.statusText, isNotificationEnabled ? styles.statusTextEnabled : styles.statusTextDisabled]}>
                {isNotificationEnabled ? "Notifications On" : "Notifications Off"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionCard}>
            <MaterialIcons name="style" size={32} color="#8B5CF6" />
            <Text style={styles.actionTitle}>Style Guide</Text>
            <Text style={styles.actionSubtitle}>Discover your style</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionCard}>
            <MaterialIcons name="favorite" size={32} color="#EF4444" />
            <Text style={styles.actionTitle}>Favorites</Text>
            <Text style={styles.actionSubtitle}>Your saved looks</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionCard}>
            <MaterialIcons name="shopping-bag" size={32} color="#10B981" />
            <Text style={styles.actionTitle}>Shopping</Text>
            <Text style={styles.actionSubtitle}>Browse collections</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionCard}>
            <MaterialIcons name="trending-up" size={32} color="#F59E0B" />
            <Text style={styles.actionTitle}>Trends</Text>
            <Text style={styles.actionSubtitle}>What&apos;s trending</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityCard}>
          <MaterialIcons name="info" size={24} color="#6B7280" />
          <Text style={styles.activityText}>
            Welcome to Dressify! Start exploring your fashion journey.
          </Text>
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Your Stats</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Outfits Created</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Items Saved</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Style Points</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6B7280",
  },
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  welcomeContainer: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    color: "#6B7280",
  },
  userName: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1F2937",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  notificationButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#EDE9FE",
    marginRight: 8,
  },
  logoutButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#FEE2E2",
  },
  userCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#8B5CF6",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  userInfo: {
    flex: 1,
  },
  userNameCard: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#6B7280",
  },
  statusContainer: {
    marginTop: 8,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  statusEnabled: {
    backgroundColor: "#D1FAE5",
  },
  statusDisabled: {
    backgroundColor: "#F3F4F6",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 4,
  },
  statusTextEnabled: {
    color: "#10B981",
  },
  statusTextDisabled: {
    color: "#6B7280",
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    width: "48%",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginTop: 12,
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },
  activityCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  activityText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: "#6B7280",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "800",
    color: "#8B5CF6",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },
});

export default Dashboard;