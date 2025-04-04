import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clock } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import Colors from '../../constants/Colors';
import AnimatedPressable from '../../components/AnimatedPressable';
import { runOnJS } from 'react-native-reanimated';

export default function HistoryScreen() {
  const rideHistory = [
    {
      id: '1',
      type: 'passenger',
      from: 'University Campus',
      to: 'Downtown',
      date: 'May 15, 2025',
      time: '10:30 AM',
      price: '$5.50',
      driver: {
        name: 'John Doe',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
      },
      status: 'completed',
    },
    {
      id: '2',
      type: 'driver',
      from: 'Shopping Mall',
      to: 'Residential Area',
      date: 'May 12, 2025',
      time: '2:15 PM',
      price: '$12.75',
      passengers: 3,
      status: 'completed',
    },
    {
      id: '3',
      type: 'passenger',
      from: 'Airport',
      to: 'Hotel Zone',
      date: 'May 10, 2025',
      time: '8:45 PM',
      price: '$15.00',
      driver: {
        name: 'Sarah Johnson',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
      },
      status: 'cancelled',
    },
    {
      id: '4',
      type: 'driver',
      from: 'Home',
      to: 'Office',
      date: 'May 8, 2025',
      time: '8:30 AM',
      price: '$18.00',
      passengers: 2,
      status: 'completed',
    },
  ];

  const renderHistoryItem = ({ item, index }) => {
    const handlePress = () => {
      // Your press handler logic here
      console.log('Item pressed:', item.id);
    };

    return (
      <Animated.View 
        entering={FadeInUp.delay(index * 100).duration(400)}
        style={styles.historyItemContainer}
      >
        <AnimatedPressable 
          style={styles.historyCard}
          onPress={handlePress} // Use the proper handler
        >
          <View style={styles.historyHeader}>
            <View style={styles.historyTypeContainer}>
              <Text style={styles.historyTypeText}>
                {item.type === 'driver' ? 'You drove' : 'You rode'}
              </Text>
              <View style={[styles.statusBadge, { backgroundColor: item.status === 'completed' ? '#E1F5E1' : '#FFE5E5' }]}>
                <Text style={[styles.statusText, { color: item.status === 'completed' ? Colors.light.success : Colors.light.error }]}>
                  {item.status === 'completed' ? 'Completed' : 'Cancelled'}
                </Text>
              </View>
            </View>
            <Text style={styles.priceText}>{item.price}</Text>
          </View>

          <View style={styles.routeContainer}>
            <View style={styles.routePoints}>
              <View style={styles.routePointDot} />
              <View style={styles.routeLine} />
              <View style={[styles.routePointDot, styles.routePointDotDestination]} />
            </View>
            <View style={styles.routeDetails}>
              <View style={styles.routePoint}>
                <Text style={styles.routePointText}>{item.from}</Text>
              </View>
              <View style={styles.routePoint}>
                <Text style={styles.routePointText}>{item.to}</Text>
              </View>
            </View>
          </View>

          <View style={styles.historyDetails}>
            <View style={styles.historyDetailItem}>
              <Clock size={16} color={Colors.light.subtext} />
              <Text style={styles.historyDetailText}>{item.time}, {item.date}</Text>
            </View>
          </View>

          {item.type === 'passenger' && item.driver && (
            <View style={styles.driverInfo}>
              <Image source={{ uri: item.driver.image }} style={styles.driverImage} />
              <View>
                <Text style={styles.driverName}>{item.driver.name}</Text>
                <View style={styles.ratingContainer}>
                  <Text style={styles.ratingText}>{item.driver.rating}</Text>
                  <Text style={styles.ratingStars}>★★★★★</Text>
                </View>
              </View>
            </View>
          )}

          {item.type === 'driver' && (
            <View style={styles.passengerInfo}>
              <Text style={styles.passengerCount}>{item.passengers} passengers</Text>
            </View>
          )}
        </AnimatedPressable>
      </Animated.View>
    );
  };

  const ListHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Ride History</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={rideHistory}
        renderItem={renderHistoryItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={ListHeader}
        showsVerticalScrollIndicator={false}
        bounces={true}
        overScrollMode="never"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
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
  listContainer: {
    padding: 16,
  },
  historyCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  historyTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyTypeText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    fontFamily: 'Inter-Medium',
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  priceText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.primary,
    fontFamily: 'Inter-SemiBold',
  },
  routeContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  routePoints: {
    width: 20,
    alignItems: 'center',
    marginRight: 10,
  },
  routePointDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.light.primary,
  },
  routePointDotDestination: {
    backgroundColor: Colors.light.error,
  },
  routeLine: {
    width: 2,
    height: 30,
    backgroundColor: '#E0E0E0',
    marginVertical: 5,
  },
  routeDetails: {
    flex: 1,
  },
  routePoint: {
    height: 25,
    justifyContent: 'center',
    marginBottom: 5,
  },
  routePointText: {
    fontSize: 15,
    color: Colors.light.text,
    fontFamily: 'Inter-Regular',
  },
  historyDetails: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  historyDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  historyDetailText: {
    fontSize: 14,
    color: Colors.light.subtext,
    marginLeft: 5,
    fontFamily: 'Inter-Regular',
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  driverImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    fontFamily: 'Inter-Medium',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  ratingText: {
    fontSize: 14,
    color: Colors.light.subtext,
    marginRight: 5,
    fontFamily: 'Inter-Regular',
  },
  ratingStars: {
    fontSize: 12,
    color: '#FFD700',
  },
  passengerInfo: {
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  passengerCount: {
    fontSize: 16,
    color: Colors.light.text,
    fontFamily: 'Inter-Medium',
  },
});