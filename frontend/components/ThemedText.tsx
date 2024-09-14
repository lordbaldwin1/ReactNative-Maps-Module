import { Text, type TextProps, StyleSheet } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?:
    | "default"
    | "title"
    | "defaultSemiBold"
    | "subtitle"
    | "link"
    | "calloutTitle"
    | "calloutLabel"
    | "calloutText";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <Text
      style={[
        { color },
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        type === "calloutTitle" ? styles.calloutTitle : undefined,
        type === "calloutLabel" ? styles.calloutLabel : undefined,
        type === "calloutText" ? styles.calloutText : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: "#0a7ea4",
  },
  calloutTitle: {
    color: "#F5F5F5",
    fontSize: 20,
    fontWeight: "400",
    letterSpacing: 0.5,
    marginBottom: 14,
  },
  calloutLabel: {
    color: "#F5F5F5",
    fontSize: 16,
    fontWeight: "300",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  calloutText: {
    color: "#F5F5F5",
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: 0.5,
    marginBottom: 14,
  },
});
