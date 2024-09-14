import { StyleSheet } from "react-native";

export const clearButtonStyle = StyleSheet.create({
  clearButton: {
    position: "absolute",
    right: 10,
    top: 10,
    zIndex: 1,
  },
});

export const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    left: 10,
    right: 10,
    zIndex: 10,
  },
  textInputContainer: {
    flexDirection: "row",
    backgroundColor: "#383838",
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#ccc",
  },
  textInput: {
    backgroundColor: "#383838",
    color: "#fff",
    height: 44,
    borderRadius: 100,
    paddingVertical: 10,
    paddingHorizontal: 20,
    fontSize: 15,
    flex: 1,
  },
  listView: {
    backgroundColor: "#383838",
    marginTop: 5,
    borderRadius: 10,
    borderColor: "#fff",
    borderWidth: 2,
    paddingHorizontal: 5,
    paddingVertical: 5,
    maxHeight: 400,
  },
  row: {
    backgroundColor: "#383838",
    paddingVertical: 15,
    paddingHorizontal: 5,
    minHeight: 60,
  },
  description: {
    color: "#fff",
    fontSize: 14,
  },
  separator: {
    height: 1,
    backgroundColor: "#fff",
    marginTop: 10,
  },
});
