// SOSSettingsScreen.js
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, TextInput, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Bell, Volume2, MapPin, Users, Plus, ChevronRight, Search, X, Trash2 } from "lucide-react-native";
import Colors from "../../../constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useToast } from "../../../components/ToastProvider";

const BASE_URL = "https://ride.emplique.com";

// Move these interfaces to the top of the file, right after the imports
interface Contact {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  image: string;
}

interface User {
  id: string | number;
  first_name: string;
  last_name: string;
  email: string;
}

interface APIContact {
  id: string | number;
  contact: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    image: string;
  };
}

export default function SOSSettingsScreen() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  // Update the state declaration near the top of the component
  const [emergencyContacts, setEmergencyContacts] = useState<Contact[]>([]);
  const [customMessage, setCustomMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  // Add these interfaces at the top of the file, after the imports
  interface Contact {
    id: string | number;
    name: string;
    email: string;
    phone: string;
    image: string;
  }

  // Update the state declaration
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  // Add this interface near the Contact interface
  interface User {
    id: string | number;
    first_name: string;
    last_name: string;
    email: string;
  }

  // Update the state declarations
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    fetchEmergencyContacts();
    fetchUserSettings();
  }, []);

  const fetchUserSettings = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("access_token");
      if (!token) {
        showToast("Please log in to fetch settings", "error");
        router.replace("/auth/login");
        return;
      }

      const response = await fetch(`${BASE_URL}/api/sos/settings/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("Fetched user settings:", data);

      if (response.ok) {
        setSoundEnabled(data.sound_enabled);
        setLocationEnabled(data.location_enabled);
        setNotificationsEnabled(data.notifications_enabled);
        setVibrationEnabled(data.vibration_enabled);
        setCustomMessage(data.emergency_message || "");
      } else {
        showToast("Failed to fetch settings: " + (data.message || "Unknown error"), "error");
      }
    } catch (error) {
      showToast("Network error fetching settings", "error");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmergencyContacts = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("access_token");
      if (!token) {
        showToast("Please log in to fetch emergency contacts", "error");
        router.replace("/auth/login");
        return;
      }

      const response = await fetch(`${BASE_URL}/api/sos/emergency-contacts/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = (await response.json()) as APIContact[];

      if (response.ok) {
        const formattedContacts: Contact[] = data.map((contact) => ({
          id: contact.id,
          name: `${contact.contact.first_name} ${contact.contact.last_name}`,
          email: contact.contact.email || "N/A",
          phone: contact.contact.phone_number || "N/A",
          image: contact.contact.image || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
        }));
        setEmergencyContacts(formattedContacts);
        if (formattedContacts.length === 0) {
          showToast("No emergency contacts found", "info");
        }
      } else {
        showToast("Failed to fetch emergency contacts: Unknown error", "error");
      }
    } catch (error) {
      showToast("Network error fetching emergency contacts", "error");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) {
        showToast("Please log in to fetch users", "error");
        return;
      }

      const response = await fetch(`${BASE_URL}/api/sos/users/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("Fetched users data:", data);
      if (response.ok) {
        const userArray = Array.isArray(data) ? data : data.users || [];
        setUsers(userArray);
        setFilteredUsers(userArray);
        if (userArray.length === 0) {
          showToast("No users found from the API", "info");
        }
      } else {
        showToast("Failed to fetch users: " + (data.message || "Unknown error"), "error");
      }
    } catch (error) {
      showToast("Network error fetching users", "error");
      console.error("Error:", error);
    }
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    const filtered = users.filter((user) => `${user.first_name} ${user.last_name}`.toLowerCase().includes(text.toLowerCase()) || user.email.toLowerCase().includes(text.toLowerCase()));
    setFilteredUsers(filtered);
  };

  const addEmergencyContact = async (contactId: string | number) => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("access_token");
      if (!token) {
        showToast("Please log in to add emergency contact", "error");
        router.replace("/auth/login");
        return;
      }

      const response = await fetch(`${BASE_URL}/api/sos/emergency-contacts/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ contact_id: contactId }),
      });

      const data = await response.json();
      console.log("Add emergency contact response:", data);

      if (response.ok) {
        await fetchEmergencyContacts();
        setShowSearchModal(false);
        setSearchQuery("");
        setFilteredUsers([]);
        showToast("Emergency contact added successfully", "success");
      } else {
        showToast(data.error || "Failed to add emergency contact", "error");
      }
    } catch (error) {
      showToast("Network error adding emergency contact", "error");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeEmergencyContact = async (contactId: string | number) => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("access_token");
      if (!token) {
        showToast("Please log in to remove emergency contact", "error");
        router.replace("/auth/login");
        return;
      }

      const response = await fetch(`${BASE_URL}/api/sos/emergency-contacts/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ contact_id: contactId }),
      });

      const data = await response.json();
      console.log("Remove emergency contact response:", data);

      if (response.ok) {
        await fetchEmergencyContacts();
        setShowContactModal(false);
        showToast("Emergency contact removed successfully", "success");
      } else {
        showToast(data.error || "Failed to remove emergency contact", "error");
      }
    } catch (error) {
      showToast("Network error removing emergency contact", "error");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("access_token");
      if (!token) {
        showToast("Please log in to save settings", "error");
        router.replace("/auth/login");
        return;
      }

      const settingsData = {
        sound_enabled: soundEnabled,
        location_enabled: locationEnabled,
        notifications_enabled: notificationsEnabled,
        vibration_enabled: vibrationEnabled,
        emergency_message: customMessage,
      };

      const response = await fetch(`${BASE_URL}/api/sos/settings/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settingsData),
      });

      const data = await response.json();
      console.log("Save settings response:", data);

      if (response.ok) {
        showToast("Settings saved successfully", "success");
      } else {
        showToast("Failed to save settings: " + (data.message || "Unknown error"), "error");
      }
    } catch (error) {
      showToast("Network error saving settings", "error");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const openContactModal = (contact: Contact) => {
    setSelectedContact(contact);
    setShowContactModal(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Contacts</Text>
          <TouchableOpacity
            style={styles.addContactButton}
            onPress={() => {
              fetchUsers();
              setShowSearchModal(true);
            }}
            disabled={loading}
          >
            <Plus size={20} color={Colors.light.primary} />
            <Text style={styles.addContactText}>Add Emergency Contact</Text>
          </TouchableOpacity>

          {emergencyContacts.map((contact) => (
            <TouchableOpacity key={contact.id} style={styles.contactCard} onPress={() => openContactModal(contact)}>
              <Image source={{ uri: contact.image }} style={styles.contactImage} />
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactPhone}>{contact.phone}</Text>
              </View>
              <ChevronRight size={20} color={Colors.light.subtext} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Alert Settings</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Bell size={20} color={Colors.light.text} />
              <Text style={styles.settingText}>Push Notifications</Text>
            </View>
            <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} trackColor={{ false: Colors.light.border, true: Colors.light.primary }} thumbColor="#FFFFFF" />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Volume2 size={20} color={Colors.light.text} />
              <Text style={styles.settingText}>Emergency Sound</Text>
            </View>
            <Switch value={soundEnabled} onValueChange={setSoundEnabled} trackColor={{ false: Colors.light.border, true: Colors.light.primary }} thumbColor="#FFFFFF" />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <MapPin size={20} color={Colors.light.text} />
              <Text style={styles.settingText}>Location Sharing</Text>
            </View>
            <Switch value={locationEnabled} onValueChange={setLocationEnabled} trackColor={{ false: Colors.light.border, true: Colors.light.primary }} thumbColor="#FFFFFF" />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Users size={20} color={Colors.light.text} />
              <Text style={styles.settingText}>Vibration</Text>
            </View>
            <Switch value={vibrationEnabled} onValueChange={setVibrationEnabled} trackColor={{ false: Colors.light.border, true: Colors.light.primary }} thumbColor="#FFFFFF" />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Message</Text>
          <TextInput style={styles.messageInput} multiline numberOfLines={4} placeholder="Enter custom emergency message..." placeholderTextColor={Colors.light.subtext} value={customMessage} onChangeText={setCustomMessage} />
        </View>

        <TouchableOpacity style={[styles.saveButton, loading && styles.disabledButton]} onPress={saveSettings} disabled={loading}>
          <Text style={styles.saveButtonText}>{loading ? "Saving..." : "Save Settings"}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Search Modal */}
      {showSearchModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Emergency Contact</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowSearchModal(false);
                  setSearchQuery("");
                  setFilteredUsers([]);
                }}
                style={styles.closeButton}
              >
                <X size={24} color={Colors.light.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <Search size={20} color={Colors.light.subtext} />
              <TextInput style={styles.searchInput} placeholder="Search by name or email" value={searchQuery} onChangeText={handleSearch} placeholderTextColor={Colors.light.subtext} />
            </View>

            <ScrollView style={styles.userList}>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TouchableOpacity key={user.id} style={styles.userItem} onPress={() => addEmergencyContact(user.id)} disabled={loading}>
                    <View style={styles.userInfo}>
                      <Text style={styles.userName}>
                        {user.first_name} {user.last_name}
                      </Text>
                      <Text style={styles.userEmail}>{user.email}</Text>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.noUsersText}>No users available</Text>
              )}
            </ScrollView>
          </View>
        </View>
      )}

      {/* Contact Details Modal */}
      {showContactModal && selectedContact && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Contact Details</Text>
              <TouchableOpacity onPress={() => setShowContactModal(false)} style={styles.closeButton}>
                <X size={24} color={Colors.light.text} />
              </TouchableOpacity>
            </View>
            // The JSX part will now work without type errors
            <View style={styles.contactDetailContainer}>
              <Image source={{ uri: selectedContact.image }} style={styles.contactDetailImage} />
              <Text style={styles.contactDetailName}>{selectedContact.name}</Text>
              <Text style={styles.contactDetailLabel}>Email:</Text>
              <Text style={styles.contactDetailValue}>{selectedContact.email}</Text>
              <Text style={styles.contactDetailLabel}>Phone:</Text>
              <Text style={styles.contactDetailValue}>{selectedContact.phone}</Text>

              <TouchableOpacity style={styles.removeButton} onPress={() => removeEmergencyContact(selectedContact.id)} disabled={loading}>
                <Trash2 size={20} color="#FFFFFF" />
                <Text style={styles.removeButtonText}>{loading ? "Removing..." : "Remove Contact"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 16,
    backgroundColor: Colors.light.card,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 16,
    fontFamily: "Inter-SemiBold",
  },
  addContactButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.light.primary,
    borderStyle: "dashed",
  },
  addContactText: {
    marginLeft: 8,
    fontSize: 16,
    color: Colors.light.primary,
    fontFamily: "Inter-Medium",
  },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  contactImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.light.text,
    marginBottom: 2,
    fontFamily: "Inter-Medium",
  },
  contactPhone: {
    fontSize: 14,
    color: Colors.light.subtext,
    fontFamily: "Inter-Regular",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingText: {
    marginLeft: 12,
    fontSize: 16,
    color: Colors.light.text,
    fontFamily: "Inter-Regular",
  },
  messageInput: {
    backgroundColor: Colors.light.background,
    borderRadius: 8,
    padding: 12,
    height: 100,
    textAlignVertical: "top",
    fontSize: 16,
    color: Colors.light.text,
    fontFamily: "Inter-Regular",
  },
  saveButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
    padding: 16,
    margin: 16,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Inter-SemiBold",
  },
  disabledButton: {
    backgroundColor: Colors.light.border,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.light.text,
    fontFamily: "Inter-SemiBold",
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8,
    fontSize: 16,
    color: Colors.light.text,
    fontFamily: "Inter-Regular",
  },
  userList: {
    maxHeight: "70%",
  },
  userItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.light.text,
    fontFamily: "Inter-Medium",
  },
  userEmail: {
    fontSize: 14,
    color: Colors.light.subtext,
    fontFamily: "Inter-Regular",
  },
  noUsersText: {
    fontSize: 16,
    color: Colors.light.subtext,
    textAlign: "center",
    padding: 20,
    fontFamily: "Inter-Regular",
  },
  // Styles for Contact Details Modal
  contactDetailContainer: {
    alignItems: "center",
  },
  contactDetailImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  contactDetailName: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 16,
    fontFamily: "Inter-SemiBold",
  },
  contactDetailLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.light.subtext,
    alignSelf: "flex-start",
    marginBottom: 4,
    fontFamily: "Inter-Medium",
  },
  contactDetailValue: {
    fontSize: 16,
    color: Colors.light.text,
    alignSelf: "flex-start",
    marginBottom: 12,
    fontFamily: "Inter-Regular",
  },
  removeButton: {
    flexDirection: "row",
    backgroundColor: "#FF4444",
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  removeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
    fontFamily: "Inter-SemiBold",
  },
});
