import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { X } from "lucide-react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming, withSequence, runOnJS, Easing } from "react-native-reanimated";
import Colors from "../constants/Colors";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  visible: boolean;
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ visible, message, type = "success", duration = 3000, onClose }) => {
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (visible) {
      translateY.value = withSequence(
        withTiming(-100, { duration: 0 }),
        withTiming(Platform.OS === "web" ? 20 : 50, {
          duration: 300,
          easing: Easing.out(Easing.back(1.5)),
        })
      );
      opacity.value = withTiming(1, { duration: 300 });

      timeoutId = setTimeout(() => {
        hideToast();
      }, duration);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [visible]);

  const hideToast = () => {
    translateY.value = withTiming(-100, {
      duration: 300,
      easing: Easing.in(Easing.cubic),
    });
    
    opacity.value = withTiming(0, { 
      duration: 300 
    }, (isFinished) => {
      if (isFinished && onClose) {
        runOnJS(onClose)();
      }
    });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      opacity: opacity.value,
    };
  });

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return Colors.light.success;
      case "error":
        return Colors.light.error;
      case "info":
        return Colors.light.primary;
      default:
        return Colors.light.success;
    }
  };

  if (!visible && opacity.value === 0) return null;

  return (
    <Animated.View style={[styles.container, animatedStyle, { backgroundColor: getBackgroundColor() }]}>
      <Text style={styles.message}>{message}</Text>
      <TouchableOpacity onPress={hideToast} style={styles.closeButton}>
        <X size={18} color="#FFFFFF" />
      </TouchableOpacity>
    </Animated.View>
  );
};

// Styles remain unchanged
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 20,
    right: 20,
    backgroundColor: "#34C759",
    borderRadius: 8,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
  },
  message: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
    marginRight: 10,
    fontFamily: "Inter-Medium",
  },
  closeButton: {
    padding: 4,
  },
});

export default Toast;
