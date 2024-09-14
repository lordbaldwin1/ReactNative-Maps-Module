import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  TouchableOpacity,
  Alert,
  Linking,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  Keyboard,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  Marker,
  Region,
  LatLng,
  PROVIDER_GOOGLE,
  Circle,
} from "react-native-maps";
import ClusteredMapView from "react-native-map-clustering";
import * as Location from "expo-location";
import customMapStyle from "../../styles/mapStyle.json";
import API_BASE_URL from "../../apiConfig.js";
import { debounce } from "lodash";
import { fetchWithTimeout } from "../../utils/fetchWithTimeout";
import { styles } from "../../styles/MapScreenStyles";
import CustomMarker from "./CustomMarker";
import { pinColors } from "@/styles/Colors";
import CustomCallout from "./CustomCallout";
import SearchBar from "./SearchBar";
import { Point } from "react-native-google-places-autocomplete";

const initialRegion = {
  latitude: 45.54698979840522,
  longitude: -122.66310214492715,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

/**
 * This is the TypeScript equivalent of ResponseChargeSite.java.
 */
export type ChargeSite = {
  id: number;
  userId: number;
  latitude: number;
  longitude: number;
  obfuscatedStatus: boolean;
  reservedStatus: boolean;
  privateStatus: boolean;
  rateOfCharge: number;
};

export const getMarkerColor = (
  privateStatus: boolean,
  reservedStatus: boolean,
): string => {
  const key = `${privateStatus ? "private" : "public"}${reservedStatus ? "Reserved" : "Available"}`;
  return pinColors[key as keyof typeof pinColors];
};

const MapScreen = (): JSX.Element => {
  const [isMapCentered, setIsMapCentered] = useState(false);
  const [calloutOpacity] = useState(new Animated.Value(0));
  const [currentRegion, setCurrentRegion] = useState<Region>(initialRegion);
  const [queriedRegion, setQueriedRegion] = useState<Region>(initialRegion);
  const [currentPosition, setCurrentPosition] = useState<LatLng | null>(null);
  const [chargeSites, setChargeSites] = useState<Array<ChargeSite>>([]);
  const [selectedChargeSite, setSelectedChargeSite] =
    useState<ChargeSite | null>(null);
  const chargeSitesRef = useRef(chargeSites);
  const mapRef = useRef<ClusteredMapView>(null);
  const isCenteringRef = useRef(false);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const userGestureRef = useRef(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [searchBarTop] = useState(new Animated.Value(30));
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const [isCalloutClosed, setIsCalloutClosed] = useState(false);
  const isAnimatingRef = useRef(false);
  const isMarkerPressInProgressRef = useRef(false);
  const [disableMarkerPress, setDisableMarkerPress] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  /**
   * Update charge sites only if there are significant changes
   * @param newChargeSites
   */
  const updateChargeSites = (newChargeSites: Array<ChargeSite>) => {
    if (
      JSON.stringify(newChargeSites) !== JSON.stringify(chargeSitesRef.current)
    ) {
      chargeSitesRef.current = newChargeSites;
      setChargeSites(newChargeSites);
    }
  };

  /**
   * Queries a region of charge sites from the database if necessary.
   * @param newRegion The region to potentially query.
   */
  const queryChargeSites = (newRegion: Region) => {
    /**
     * Percentage away from queriedRegion's center
     * that currentRegion needs to be in order to requery
     * the backend. This percentage is in terms of
     * queriedRegion's deltas.
     */
    const DELTA_BUFFER = 1.5;

    const getRegionBounds = (region: Region, scale: number = 1.0) => {
      const bottomLatitude = region.latitude - region.latitudeDelta * scale;
      const topLatitude = region.latitude + region.latitudeDelta * scale;
      const leftLongitude = region.longitude - region.longitudeDelta * scale;
      const rightLongitude = region.longitude + region.longitudeDelta * scale;
      const minLatitude = Math.min(bottomLatitude, topLatitude);
      const maxLatitude = Math.max(bottomLatitude, topLatitude);
      const minLongitude = Math.min(leftLongitude, rightLongitude);
      const maxLongitude = Math.max(leftLongitude, rightLongitude);
      // NOTE: does not consider overflowing coordinates.
      // Fix this if that's a problem.
      return [minLatitude, maxLatitude, minLongitude, maxLongitude];
    };

    const [minLat, maxLat, minLon, maxLon] = getRegionBounds(newRegion);
    const [minLatBuf, maxLatBuf, minLonBuf, maxLonBuf] = getRegionBounds(
      queriedRegion,
      DELTA_BUFFER,
    );

    // Check if the requested region is contained within the queriedRegion * DELTA_OFFSET.
    // If not, update queriedRegion, which will requery the backend.
    // This is a variation of the standard "rectangle contains another rectangle" algorithm.
    if (
      minLat < minLatBuf ||
      maxLat > maxLatBuf ||
      minLon < minLonBuf ||
      maxLon > maxLonBuf
    ) {
      setQueriedRegion(newRegion);
    }
  };

  // Fetch charge sites from the backend
  useEffect(() => {
    (async () => {
      try {
        const response = await fetchWithTimeout(
          `${API_BASE_URL}` +
            `?lat=${queriedRegion.latitude}` +
            `&lon=${queriedRegion.longitude}` +
            `&latd=${queriedRegion.latitudeDelta}` +
            `&lond=${queriedRegion.longitudeDelta}`,
        );
        if (!response.ok) {
          throw new Error(
            `Network response was not ok: ${response.statusText}`,
          );
        }
        const data = await response.json();
        updateChargeSites(data);
      } catch (error) {
        console.error("Error fetching charge sites:", error);
      }
    })();
  }, [queriedRegion]);

  // Set initial position
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== Location.PermissionStatus.GRANTED) {
        console.log("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const newPosition = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setCurrentPosition(newPosition);
      const newRegion = {
        ...currentRegion,
        ...newPosition, // Must be after currentRegion to override its position.
      };
      setCurrentRegion(newRegion);
      // @ts-ignore - animateToRegion isn't properly recognized for react-native-map-clustering.
      mapRef.current?.animateToRegion(newRegion, 1000);
    })();
  }, []);

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        Animated.timing(searchBarTop, {
          toValue: 10,
          duration: 250,
          useNativeDriver: false,
        }).start();
      },
    );
    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
        Animated.timing(searchBarTop, {
          toValue: 30,
          duration: 250,
          useNativeDriver: false,
        }).start();
      },
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  /**
   * Centers the map on the current location.
   */
  const centerOnCurrentLocation = async () => {
    isCenteringRef.current = true;
    userGestureRef.current = false; // Reset user gesture flag
    // Clear any ongoing animation timeout
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }

    try {
      let location = await Location.getCurrentPositionAsync({});
      const newPosition = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setCurrentPosition(newPosition);
      const newRegion = {
        ...currentRegion,
        ...newPosition, // Must be after currentRegion to override its position.
      };
      if (!userGestureRef.current) {
        // Query new charge sites before the animation so they can load while animating.
        queryChargeSites(newRegion);
        // @ts-ignore - animateToRegion isn't properly recognized for react-native-map-clustering.
        mapRef.current?.animateToRegion(newRegion, 1000);
      }

      animationTimeoutRef.current = setTimeout(() => {
        isCenteringRef.current = false;
        if (!userGestureRef.current) {
          setCurrentRegion(newRegion); // Update state after animation completes
        }
        animationTimeoutRef.current = null;
      }, 1000); // Ensure the centering flag is reset after animation
    } catch (error) {
      console.log("Error getting location:", error);
      isCenteringRef.current = false;
    }
  };

  const handleMarkerPress = (chargeSite: ChargeSite) => {
    if (disableMarkerPress) {
      return;
    }
    isMarkerPressInProgressRef.current = true;
    isAnimatingRef.current = true;
    userGestureRef.current = true;
    setSelectedChargeSite(chargeSite);
    setIsMapCentered(false);
    const latitudeOffset = chargeSite.obfuscatedStatus
      ? 0.017
      : (0.0056 * 2) / 3;
    const region = {
      latitude: chargeSite.latitude + latitudeOffset,
      longitude: chargeSite.longitude,
      latitudeDelta: chargeSite.obfuscatedStatus ? 0.05 : 0.01,
      longitudeDelta: chargeSite.obfuscatedStatus ? 0.05 : 0.01,
    };
    // @ts-ignore - animateToRegion isn't properly recognized for react-native-map-clustering.
    mapRef.current?.animateToRegion(region, 500);

    setTimeout(() => {
      isAnimatingRef.current = false;
      setIsAnimationComplete(true);
      isMarkerPressInProgressRef.current = false;
    }, 200);
  };
  useEffect(() => {
    if (isAnimationComplete && !isCalloutClosed) {
      setIsCalloutClosed(true);
    }
  }, [isAnimationComplete, isCalloutClosed]);

  const handleCalloutClose = () => {
    setDisableMarkerPress(true);
    setSelectedChargeSite(null);

    setTimeout(() => {
      setDisableMarkerPress(false);
    }, 500);
  };

  const handleMapPress = () => {
    userGestureRef.current = true;
    setSelectedChargeSite(null);
  };

  const calculateZoomLevel = (latitudeDelta: number) => {
    if (latitudeDelta === 0) {
      return;
    }
    const zoomLevel = Math.log(360 / latitudeDelta) / Math.LN2;
    setZoomLevel(zoomLevel);
  };

  const handleRegionChangeComplete = (region: Region) => {
    if (isAnimatingRef.current) return;
    calculateZoomLevel(region.latitudeDelta);
    setIsMapCentered(true);
    Animated.timing(calloutOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const handlePanDrag = () => {
    userGestureRef.current = true;
    setSelectedChargeSite(null);
    setIsMapCentered(false);
    setIsAnimationComplete(false);
    Animated.timing(calloutOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  /**
   * Handles region change events.
   */
  const handleRegionChange = useCallback(
    debounce((region: Region) => {
      /**
       * TODO: This is a hack.
       *
       * For some reason, currentRegion.latitude changes by very small amounts.
       * This is to remove those so handleRegionChange isn't called indefinitely.
       */
      const DELTA_THRESHOLD = 0.00001;

      const deltaLat = Math.abs(region.latitude - currentRegion.latitude);
      const deltaLon = Math.abs(region.longitude - currentRegion.longitude);

      // Only bother changing the region if it has moved far enough
      // away and the region isn't currently being centered.
      if (
        deltaLat > DELTA_THRESHOLD &&
        deltaLon > DELTA_THRESHOLD &&
        !isCenteringRef.current &&
        !isMarkerPressInProgressRef.current
      ) {
        setCurrentRegion(region);
        queryChargeSites(region);
      }
    }, 500),
    [currentRegion],
  );

  const handlePlaceSelected = async (
    location: Point | null,
    northeast: Point | null,
    southwest: Point | null,
  ) => {
    userGestureRef.current = true;
    if (location && northeast && southwest) {
      const newRegion = {
        latitude: location.lat,
        longitude: location.lng,
        latitudeDelta: northeast.lat - southwest.lat,
        longitudeDelta: northeast.lng - southwest.lng,
      };

      if (mapRef.current) {
        // @ts-ignore - animateToRegion isn't properly recognized for react-native-map-clustering.
        mapRef.current.animateToRegion(newRegion, 1000);
      }
    } else {
      console.error("Invalid place details:", location, northeast, southwest);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={handleMapPress}>
        <ClusteredMapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={initialRegion}
          customMapStyle={customMapStyle}
          region={currentRegion}
          onRegionChange={handleRegionChange}
          onRegionChangeComplete={handleRegionChangeComplete}
          onPanDrag={handlePanDrag}
          toolbarEnabled={false}
        >
          {chargeSites.map((chargeSite, index) => {
            const pinColor = getMarkerColor(
              chargeSite.privateStatus,
              chargeSite.reservedStatus,
            );
            return (
              <Marker
                key={`${chargeSite.latitude}-${chargeSite.longitude}-${index}-${zoomLevel}`}
                coordinate={{
                  latitude: chargeSite.latitude,
                  longitude: chargeSite.longitude,
                }}
                tracksViewChanges={false}
                onPress={() => handleMarkerPress(chargeSite)}
              >
                <CustomMarker
                  color={pinColor}
                  isObfuscated={chargeSite.obfuscatedStatus}
                  zoomLevel={zoomLevel}
                />
              </Marker>
            );
          })}
          {currentPosition && (
            <Marker
              coordinate={currentPosition}
              title="Current Location"
              pinColor="blue"
            />
          )}
        </ClusteredMapView>
      </TouchableWithoutFeedback>

      <Animated.View
        style={[styles.searchBarContainer, { top: searchBarTop }]}
      ></Animated.View>
      <SearchBar onPlaceSelected={handlePlaceSelected} />

      {selectedChargeSite && isMapCentered && (
        <Animated.View style={{ opacity: calloutOpacity }}>
          <CustomCallout
            chargeSite={selectedChargeSite}
            onClose={handleCalloutClose}
          />
        </Animated.View>
      )}
      <TouchableOpacity
        style={[styles.button, { bottom: 20 + keyboardHeight }]}
        onPress={centerOnCurrentLocation}
      >
        <Ionicons name="locate-outline" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default MapScreen;
