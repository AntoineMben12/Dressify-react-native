import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from "expo-router";
import { Platform } from "react-native";

export default function TabLayout() {
  return (
    <Tabs 
      screenOptions={{
        tabBarActiveTintColor: "#8B5CF6", // Modern purple matching login design
        tabBarInactiveTintColor: "#9CA3AF", // Subtle gray for inactive tabs
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          height: Platform.OS === "ios" ? 90 : 70,
          paddingBottom: Platform.OS === "ios" ? 25 : 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginBottom: 2,
        },
        headerStyle: {
          backgroundColor: "#8B5CF6",
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: {
          fontWeight: "700",
          fontSize: 18,
        },
      }}
    >
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: "Feed",
          headerTitle: "Trending Fashion",
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons 
              name="trending-up" 
              size={focused ? 26 : 24} 
              color={color} 
            />
          ),
        }} 
      />
      <Tabs.Screen 
        name="create" 
        options={{ 
          title: "Create",
          headerTitle: "Share Your Style",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name="add-circle" 
              size={focused ? 28 : 26} 
              color={color} 
            />
          ),
        }} 
      />
      <Tabs.Screen 
        name="chat" 
        options={{ 
          title: "Chat",
          headerTitle: "Messages",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name="chatbubbles" 
              size={focused ? 26 : 24} 
              color={color} 
            />
          ),
        }} 
      />
      <Tabs.Screen 
        name="dashboard" 
        options={{ 
          title: "Profile",
          headerTitle: "My Profile",
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome 
              name="user-circle" 
              size={focused ? 26 : 24} 
              color={color} 
            />
          ),
        }} 
      />
      <Tabs.Screen 
        name="login" 
        options={{ 
          href: null, // Hide from tabs but keep accessible
        }} 
      />
      <Tabs.Screen 
        name="blog" 
        options={{ 
          href: null, // Hide from tabs but keep accessible
        }} 
      />
    </Tabs>
  );
}