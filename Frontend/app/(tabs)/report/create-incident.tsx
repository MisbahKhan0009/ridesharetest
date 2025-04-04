import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  ChevronDown, 
  Camera, 
  Upload,
  ArrowLeft
} from 'lucide-react-native';
import { router } from 'expo-router';
import Colors from '../../../constants/Colors';
import { useToast } from '../../../components/ToastProvider';

export default function CreateIncidentScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [category, setCategory] = useState('');
  const [media, setMedia] = useState(null);
  const { showToast } = useToast();

  const handleSubmit = () => {
    if (!title || !description || !location || !date || !time || !category) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    
    // In a real app, this would submit the incident report to a backend
    showToast('Incident reported successfully!', 'success');
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Incident Title</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="e.g., Roadblock on XYZ Street"
                value={title}
                onChangeText={setTitle}
                placeholderTextColor={Colors.light.subtext}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <View style={[styles.inputContainer, styles.textAreaContainer]}>
              <TextInput
                style={styles.textArea}
                placeholder="Describe the incident in detail..."
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                placeholderTextColor={Colors.light.subtext}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Location</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Search location"
                value={location}
                onChangeText={setLocation}
                placeholderTextColor={Colors.light.subtext}
              />
              <MapPin size={20} color={Colors.light.subtext} />
            </View>
            <View style={styles.mapPreview}>
              {/* Map preview would go here in a real app */}
              <View style={styles.mapPlaceholder}>
                <MapPin size={24} color={Colors.light.subtext} />
              </View>
            </View>
          </View>

          <View style={styles.formRow}>
            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={styles.label}>Date</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="mm/dd/yyyy"
                  value={date}
                  onChangeText={setDate}
                  placeholderTextColor={Colors.light.subtext}
                />
                <Calendar size={20} color={Colors.light.subtext} />
              </View>
            </View>

            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={styles.label}>Time</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="--:-- --"
                  value={time}
                  onChangeText={setTime}
                  placeholderTextColor={Colors.light.subtext}
                />
                <Clock size={20} color={Colors.light.subtext} />
              </View>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Category</Text>
            <TouchableOpacity style={styles.selectContainer}>
              <Text style={category ? styles.selectText : styles.selectPlaceholder}>
                {category || 'Select category'}
              </Text>
              <ChevronDown size={20} color={Colors.light.subtext} />
            </TouchableOpacity>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Media Upload (Optional)</Text>
            <TouchableOpacity style={styles.mediaUploadContainer}>
              <View style={styles.mediaUploadContent}>
                <Upload size={24} color={Colors.light.subtext} />
                <Text style={styles.mediaUploadText}>Tap to upload photo or video</Text>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>Report Incident</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.light.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    fontFamily: 'Inter-SemiBold',
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: 8,
    fontFamily: 'Inter-Medium',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.light.text,
    fontFamily: 'Inter-Regular',
  },
  textAreaContainer: {
    paddingVertical: 8,
    alignItems: 'flex-start',
  },
  textArea: {
    width: '100%',
    height: 120,
    fontSize: 16,
    color: Colors.light.text,
    fontFamily: 'Inter-Regular',
    textAlignVertical: 'top',
  },
  mapPreview: {
    marginTop: 8,
    height: 150,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  mapPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.light.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  selectText: {
    fontSize: 16,
    color: Colors.light.text,
    fontFamily: 'Inter-Regular',
  },
  selectPlaceholder: {
    fontSize: 16,
    color: Colors.light.subtext,
    fontFamily: 'Inter-Regular',
  },
  mediaUploadContainer: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 20,
    backgroundColor: Colors.light.card,
  },
  mediaUploadContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaUploadText: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.light.subtext,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
});