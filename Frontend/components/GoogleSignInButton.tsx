import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import Colors from '../constants/Colors';

interface GoogleSignInButtonProps {
  onPress: () => void;
  disabled?: boolean;
}

export default function GoogleSignInButton({ onPress, disabled }: GoogleSignInButtonProps) {
  return (
    <TouchableOpacity 
      style={[styles.button, disabled && styles.buttonDisabled]} 
      onPress={onPress}
      disabled={disabled}
    >
      <Image 
        source={{ uri: "https://cdn-icons-png.flaticon.com/512/2991/2991148.png" }}
        style={styles.icon} 
      />
      <Text style={styles.text}>Sign in with Google</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  text: {
    fontSize: 16,
    color: Colors.light.text,
    fontFamily: 'Inter-Medium',
  },
});