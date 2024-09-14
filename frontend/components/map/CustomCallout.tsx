import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import OpenURLButton from "./OpenURLButton";
import { ThemedText } from "../ThemedText";
import { ChargeSite } from "./MapScreen";

interface CustomCalloutProps {
  chargeSite: ChargeSite;
  onClose: () => void;
}

const CustomCallout: React.FC<CustomCalloutProps> = ({
  chargeSite,
  onClose,
}) => {
  const reservationStatus = chargeSite.reservedStatus
    ? "Reserved"
    : "Available";
  const privacyStatus = chargeSite.privateStatus ? "Private" : "Public";
  const screenWidth = Dimensions.get("window").width;
  const calloutWidth = screenWidth * 0.7; // Adjust the width factor as needed

  return (
    <View
      style={[styles.container, { left: (screenWidth - calloutWidth) / 2 }]}
    >
      <View style={[styles.bubble, { width: calloutWidth }]}>
        <ThemedText type="calloutTitle">
          Ranger Station ID {chargeSite.userId}
        </ThemedText>
        <ThemedText type="calloutLabel">Address</ThemedText>
        <ThemedText type="calloutText">
          Placeholder: 1619 NE 81st Ave, Portland OR, 97213
        </ThemedText>
        <ThemedText type="calloutLabel">Charger Type</ThemedText>
        <ThemedText type="calloutText">Placeholder: Type 1</ThemedText>
        <ThemedText type="calloutLabel">Charger Speed</ThemedText>
        <ThemedText type="calloutText">{chargeSite.rateOfCharge} kW</ThemedText>
        <ThemedText type="calloutLabel">Reservation Status</ThemedText>
        <ThemedText type="calloutText">{reservationStatus}</ThemedText>
        <ThemedText type="calloutLabel">Private Status</ThemedText>
        <ThemedText type="calloutText">{privacyStatus}</ThemedText>
        <OpenURLButton
          latitude={chargeSite.latitude}
          longitude={chargeSite.longitude}
        />
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeButton}>Close</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.arrowBorder} />
      <View style={styles.arrow} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 105,
    backgroundColor: "transparent",
    alignItems: "center",
  },
  bubble: {
    backgroundColor: "#383737",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  closeButton: {
    marginTop: 10,
    color: "#F5F5F5",
    textAlign: "center",
  },
  arrow: {
    backgroundColor: "#383737",
    width: 20,
    height: 20,
    borderRadius: 4,
    transform: [{ rotate: "45deg" }],
    position: "absolute",
    bottom: -13,
    elevation: 5,
  },
  arrowBorder: {
    backgroundColor: "transparent",
    borderColor: "#383737",
    borderWidth: 4,
    width: 24,
    height: 24,
    borderRadius: 3,
    transform: [{ rotate: "45deg" }],
    position: "absolute",
    bottom: -11,
  },
});

export default CustomCallout;
