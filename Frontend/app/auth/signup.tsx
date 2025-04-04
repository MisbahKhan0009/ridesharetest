import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { Mail, Lock, Eye, EyeOff, User, ChevronLeft, Phone, CircleUser as UserCircle2 } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Colors from '../../constants/Colors';
import Logo from '../../components/Logo';
import { useToast } from '../../components/ToastProvider';
import AnimatedPressable from '../../components/AnimatedPressable';

const BASE_URL = 'https://ride.emplique.com';

export default function SignupScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [studentId, setStudentId] = useState('');
  const [gender, setGender] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const { showToast } = useToast();

  const validateForm = () => {
    if (!firstName || !lastName || !email || !phone || !studentId || !gender || !password || !confirmPassword) {
      showToast('Please fill in all fields', 'error');
      return false;
    }

    if (!email.endsWith('@northsouth.edu')) {
      showToast('Please use your NSU email (@northsouth.edu)', 'error');
      return false;
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return false;
    }

    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const payload = {
        email,
        first_name: firstName,
        last_name: lastName,
        gender,
        student_id: studentId,
        phone_number: phone,
        password,
      };
      console.log('Sending payload:', JSON.stringify(payload)); // Log payload

      const response = await fetch(`${BASE_URL}/api/users/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const rawResponse = await response.text(); // Get raw response
      console.log('Raw response:', rawResponse); // Log it

      const data = JSON.parse(rawResponse); // Parse after logging

      if (response.ok) {
        showToast('OTP sent to your email!', 'success');
        setOtpSent(true);
      } else {
const errorMessage = data.error || (Object.values(data as Record<string, string[]>)[0]?.[0]) || 'Registration failed';
        showToast(errorMessage, 'error');
      }
    } catch (error) {
      showToast('Network error. Please try again.', 'error');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update the verifyOtp function
  const verifyOtp = async () => {
      if (!otp) {
        showToast('Please enter OTP', 'error');
        return;
      }
  
      setIsLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/api/users/verify-otp/`, { // Updated endpoint URL
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            otp_code: otp,
          }),
        });
  
        const rawResponse = await response.text();
        console.log('Verify OTP response:', rawResponse);
  
        const data = JSON.parse(rawResponse);
  
        if (response.ok) {
          showToast('Registration successful!', 'success');
          router.replace('/auth/login');
        } else {
          const errorMessage = data.error || data.detail || 'OTP verification failed';
          showToast(errorMessage, 'error');
        }
      } catch (error) {
        if (error instanceof Error) {
          showToast(`Network error: ${error.message}`, 'error');
          console.error('Error:', error);
        } else {
          showToast('Network error. Please try again.', 'error');
        }
      } finally {
        setIsLoading(false);
      }
    };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ChevronLeft size={24} color={Colors.light.text} />
            </TouchableOpacity>
          </View>

          <Animated.View 
            style={styles.logoContainer}
            entering={FadeInDown.delay(100).duration(500)}
          >
            <Logo size="medium" />
          </Animated.View>

          <Animated.View 
            style={styles.headerContainer}
            entering={FadeInDown.delay(200).duration(500)}
          >
            <Text style={styles.headerTitle}>Create Account</Text>
            <Text style={styles.headerSubtitle}>Join our NSU ride-sharing community</Text>
          </Animated.View>

          {!otpSent ? (
            <Animated.View 
              style={styles.formContainer}
              entering={FadeInDown.delay(300).duration(500)}
            >
              <View style={styles.inputGroup}>
                <View style={styles.inputContainer}>
                  <User size={20} color={Colors.light.primary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="First Name"
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholderTextColor={Colors.light.subtext}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.inputContainer}>
                  <User size={20} color={Colors.light.primary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Last Name"
                    value={lastName}
                    onChangeText={setLastName}
                    placeholderTextColor={Colors.light.subtext}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.inputContainer}>
                  <Mail size={20} color={Colors.light.primary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="NSU Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor={Colors.light.subtext}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.inputContainer}>
                  <UserCircle2 size={20} color={Colors.light.primary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Student ID"
                    value={studentId}
                    onChangeText={setStudentId}
                    placeholderTextColor={Colors.light.subtext}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.inputContainer}>
                  <Phone size={20} color={Colors.light.primary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Phone Number"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    placeholderTextColor={Colors.light.subtext}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Gender</Text>
                <View style={styles.genderContainer}>
                  <TouchableOpacity 
                    style={[styles.genderButton, gender === 'Male' && styles.genderButtonActive]}
                    onPress={() => setGender('Male')}
                  >
                    <Text style={[styles.genderButtonText, gender === 'Male' && styles.genderButtonTextActive]}>
                      Male
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.genderButton, gender === 'Female' && styles.genderButtonActive]}
                    onPress={() => setGender('Female')}
                  >
                    <Text style={[styles.genderButtonText, gender === 'Female' && styles.genderButtonTextActive]}>
                      Female
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.genderButton, gender === 'Other' && styles.genderButtonActive]}
                    onPress={() => setGender('Other')}
                  >
                    <Text style={[styles.genderButtonText, gender === 'Other' && styles.genderButtonTextActive]}>
                      Other
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.inputContainer}>
                  <Lock size={20} color={Colors.light.primary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    placeholderTextColor={Colors.light.subtext}
                  />
                  <TouchableOpacity 
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={20} color={Colors.light.subtext} />
                    ) : (
                      <Eye size={20} color={Colors.light.subtext} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.inputContainer}>
                  <Lock size={20} color={Colors.light.primary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    placeholderTextColor={Colors.light.subtext}
                  />
                  <TouchableOpacity 
                    style={styles.eyeIcon}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} color={Colors.light.subtext} />
                    ) : (
                      <Eye size={20} color={Colors.light.subtext} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.termsContainer}>
                <Text style={styles.termsText}>
                  By signing up, you agree to our{' '}
                  <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
                  <Text style={styles.termsLink}>Privacy Policy</Text>
                </Text>
              </View>

              <AnimatedPressable 
                style={[styles.signupButton, isLoading && styles.signupButtonDisabled]}
                onPress={handleSignup}
                disabled={isLoading}
              >
                <Text style={styles.signupButtonText}>
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Text>
              </AnimatedPressable>
            </Animated.View>
          ) : (
            <Animated.View 
              style={styles.formContainer}
              entering={FadeInDown.delay(300).duration(500)}
            >
              <Text style={styles.otpTitle}>Enter OTP</Text>
              <Text style={styles.otpSubtitle}>
                Please enter the 6-digit code sent to your email
              </Text>

              <View style={styles.inputGroup}>
                <View style={styles.inputContainer}>
                  <Lock size={20} color={Colors.light.primary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter OTP"
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType="number-pad"
                    maxLength={6}
                    placeholderTextColor={Colors.light.subtext}
                  />
                </View>
              </View>

              <AnimatedPressable 
                style={[styles.signupButton, isLoading && styles.signupButtonDisabled]}
                onPress={verifyOtp}
                disabled={isLoading}
              >
                <Text style={styles.signupButtonText}>
                  {isLoading ? 'Verifying...' : 'Verify OTP'}
                </Text>
              </AnimatedPressable>
            </Animated.View>
          )}

          <Animated.View 
            style={styles.loginContainer}
            entering={FadeInDown.delay(400).duration(500)}
          >
            <Text style={styles.loginText}>Already have an account? </Text>
            <Link href="/auth/login" asChild>
              <TouchableOpacity>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </Link>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  backButton: {
    padding: 8,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  headerContainer: {
    marginBottom: 25,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 8,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.light.subtext,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 8,
    fontFamily: 'Inter-Medium',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontFamily: 'Inter-Regular',
  },
  eyeIcon: {
    padding: 8,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  genderButtonActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  genderButtonText: {
    fontSize: 16,
    color: Colors.light.text,
    fontFamily: 'Inter-Medium',
  },
  genderButtonTextActive: {
    color: Colors.light.card,
  },
  termsContainer: {
    marginBottom: 20,
  },
  termsText: {
    fontSize: 14,
    color: Colors.light.subtext,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 20,
  },
  termsLink: {
    color: Colors.light.primary,
    fontFamily: 'Inter-Medium',
  },
  signupButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  signupButtonDisabled: {
    backgroundColor: Colors.light.border,
  },
  signupButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  loginText: {
    fontSize: 16,
    color: Colors.light.subtext,
    fontFamily: 'Inter-Regular',
  },
  loginLink: {
    fontSize: 16,
    color: Colors.light.primary,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  otpTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 8,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
  },
  otpSubtitle: {
    fontSize: 16,
    color: Colors.light.subtext,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginBottom: 24,
  },
});