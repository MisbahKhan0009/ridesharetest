import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Calendar, Clock, Users, Car, DollarSign, ChevronDown } from 'lucide-react-native';
import { router } from 'expo-router';

export default function OfferRideScreen() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [seats, setSeats] = useState('4');
  const [price, setPrice] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [notes, setNotes] = useState('');

  const handleCreateRide = () => {
    // In a real app, this would save the ride to a database
    alert('Ride created successfully!');
    router.navigate('/rides');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Offer a Ride</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Route Information</Text>
          
          <View style={styles.inputGroup}>
            <View style={styles.inputContainer}>
              <MapPin size={20} color="#6C63FF" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="From"
                value={from}
                onChangeText={setFrom}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputContainer}>
              <MapPin size={20} color="#FF3B30" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="To"
                value={to}
                onChangeText={setTo}
              />
            </View>
          </View>

          <View style={styles.rowInputs}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <View style={styles.inputContainer}>
                <Calendar size={20} color="#6C63FF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Date"
                  value={date}
                  onChangeText={setDate}
                />
              </View>
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <View style={styles.inputContainer}>
                <Clock size={20} color="#6C63FF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Time"
                  value={time}
                  onChangeText={setTime}
                />
              </View>
            </View>
          </View>

          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Ride Details</Text>

          <View style={styles.rowInputs}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <View style={styles.inputContainer}>
                <Users size={20} color="#6C63FF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Available Seats"
                  value={seats}
                  onChangeText={setSeats}
                  keyboardType="numeric"
                />
                <TouchableOpacity style={styles.dropdownButton}>
                  <ChevronDown size={16} color="#8E8E93" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <View style={styles.inputContainer}>
                <DollarSign size={20} color="#6C63FF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Price per Seat"
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputContainer}>
              <Car size={20} color="#6C63FF" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Vehicle (e.g., Toyota Corolla)"
                value={vehicle}
                onChangeText={setVehicle}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <View style={[styles.inputContainer, styles.textAreaContainer]}>
              <TextInput
                style={styles.textArea}
                placeholder="Additional Notes (Optional)"
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>

          <View style={styles.vehicleOptions}>
            <Text style={styles.sectionTitle}>Vehicle Type</Text>
            <View style={styles.vehicleTypesContainer}>
              <TouchableOpacity style={[styles.vehicleTypeButton, styles.activeVehicleType]}>
                <Car size={24} color="#6C63FF" />
                <Text style={styles.vehicleTypeText}>Car</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.vehicleTypeButton}>
                <Car size={24} color="#8E8E93" />
                <Text style={styles.vehicleTypeText}>SUV</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.vehicleTypeButton}>
                <Car size={24} color="#8E8E93" />
                <Text style={styles.vehicleTypeText}>Van</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.createButton} onPress={handleCreateRide}>
            <Text style={styles.createButtonText}>Create Ride</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333333',
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dropdownButton: {
    padding: 5,
  },
  textAreaContainer: {
    paddingVertical: 10,
  },
  textArea: {
    flex: 1,
    height: 100,
    fontSize: 16,
    color: '#333333',
    textAlignVertical: 'top',
  },
  vehicleOptions: {
    marginTop: 10,
    marginBottom: 20,
  },
  vehicleTypesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  vehicleTypeButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  activeVehicleType: {
    borderColor: '#6C63FF',
    backgroundColor: '#F0EFFE',
  },
  vehicleTypeText: {
    marginTop: 5,
    fontSize: 14,
    color: '#333333',
  },
  createButton: {
    backgroundColor: '#6C63FF',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});