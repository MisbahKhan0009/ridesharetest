import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import Colors from '../../constants/Colors';
import { useToast } from '../../components/ToastProvider';

const BASE_URL = "https://ride.emplique.com";

export default function EditProfileScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    gender: '',
    student_id: '',
    profile_photo: null,
  });
  const { showToast } = useToast();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user_data');
      if (userData) {
        const parsedData = JSON.parse(userData);
        setProfileData({
          first_name: parsedData.first_name || '',
          last_name: parsedData.last_name || '',
          phone_number: parsedData.phone_number || '',
          gender: parsedData.gender || '',
          student_id: parsedData.student_id || '',
          profile_photo: parsedData.profile_photo || null,
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      showToast('Error loading profile data', 'error');
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setProfileData(prev => ({
        ...prev,
        profile_photo: result.assets[0].uri
      }));
    }
  };

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        showToast('Please login first', 'error');
        router.push('/auth/login');
        return;
      }

      const formData = new FormData();
      Object.keys(profileData).forEach(key => {
        if (key === 'profile_photo' && profileData[key]) {
          // Only append if it's a new image (starts with 'file://')
          if (profileData[key].startsWith('file://')) {
            const filename = profileData[key].split('/').pop();
            formData.append('profile_picture', {
              uri: profileData[key],
              type: 'image/jpeg',
              name: filename || 'profile.jpg',
            });
          }
        } else if (profileData[key]) {
          formData.append(key, profileData[key]);
        }
      });

      const response = await fetch(`${BASE_URL}/api/users/profile/edit/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('user_data', JSON.stringify(data));
        showToast('Profile updated successfully', 'success');
        router.back();
      } else {
        showToast(data.error || 'Failed to update profile', 'error');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast('Error updating profile', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileImageContainer}>
        <Image
          source={{
            uri: profileData.profile_photo || 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'
          }}
          style={styles.profileImage}
        />
        <TouchableOpacity onPress={pickImage} style={styles.changePhotoButton}>
          <Text style={styles.changePhotoText}>Change Photo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            value={profileData.first_name}
            onChangeText={(text) => setProfileData(prev => ({ ...prev, first_name: text }))}
            placeholder="First Name"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            value={profileData.last_name}
            onChangeText={(text) => setProfileData(prev => ({ ...prev, last_name: text }))}
            placeholder="Last Name"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={profileData.phone_number}
            onChangeText={(text) => setProfileData(prev => ({ ...prev, phone_number: text }))}
            placeholder="+880XXXXXXXXXX"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Gender</Text>
          <View style={styles.genderButtons}>
            {['Male', 'Female', 'Other'].map((gender) => (
              <TouchableOpacity
                key={gender}
                style={[
                  styles.genderButton,
                  profileData.gender === gender[0] && styles.genderButtonActive
                ]}
                onPress={() => setProfileData(prev => ({ ...prev, gender: gender[0] }))}
              >
                <Text style={[
                  styles.genderButtonText,
                  profileData.gender === gender[0] && styles.genderButtonTextActive
                ]}>
                  {gender}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.updateButton, isLoading && styles.updateButtonDisabled]}
          onPress={handleUpdateProfile}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.updateButtonText}>Update Profile</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  profileImageContainer: {
    alignItems: 'center',
    padding: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  changePhotoButton: {
    padding: 8,
  },
  changePhotoText: {
    color: Colors.light.primary,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 8,
    fontFamily: 'Inter-Medium',
  },
  input: {
    backgroundColor: Colors.light.card,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
    color: Colors.light.text,
    fontFamily: 'Inter-Regular',
  },
  genderButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  genderButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
    alignItems: 'center',
    backgroundColor: Colors.light.card,
  },
  genderButtonActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  genderButtonText: {
    color: Colors.light.text,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  genderButtonTextActive: {
    color: '#FFFFFF',
  },
  updateButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  updateButtonDisabled: {
    opacity: 0.7,
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});