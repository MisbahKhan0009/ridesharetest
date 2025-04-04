import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Image, Pressable } from 'react-native';
import { X, Mail, Phone, GraduationCap, User } from 'lucide-react-native';
import Colors from '../../constants/Colors';

interface HostDetailsModalProps {
  isVisible: boolean;
  onClose: () => void;
  host: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    gender: string;
    student_id: string;
    phone_number: string;
    profile_photo: string | null;
  };
}

export default function HostDetailsModal({ isVisible, onClose, host }: HostDetailsModalProps) {
  const profileImage = host.profile_photo || 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png';

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Host Details</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={Colors.light.text} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.hostInfo}>
            <Image source={{ uri: profileImage }} style={styles.hostImage} />
            <Text style={styles.hostName}>{host.first_name} {host.last_name}</Text>
            
            <View style={styles.infoContainer}>
              <View style={styles.infoItem}>
                <User size={20} color={Colors.light.primary} />
                <Text style={styles.infoText}>{host.gender}</Text>
              </View>

              <View style={styles.infoItem}>
                <Mail size={20} color={Colors.light.primary} />
                <Text style={styles.infoText}>{host.email}</Text>
              </View>

              <View style={styles.infoItem}>
                <Phone size={20} color={Colors.light.primary} />
                <Text style={styles.infoText}>{host.phone_number}</Text>
              </View>

              <View style={styles.infoItem}>
                <GraduationCap size={20} color={Colors.light.primary} />
                <Text style={styles.infoText}>Student ID: {host.student_id}</Text>
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text,
    fontFamily: 'Inter-SemiBold',
  },
  closeButton: {
    padding: 4,
  },
  hostInfo: {
    alignItems: 'center',
    padding: 16,
  },
  hostImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  hostName: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 20,
    fontFamily: 'Inter-SemiBold',
  },
  infoContainer: {
    width: '100%',
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  infoText: {
    fontSize: 16,
    color: Colors.light.text,
    fontFamily: 'Inter-Regular',
  },
});