import React, { useRef, useCallback, useState, useEffect } from "react";
import {
  TouchableOpacity,
  View,
  TextInput,
  Text,
  FlatList,
} from "react-native";
import {
  GooglePlacesAutocompleteProps,
  GooglePlaceData,
  GooglePlacesAutocompleteRef,
  Point,
} from "react-native-google-places-autocomplete";
import { PLACES_API_KEY } from "@/apiConfig";
import { styles, clearButtonStyle } from "@/styles/SearchBarStyles";
import { Ionicons } from "@expo/vector-icons";
import Qs from "qs";

export interface SearchBarProps {
  onPlaceSelected: (
    location: Point | null,
    northeast: Point | null,
    southwest: Point | null,
  ) => void;
}

const useGooglePlacesAutocomplete = (
  props: Partial<GooglePlacesAutocompleteProps>,
) => {
  const [results, setResults] = useState<GooglePlaceData[]>([]);
  const [text, setText] = useState("");

  const _request = useCallback(
    (inputText: string) => {
      const url = "https://maps.googleapis.com/maps/api";

      if (inputText && inputText.length >= (props.minLength || 2)) {
        const request = new XMLHttpRequest();
        request.timeout = props.timeout || 20000;
        request.ontimeout = props.onTimeout as
          | ((this: XMLHttpRequest, ev: ProgressEvent<EventTarget>) => any)
          | null;
        request.onreadystatechange = () => {
          if (request.readyState !== 4) {
            return;
          }
          if (request.status === 200) {
            const responseJSON = JSON.parse(request.responseText);
            if (typeof responseJSON.predictions !== "undefined") {
              setResults(responseJSON.predictions);
            }
            if (typeof responseJSON.error_message !== "undefined") {
              console.warn(
                "google places autocomplete: " + responseJSON.error_message,
              );
            }
          } else {
            console.warn(
              "google places autocomplete: request could not be completed or has been aborted",
            );
          }
        };
        request.open(
          "GET",
          `${url}/place/autocomplete/json?input=${encodeURIComponent(inputText)}&${Qs.stringify(props.query)}`,
        );
        if (request.readyState === 1) {
          request.send();
        } else {
          console.warn(
            "google places autocomplete: attempt to send unopened request failed",
          );
        }
      } else {
        setResults([]);
      }
    },
    [props.query, props.minLength, props.timeout, props.onTimeout],
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => _request(text), 300);
    return () => clearTimeout(timeoutId);
  }, [text, _request]);

  return { results, setText, text };
};

const CustomGooglePlacesAutocomplete: React.FC<
  SearchBarProps & Partial<GooglePlacesAutocompleteProps>
> = ({ onPlaceSelected, ...props }) => {
  const { results, setText, text } = useGooglePlacesAutocomplete(props);
  const [showDropdown, setShowDropdown] = useState(false);
  const ref = useRef<GooglePlacesAutocompleteRef>(null);

  const clearInput = useCallback((): void => {
    ref.current?.clear();
    ref.current?.blur();
    setText("");
    setShowDropdown(false);
  }, [setText, setShowDropdown]);

  const handleSelectPlace = useCallback(
    async (placeId: string, description: string) => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry&key=${PLACES_API_KEY}`,
        );
        const data = await response.json();
        if (data.result && data.result.geometry) {
          onPlaceSelected(
            data.result.geometry.location,
            data.result.geometry.viewport?.northeast || null,
            data.result.geometry.viewport?.southwest || null,
          );
          setText(description);
          setShowDropdown(false);
        }
      } catch (error) {
        console.error("Error fetching place details:", error);
      }
    },
    [onPlaceSelected, setText],
  );

  const renderItem = ({ item }: { item: GooglePlaceData }) => (
    <TouchableOpacity
      onPress={() => handleSelectPlace(item.place_id, item.description)}
      style={styles.row}
    >
      <Text style={styles.description}>{item.description}</Text>
    </TouchableOpacity>
  );

  const keyExtractor = (item: GooglePlaceData) => item.place_id;

  const handleTextChange = (newText: string) => {
    setText(newText);
    setShowDropdown(newText.length > 0);
  };

  return (
    <View>
      <View style={styles.textInputContainer}>
        <TextInput
          placeholder="Search"
          onChangeText={handleTextChange}
          value={text}
          style={styles.textInput}
          {...props.textInputProps}
        />
        {text.length > 0 && (
          <TouchableOpacity
            onPress={clearInput}
            style={clearButtonStyle.clearButton}
          >
            <Ionicons name="close-circle" size={24} color="gray" />
          </TouchableOpacity>
        )}
      </View>
      {showDropdown && results.length > 0 && (
        <FlatList
          data={results}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          style={styles.listView}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          keyboardShouldPersistTaps={"always"}
        />
      )}
    </View>
  );
};

const SearchBar: React.FC<SearchBarProps> = ({ onPlaceSelected }) => {
  return (
    <View style={styles.container}>
      <CustomGooglePlacesAutocomplete
        onPlaceSelected={onPlaceSelected}
        query={{
          key: PLACES_API_KEY,
          language: "en",
        }}
        minLength={2}
        textInputProps={{
          placeholderTextColor: "#fff",
          returnKeyType: "search",
        }}
        styles={styles}
      />
    </View>
  );
};

export default SearchBar;
