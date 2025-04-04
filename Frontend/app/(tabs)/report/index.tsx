import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  Image,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  FileWarning, 
  Search, 
  MapPin, 
  Clock, 
  ChevronUp, 
  ChevronDown,
  Plus,
  ThumbsUp,
  MessageSquare,
  Share2
} from 'lucide-react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Colors from '../../../constants/Colors';
import AnimatedPressable from '../../../components/AnimatedPressable';

// Sample data for incidents
const incidents = [
  {
    id: '1',
    type: 'traffic',
    title: 'Roadblock on Main Street',
    description: 'Major traffic congestion due to construction work...',
    location: 'Main Street',
    distance: '2.5 km away',
    time: '2 hours ago',
    likes: 234,
    comments: 18,
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
  },
  {
    id: '2',
    type: 'accident',
    title: 'Vehicle Collision',
    description: 'Minor accident between two cars at the intersection',
    location: 'Oak Avenue & Pine Street',
    distance: '1.2 km away',
    time: '45 min ago',
    likes: 56,
    comments: 7,
    image: 'https://images.unsplash.com/photo-1566024146785-a9362d3b4c0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
  },
  {
    id: '3',
    type: 'hazard',
    title: 'Fallen Tree',
    description: 'Large tree blocking half the road after storm',
    location: 'Riverside Drive',
    distance: '3.7 km away',
    time: '3 hours ago',
    likes: 89,
    comments: 12,
    image: 'https://images.unsplash.com/photo-1517309230475-6736d926b979?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
  },
  {
    id: '4',
    type: 'police',
    title: 'Police Checkpoint',
    description: 'Police conducting routine checks on all vehicles',
    location: 'Highway 101',
    distance: '5.1 km away',
    time: '1 hour ago',
    likes: 124,
    comments: 9,
    image: 'https://images.unsplash.com/photo-1566024146785-a9362d3b4c0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
  }
];

export default function IncidentReportingScreen() {
  const [activeFilter, setActiveFilter] = useState('nearMe');
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleCreateIncident = () => {
    router.push('/report/create-incident');
  };
  
  const renderIncidentItem = ({ item, index }) => (
    <Animated.View entering={FadeInDown.delay(index * 100).duration(400)}>
      <AnimatedPressable style={styles.incidentCard}>
        <View style={styles.incidentHeader}>
          <View style={styles.incidentTypeContainer}>
            <View style={[styles.incidentTypeBadge, getIncidentTypeBadgeStyle(item.type)]}>
              <Text style={styles.incidentTypeBadgeText}>{capitalizeFirstLetter(item.type)}</Text>
            </View>
            <TouchableOpacity style={styles.moreButton}>
              <View style={styles.moreButtonDots}>
                <View style={styles.moreButtonDot} />
                <View style={styles.moreButtonDot} />
                <View style={styles.moreButtonDot} />
              </View>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.incidentTitle}>{item.title}</Text>
          <Text style={styles.incidentDescription}>{item.description}</Text>
        </View>
        
        {item.image && (
          <View style={styles.incidentImageContainer}>
            <Image source={{ uri: item.image }} style={styles.incidentImage} />
          </View>
        )}
        
        <View style={styles.incidentFooter}>
          <View style={styles.incidentLocationTime}>
            <View style={styles.incidentLocation}>
              <MapPin size={14} color={Colors.light.subtext} />
              <Text style={styles.incidentLocationText}>{item.distance}</Text>
            </View>
            <View style={styles.incidentTime}>
              <Clock size={14} color={Colors.light.subtext} />
              <Text style={styles.incidentTimeText}>{item.time}</Text>
            </View>
          </View>
          
          <View style={styles.incidentActions}>
            <TouchableOpacity style={styles.incidentAction}>
              <ThumbsUp size={16} color={Colors.light.subtext} />
              <Text style={styles.incidentActionText}>{item.likes}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.incidentAction}>
              <MessageSquare size={16} color={Colors.light.subtext} />
              <Text style={styles.incidentActionText}>{item.comments}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.incidentAction}>
              <Share2 size={16} color={Colors.light.subtext} />
              <Text style={styles.incidentActionText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
  
  const getIncidentTypeBadgeStyle = (type) => {
    switch (type) {
      case 'traffic':
        return { backgroundColor: '#E1F5FE' };
      case 'accident':
        return { backgroundColor: '#FFEBEE' };
      case 'hazard':
        return { backgroundColor: '#FFF8E1' };
      case 'police':
        return { backgroundColor: '#E8EAF6' };
      default:
        return { backgroundColor: '#E0E0E0' };
    }
  };
  
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Incident Reporting</Text>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={handleCreateIncident}
        >
          <Plus size={20} color={Colors.light.text} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={18} color={Colors.light.subtext} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search incidents..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={Colors.light.subtext}
          />
        </View>
      </View>
      
      <View style={styles.filtersContainer}>
        <TouchableOpacity 
          style={[styles.filterButton, activeFilter === 'nearMe' && styles.activeFilterButton]}
          onPress={() => setActiveFilter('nearMe')}
        >
          <Text style={[styles.filterButtonText, activeFilter === 'nearMe' && styles.activeFilterButtonText]}>
            Near Me
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filterButton, activeFilter === 'last24h' && styles.activeFilterButton]}
          onPress={() => setActiveFilter('last24h')}
        >
          <Text style={[styles.filterButtonText, activeFilter === 'last24h' && styles.activeFilterButtonText]}>
            Last 24h
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filterButton, activeFilter === 'accidents' && styles.activeFilterButton]}
          onPress={() => setActiveFilter('accidents')}
        >
          <Text style={[styles.filterButtonText, activeFilter === 'accidents' && styles.activeFilterButtonText]}>
            Accidents
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filterButton, activeFilter === 'traffic' && styles.activeFilterButton]}
          onPress={() => setActiveFilter('traffic')}
        >
          <Text style={[styles.filterButtonText, activeFilter === 'traffic' && styles.activeFilterButtonText]}>
            Traffic
          </Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={incidents}
        renderItem={renderIncidentItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
      
      <TouchableOpacity 
        style={styles.floatingButton}
        onPress={handleCreateIncident}
      >
        <FileWarning size={24} color="#FFFFFF" />
      </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.light.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text,
    fontFamily: 'Inter-SemiBold',
  },
  createButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.light.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.light.card,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: Colors.light.text,
    fontFamily: 'Inter-Regular',
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.light.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  activeFilterButton: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  filterButtonText: {
    fontSize: 14,
    color: Colors.light.text,
    fontFamily: 'Inter-Medium',
  },
  activeFilterButtonText: {
    color: '#FFFFFF',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80, // Extra padding for the floating button
  },
  incidentCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  incidentHeader: {
    padding: 16,
  },
  incidentTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  incidentTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
  },
  incidentTypeBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.light.text,
    fontFamily: 'Inter-Medium',
  },
  moreButton: {
    padding: 4,
  },
  moreButtonDots: {
    flexDirection: 'row',
  },
  moreButtonDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.light.subtext,
    marginHorizontal: 1,
  },
  incidentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
    fontFamily: 'Inter-SemiBold',
  },
  incidentDescription: {
    fontSize: 14,
    color: Colors.light.subtext,
    fontFamily: 'Inter-Regular',
  },
  incidentImageContainer: {
    width: '100%',
    height: 200,
  },
  incidentImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  incidentFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  incidentLocationTime: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  incidentLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  incidentLocationText: {
    fontSize: 12,
    color: Colors.light.subtext,
    marginLeft: 4,
    fontFamily: 'Inter-Regular',
  },
  incidentTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  incidentTimeText: {
    fontSize: 12,
    color: Colors.light.subtext,
    marginLeft: 4,
    fontFamily: 'Inter-Regular',
  },
  incidentActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    paddingTop: 12,
  },
  incidentAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  incidentActionText: {
    fontSize: 14,
    color: Colors.light.subtext,
    marginLeft: 4,
    fontFamily: 'Inter-Regular',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});