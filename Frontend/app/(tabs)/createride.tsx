import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import CreateRide from "../../components/Rides/CreateRides";
import Colors from "../../constants/Colors";

export default function CreateRidePage() {
  return (
    <SafeAreaView style={styles.container}>
      <CreateRide />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
});
