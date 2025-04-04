import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Linking,
    Platform,
    Image,
  } from 'react-native';
  import { SafeAreaView } from 'react-native-safe-area-context';
  import { Search, Phone, Ambulance, Shield, Flame, Building2, ChevronFirst as FirstAid, Car, ChevronRight, MapPin, Chrome as Home } from 'lucide-react-native';
  import { Ionicons } from '@expo/vector-icons';
  import Colors from '../../../constants/Colors';
  import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
  import React, { useState } from 'react';
  import policeStations from '../../../data/police_stations.json'; // Import the JSON file
  
  // Helper function to extract a string number from a contact field
  const extractNumber = (contact: string | { [key: string]: string | undefined }): string => {
    if (typeof contact === 'string') {
      return contact; // If it's already a string, return it
    } else if (contact && typeof contact === 'object') {
      // If it's an object, prefer the Mobile number, otherwise use Phone, or the first available value
      return contact.Mobile || contact.Phone || Object.values(contact)[0] || 'N/A';
    }
    return 'N/A'; // Fallback if no number is found
  };
  
  // Define the emergency categories, replacing the Police category's services with JSON data
  // Add this interface after the existing interfaces
  interface PoliceStation {
    name: string;
    address: string;
    contacts: {
      [key: string]: string | Contact;
    };
  }
  
  // Then update the map function
  const emergencyCategories = [
    {
      id: '1',
      name: 'Police',
      icon: <Shield size={24} color="#FFFFFF" />,
      backgroundColor: '#3B82F6',
      services: policeStations.map((station: any, index: number) => {
        const primaryContact = station.contacts['Officer-in-Charge'] || 
                             station.contacts['DC'] || 
                             Object.values(station.contacts)[0];
        
        return {
          id: (index + 1).toString(),
          name: station.name.replace(' Thana', ' Police Station'),
          number: extractNumber(primaryContact),
          distance: '5.0 km',
          address: station.address,
          contacts: station.contacts,
        };
      }),
    },
    {
      id: '2',
      name: 'Hospitals',
      icon: <FirstAid size={24} color="#FFFFFF" />,
      backgroundColor: '#10B981',
      services: [
        {
          id: '1',
          name: 'United Hospital',
          number: '10666',
          distance: '1.2 km',
          address: 'Plot 15, Road 71, Gulshan',
        },
        {
          id: '2',
          name: 'Apollo Hospital',
          number: '10678',
          distance: '4.5 km',
          address: 'Plot 81, Block E, Bashundhara R/A',
        },
        {
          id: '3',
          name: 'Square Hospital',
          number: '10616',
          distance: '5.8 km',
          address: 'West Panthapath, Dhaka',
        },
      ],
    },
    {
      id: '3',
      name: 'Fire Service',
      icon: <Flame size={24} color="#FFFFFF" />,
      backgroundColor: '#F59E0B',
      services: [
        {
          id: '1',
          name: 'Baridhara Fire Station',
          number: '999',
          distance: '1.8 km',
          address: 'Block J, Baridhara',
        },
        {
          id: '2',
          name: 'Kuril Fire Station',
          number: '999',
          distance: '3.2 km',
          address: 'Kuril Bishwa Road',
        },
      ],
    },
    {
      id: '4',
      name: 'Ambulance',
      icon: <Ambulance size={24} color="#FFFFFF" />,
      backgroundColor: '#EF4444',
      services: [
        {
          id: '1',
          name: 'United Hospital Ambulance',
          number: '10666',
          distance: '1.2 km',
          address: 'Plot 15, Road 71, Gulshan',
        },
        {
          id: '2',
          name: 'Red Crescent Ambulance',
          number: '01811-458524',
          distance: '2.5 km',
          address: 'Mohakhali',
        },
      ],
    },
  ];
  
  // Add these interfaces at the top of the file after imports
  interface Contact {
    Mobile?: string;
    Phone?: string;
    [key: string]: string | undefined;
  }
  
  interface Service {
    id: string;
    name: string;
    number: string;
    distance: string;
    address: string;
    contacts?: { [key: string]: string | Contact };
  }
  
  interface Category {
    id: string;
    name: string;
    icon: JSX.Element;
    backgroundColor: string;
    services: Service[];
  }
  
  // Update the state declarations in the component
  export default function QuickSearchScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
  
    const handleCategorySelect = (category: Category) => {
      setSelectedCategory(category);
      setSelectedService(null);
      setSearchQuery('');
    };
  
    const handleServiceSelect = (service: Service) => {
      setSelectedService(service);
    };
  
    const handleCall = (number: string) => {
        if (number === 'N/A') return;
        
        const phoneNumber = Platform.OS === 'android' ? `tel:${number}` : `telprompt:${number}`;
        Linking.openURL(phoneNumber).catch(err => console.error('Error making phone call:', err));
      };
      
    const handleBack = () => {
      if (selectedService) {
        setSelectedService(null);
      } else if (selectedCategory) {
        setSelectedCategory(null);
        setSearchQuery(''); // Reset search query when going back to categories
      }
    };
  
    // Filter categories when no category is selected
    const filteredCategories = emergencyCategories.filter(category =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
    // Filter services within the selected category (e.g., Police stations)
    const filteredServices = selectedCategory
      ? selectedCategory.services.filter(service =>
          service.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : [];
  
    return (
      <SafeAreaView style={styles.container}>
        {/* Custom Header for Sub-Screens */}
        {(selectedCategory || selectedService) && (
          <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color="#6B7280" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {selectedService ? selectedService.name : selectedCategory ? selectedCategory.name : 'Quick Search'}
            </Text>
          </Animated.View>
        )}
  
        {/* Search Bar */}
        <Animated.View entering={FadeInDown.duration(300)} style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#6B7280" />
            <TextInput
              style={styles.searchInput}
              placeholder={selectedCategory ? `Search ${selectedCategory.name.toLowerCase()}...` : "Search emergency services..."}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#6B7280"
            />
          </View>
        </Animated.View>
  
        {/* Main Content */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {!selectedCategory && (
            <View style={styles.categoriesGrid}>
              {filteredCategories.map((category, index) => (
                <Animated.View
                  key={category.id}
                  entering={FadeInDown.delay(index * 100).duration(400)}
                  style={styles.categoryContainer}
                >
                  <TouchableOpacity
                    style={[styles.categoryCard, { backgroundColor: category.backgroundColor }]}
                    onPress={() => handleCategorySelect(category)}
                  >
                    <View style={styles.categoryIcon}>{category.icon}</View>
                    <Text style={styles.categoryName}>{category.name}</Text>
                    <Text style={styles.servicesCountText}>
                      {category.services.length} available
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          )}
  
          {selectedCategory && !selectedService && (
            <View style={styles.servicesList}>
              {filteredServices.map((service, index) => (
                <Animated.View
                  key={service.id}
                  entering={FadeInDown.delay(index * 100).duration(400)}
                >
                  <TouchableOpacity
                    style={styles.serviceCard}
                    onPress={() => handleServiceSelect(service)}
                  >
                    <View style={styles.serviceInfo}>
                      <Text style={styles.serviceName}>{service.name}</Text>
                      <View style={styles.serviceDetails}>
                        <View style={styles.serviceDetail}>
                          <MapPin size={16} color="#6B7280" />
                          <Text style={styles.serviceDetailText}>{service.distance}</Text>
                        </View>
                      </View>
                      {/* Display all available contact numbers */}
                      {service.contacts && Object.entries(service.contacts).map(([key, value], idx) => {
                        const number = extractNumber(value);
                        return (
                          <View key={idx} style={styles.contactRow}>
                            <Phone size={16} color="#6B7280" />
                            <Text style={styles.contactLabel}>{key}:</Text>
                            <Text style={styles.serviceDetailText}>{number}</Text>
                          </View>
                        );
                      })}
                    </View>
                    <ChevronRight size={20} color="#6B7280" />
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          )}
  
          {selectedService && (
            <Animated.View 
              style={styles.serviceDetails}
              entering={FadeInDown.duration(400)}
            >
              <View style={styles.serviceDetailCard}>
                <Text style={styles.serviceDetailTitle}>{selectedService.name}</Text>
                <View style={styles.serviceDetailRow}>
                  <MapPin size={20} color="#3B82F6" />
                  <Text style={styles.serviceDetailAddress}>{selectedService.address}</Text>
                </View>
                <View style={styles.serviceDetailRow}>
                  <MapPin size={20} color="#3B82F6" />
                  <Text style={styles.serviceDetailDistance}>{selectedService.distance} away</Text>
                </View>
  
                {/* Display all available contact numbers */}
                {selectedService.contacts && Object.entries(selectedService.contacts).map(([key, value], index) => {
                  const number = extractNumber(value);
                  return (
                    <View key={index} style={styles.contactRow}>
                      <Text style={styles.contactLabel}>{key}:</Text>
                      <TouchableOpacity
                        style={[styles.callButton, number === 'N/A' && styles.disabledButton]}
                        onPress={() => handleCall(number)}
                        disabled={number === 'N/A'}
                      >
                        <Phone size={20} color="#FFFFFF" />
                        <Text style={styles.callButtonText}>{number}</Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
  
              <View style={styles.mapContainer}>
                <Text style={styles.mapPlaceholder}>Map View (Coming Soon)</Text>
              </View>
            </Animated.View>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: '#FFFFFF',
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB',
    },
    backButton: {
      marginRight: 12,
      padding: 8,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#1F2937',
      fontFamily: 'Inter-SemiBold',
      flex: 1,
    },
    searchContainer: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: '#FFFFFF',
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F5F5F5',
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
    searchInput: {
      flex: 1,
      marginLeft: 8,
      fontSize: 16,
      color: '#1F2937',
      fontFamily: 'Inter-Regular',
    },
    scrollView: {
      flex: 1,
    },
    categoriesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 16,
      paddingVertical: 8,
      justifyContent: 'space-between',
    },
    categoryContainer: {
      width: '48%',
      marginBottom: 16,
    },
    categoryCard: {
      borderRadius: 16,
      padding: 16,
      alignItems: 'center',
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    categoryIcon: {
      marginBottom: 12,
    },
    categoryName: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
      marginBottom: 8,
      textAlign: 'center',
      fontFamily: 'Inter-SemiBold',
    },
    servicesCountText: {
      fontSize: 12,
      color: '#FFFFFF',
      fontFamily: 'Inter-Medium',
      opacity: 0.9,
    },
    servicesList: {
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    serviceCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      borderWidth: 1,
      borderColor: '#E5E7EB',
    },
    serviceInfo: {
      flex: 1,
    },
    serviceName: {
      fontSize: 16,
      fontWeight: '500',
      color: '#1F2937',
      marginBottom: 6,
      fontFamily: 'Inter-Medium',
    },
    serviceDetails: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 6,
    },
    serviceDetail: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 16,
    },
    serviceDetailText: {
      fontSize: 14,
      color: '#6B7280',
      marginLeft: 6,
      fontFamily: 'Inter-Regular',
    },
    contactRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    contactLabel: {
      fontSize: 14,
      color: '#6B7280',
      marginLeft: 6,
      fontFamily: 'Inter-Regular',
    },
    serviceDetailCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      padding: 20,
      marginBottom: 16,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      borderWidth: 1,
      borderColor: '#E5E7EB',
    },
    serviceDetailTitle: {
      fontSize: 22,
      fontWeight: '600',
      color: '#1F2937',
      marginBottom: 16,
      fontFamily: 'Inter-SemiBold',
    },
    serviceDetailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    serviceDetailAddress: {
      fontSize: 16,
      color: '#1F2937',
      marginLeft: 8,
      flex: 1,
      fontFamily: 'Inter-Regular',
    },
    serviceDetailDistance: {
      fontSize: 16,
      color: '#1F2937',
      marginLeft: 8,
      fontFamily: 'Inter-Regular',
    },
    callButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#3B82F6',
      borderRadius: 12,
      paddingVertical: 8,
      paddingHorizontal: 12,
      flex: 1,
    },
    disabledButton: {
      backgroundColor: '#D1D5DB', // Gray color for disabled state
    },
    callButtonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
      marginLeft: 8,
      fontFamily: 'Inter-SemiBold',
    },
    mapContainer: {
      height: 200,
      backgroundColor: '#E5E7EB',
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 16,
      marginBottom: 16,
    },
    mapPlaceholder: {
      fontSize: 16,
      color: '#6B7280',
      fontFamily: 'Inter-Medium',
    },
  });
