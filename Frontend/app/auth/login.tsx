import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";
import { Mail, Lock, Eye, EyeOff } from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import Colors from "../../constants/Colors";
import Logo from "../../components/Logo";
import { useToast } from "../../components/ToastProvider";
import AnimatedPressable from "../../components/AnimatedPressable";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../context/AuthContext";
import GoogleSignInButton from "../../components/GoogleSignInButton";
import { useGoogleSignIn } from "../../services/googleAuth";

const BASE_URL = "https://ride.emplique.com";

export default function LoginScreen() {
  const [email, setEmail] = useState("misbah.khan@northsouth.edu");
  const [password, setPassword] = useState("password");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const { login } = useAuth();
  const { handleGoogleSignIn, isLoading: isGoogleLoading } = useGoogleSignIn();

  const handleGoogleLogin = async () => {
    try {
      console.log("Starting Google login process...");
      const userData = await handleGoogleSignIn();

      if (!userData) {
        console.log("No user data returned from Google Sign In");
        showToast("Google sign in failed or was cancelled", "error");
        return;
      }

      console.log("Google Sign In successful, logging in...");
      await login(userData);
      showToast("Login successful!", "success");
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Google Login Error:", error);
      showToast(error.message || "Google login failed", "error");
    }
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      showToast("Please enter both email and password", "error");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        email,
        password,
      };

      const response = await fetch(`${BASE_URL}/api/users/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem("access_token", data.access);
        await AsyncStorage.setItem("refresh_token", data.refresh);
        await login(data.user);
        showToast("Login successful!", "success");
        router.replace("/(tabs)");
      } else {
        const errorMessage = data.detail || data.error || "Invalid credentials";
        showToast(errorMessage, "error");
      }
    } catch (error) {
      showToast("Network error. Please try again.", "error");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Animated.View style={styles.logoContainer} entering={FadeInDown.delay(100).duration(500)}>
            <Logo size="large" />
          </Animated.View>

          <Animated.View style={styles.headerContainer} entering={FadeInDown.delay(200).duration(500)}>
            <Text style={styles.headerTitle}>Welcome Back</Text>
            <Text style={styles.headerSubtitle}>Sign in to continue your journey</Text>
          </Animated.View>

          <Animated.View style={styles.formContainer} entering={FadeInDown.delay(300).duration(500)}>
            <View style={styles.inputGroup}>
              <View style={styles.inputContainer}>
                <Mail size={20} color={Colors.light.primary} style={styles.inputIcon} />
                <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholderTextColor={Colors.light.subtext} />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputContainer}>
                <Lock size={20} color={Colors.light.primary} style={styles.inputIcon} />
                <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} placeholderTextColor={Colors.light.subtext} />
                <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={20} color={Colors.light.subtext} /> : <Eye size={20} color={Colors.light.subtext} />}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.forgotPasswordContainer}>
              <TouchableOpacity onPress={() => router.push("/auth/forgot-password")}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            <AnimatedPressable style={[styles.loginButton, isLoading && styles.loginButtonDisabled]} onPress={handleLogin} disabled={isLoading}>
              <Text style={styles.loginButtonText}>{isLoading ? "Signing in..." : "Sign In"}</Text>
            </AnimatedPressable>
          </Animated.View>

          <Animated.View style={styles.socialLoginContainer} entering={FadeInDown.delay(400).duration(500)}>
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.divider} />
            </View>

            <View style={styles.socialButtonsContainer}>
              <GoogleSignInButton onPress={handleGoogleLogin} disabled={isLoading || isGoogleLoading} />
            </View>
          </Animated.View>

          <Animated.View style={styles.signupContainer} entering={FadeInDown.delay(500).duration(500)}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <Link href="/auth/signup" asChild>
              <TouchableOpacity>
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </Link>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Add these styles to the existing StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 30,
  },
  headerContainer: {
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: 8,
    fontFamily: "Inter-Bold",
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.light.subtext,
    fontFamily: "Inter-Regular",
    textAlign: "center",
  },
  formContainer: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: Colors.light.text,
    fontFamily: "Inter-Regular",
  },
  eyeIcon: {
    padding: 8,
  },
  forgotPasswordContainer: {
    alignItems: "flex-end",
    marginTop: 8,
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: Colors.light.primary,
    fontSize: 14,
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Inter-SemiBold",
  },
  socialLoginContainer: {
    marginTop: 20,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.light.border,
  },
  dividerText: {
    marginHorizontal: 10,
    color: Colors.light.subtext,
    fontSize: 14,
    fontFamily: "Inter-Regular",
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.light.card,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  socialIcon: {
    width: 24,
    height: 24,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  signupText: {
    color: Colors.light.subtext,
    fontSize: 14,
    fontFamily: "Inter-Regular",
  },
  signupLink: {
    color: Colors.light.primary,
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Inter-SemiBold",
  },
});
