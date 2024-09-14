import "dotenv/config";

export default {
  expo: {
    name: "TeamSparkleMotion",
    slug: "TeamSparkleMotion",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      infoPlist: {
        NSLocationWhenInUseUsageDescription:
          "This app uses your location to show nearby charging stations.",
        NSLocationAlwaysUsageDescription:
          "This app needs access to your location to show nearby charging stations even when the app is in the background.",
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      permissions: [
        "ACCESS_COARSE_LOCATION",
        "ACCESS_FINE_LOCATION",
        "INTERNET",
      ],
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: ["expo-router"],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      databaseIp: process.env.REACT_APP_DATABASE_IP,
      placesApiKey: process.env.PLACES_API_KEY,
    },
  },
};
