import React from "react";
import { Image, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function IntroScreen() {
  const router = useRouter();

  const handleStart = async () => {
    try {
      await AsyncStorage.setItem("hasSeenIntro", "true");
    } catch {}
    router.replace("/login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        <LinearGradient colors={["#ede9fe", "#ffffff"]} style={styles.hero}>
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?q=80&w=1200" }}
            style={styles.image}
          />
        </LinearGradient>

        <Text style={styles.title}>Discover Your Style</Text>
        <Text style={styles.subtitle}>
          Join Dressify and explore trending fashion, share your looks, and connect with others.
        </Text>

        <TouchableOpacity style={styles.startButton} onPress={handleStart}>
          <LinearGradient colors={["#8B5CF6", "#A855F7"]} style={styles.startGradient}>
            <Text style={styles.startText}>Start</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    justifyContent: "space-between",
    alignItems: "center",
  },
  hero: {
    width: "100%",
    height: 320,
    borderRadius: 24,
    overflow: "hidden",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1F2937",
    textAlign: "center",
    marginTop: 24,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
    marginTop: 12,
  },
  startButton: {
    width: "100%",
    marginBottom: 40,
  },
  startGradient: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  startText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
});