import { Stack, useRouter, usePathname } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { NotificationProvider } from "../context/NotificationContext";
import "../styles/global.css";
import AsyncStorage from "@react-native-async-storage/async-storage";

function RouteGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [hasCheckedIntro, setHasCheckedIntro] = useState(false);
  const [hasSeenIntro, setHasSeenIntro] = useState<boolean>(false);

  useEffect(() => {
    const loadIntroState = async () => {
      try {
        const seen = await AsyncStorage.getItem("hasSeenIntro");
        setHasSeenIntro(seen === "true");
      } catch (e) {
        setHasSeenIntro(false);
      } finally {
        setHasCheckedIntro(true);
      }
    };
    loadIntroState();
  }, []);

  useEffect(() => {
    if (isLoading || !hasCheckedIntro) return;

    if (isAuthenticated) {
      if (pathname === "/login" || pathname === "/intro") {
        router.replace("/");
      }
      return;
    }

    if (!hasSeenIntro) {
      if (pathname !== "/intro") {
        router.replace("/intro");
      }
      return;
    }

    if (pathname !== "/login") {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, hasCheckedIntro, hasSeenIntro, pathname, router]);

  if (isLoading || !hasCheckedIntro) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  return <>{children}</>;
}

function RootLayoutContent() {
  return (
    <RouteGuard>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="intro" options={{ headerShown: false }} />
      </Stack>
    </RouteGuard>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <RootLayoutContent />
      </NotificationProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
});
