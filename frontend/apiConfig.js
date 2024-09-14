import Constants from "expo-constants";

const { databaseIp, placesApiKey } = Constants.expoConfig.extra;
export const PLACES_API_KEY = placesApiKey;
export const API_BASE_URL = `http://${databaseIp}:8082/api/chargesites`;

export default API_BASE_URL;
