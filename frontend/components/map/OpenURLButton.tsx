import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Linking,
  Alert,
  Platform,
  ActionSheetIOS,
  Modal,
  FlatList,
} from "react-native";

interface OpenURLButtonProps {
  latitude: number;
  longitude: number;
}

const OpenURLButton: React.FC<OpenURLButtonProps> = ({
  latitude,
  longitude,
}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [availableApps, setAvailableApps] = useState<string[]>([]);

  useEffect(() => {
    checkAvailableApps();
  }, []);

  const checkAvailableApps = async () => {
    const apps = [
      {
        name: "Google Maps",
        url: `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
      },
      {
        name: "Apple Maps",
        url: `http://maps.apple.com/?daddr=${latitude},${longitude}`,
      },
      { name: "Waze", url: `waze://?ll=${latitude},${longitude}&navigate=yes` },
    ];

    const availableApps = [];
    for (const app of apps) {
      const supported = await Linking.canOpenURL(app.url);
      if (
        supported &&
        !(Platform.OS === "android" && app.name === "Apple Maps")
      ) {
        availableApps.push(app.name);
      }
    }
    setAvailableApps(availableApps);
  };

  const handleClick = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [...availableApps, "Cancel"],
          cancelButtonIndex: availableApps.length,
        },
        (buttonIndex) => {
          if (buttonIndex !== availableApps.length) {
            const selectedOption = availableApps[buttonIndex];
            openUrl(getUrlForApp(selectedOption));
          }
        },
      );
    } else {
      setModalVisible(true);
    }
  };

  const getUrlForApp = (app: string) => {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    const appleMapsUrl = `http://maps.apple.com/?daddr=${latitude},${longitude}`;
    const wazeUrl = `waze://?ll=${latitude},${longitude}&navigate=yes`;

    const appUrls: { [key: string]: string } = {
      "Google Maps": googleMapsUrl,
      "Apple Maps": appleMapsUrl,
      Waze: wazeUrl,
    };

    return appUrls[app];
  };

  const openUrl = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url).catch((err) =>
        console.error("Failed to open URL:", err),
      );
    } else {
      Alert.alert(
        "Error",
        "This app cannot be opened, do you have it installed?",
      );
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={handleClick}>
        <View style={styles.button}>
          <Text style={styles.text}>Show Route</Text>
        </View>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Navigation App</Text>
            <FlatList
              data={availableApps}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={() => {
                    setModalVisible(false);
                    openUrl(getUrlForApp(item));
                  }}
                >
                  <Text style={styles.optionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    backgroundColor: "#FFC00E",
    borderRadius: 20,
    marginTop: 10,
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  text: {
    color: "#000000",
    fontWeight: "600",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "blue",
    borderRadius: 5,
    marginVertical: 5,
  },
  optionText: {
    color: "white",
    textAlign: "center",
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "red",
    borderRadius: 5,
    marginTop: 10,
  },
  cancelButtonText: {
    color: "white",
    textAlign: "center",
  },
});

export default OpenURLButton;
