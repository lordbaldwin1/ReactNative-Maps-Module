import { Dimensions, StyleSheet } from "react-native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");
export const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: "#383838",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  button: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#007AFF",
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  customMarker: {
    justifyContent: "center",
    alignItems: "center",
  },
  searchBarContainer: {
    position: "absolute",
    left: 10,
    right: 10,
    zIndex: 1,
  },
});
