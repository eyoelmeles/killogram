import {
  Image,
  StyleSheet,
  Platform,
  Button,
  NativeModules,
  NativeEventEmitter,
  View,
  TextInput,
  Text,
  ScrollView,
} from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useEffect, useState } from "react";
import * as FileSystem from "expo-file-system";

const { TDLib } = NativeModules;
const eventEmitter = new NativeEventEmitter(TDLib);

export default function HomeScreen() {
  const [phoneNumber, setPhoneNumber] = useState("+251983497883");
  const [code, setCode] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [updates, setUpdates] = useState<any>([]);
  const [tdlibResponse, setTdlibResponse] = useState(null);

  useEffect(() => {
    TDLib.createClient()
      .then((newClient: any) => {
        console.log("NEW CLIENT", newClient);
        TDLib.startUpdateListener()
          .then(() => console.log("Update listener started"))
          .catch((error: any) =>
            console.error("Error starting listener:", error)
          );
      })
      .catch((error: any) => {
        console.log(error);
      });

    // Subscribe to updates
    const subscription = eventEmitter.addListener(
      "onTelegramUpdate",
      (update) => {
        const parsedUpdate = JSON.parse(update);
        console.log("Received update:", parsedUpdate);
        setUpdates((prevUpdates: any) => [...prevUpdates, parsedUpdate]);
        if (parsedUpdate["@type"] === "updateAuthorizationState") {
          const state = parsedUpdate.authorization_state["@type"];
          if (state === "authorizationStateWaitPhoneNumber") {
            console.log("☎️ PHONE NUMBER: ", phoneNumber);
            requestPhoneNumber();
          } else if (state === "authorizationStateWaitCode") {
            // Prompt user for the authentication code
          } else if (state === "authorizationStateReady") {
            setIsLoggedIn(true);
            console.log("Logged in successfully!");
          }
        }
      }
    );

    return () => {
      TDLib.json_client_destroy()
        .then(() => console.log("Client destroyed"))
        .catch((error: any) =>
          console.error("Error destroying client:", error)
        );
      subscription.remove();
    };
  }, []);
  const configureTDLib = async () => {
    // const tdlibPath = `${RNFS.DocumentDirectoryPath}/tdlib`;
    // const filesPath = `${tdlibPath}/files`;
    // const tdlibExists = await RNFS.exists(tdlibPath);
    // if (!tdlibExists) {
    //   await RNFS.mkdir(tdlibPath);
    // }
    // const filesExists = await RNFS.exists(filesPath);
    // if (!filesExists) {
    //   await RNFS.mkdir(filesPath);
    // }
    const directoryUri = FileSystem.documentDirectory + "killogram/";

    const directoryInfo = await FileSystem.getInfoAsync(directoryUri);

    if (!directoryInfo.exists) {
      try {
        await FileSystem.makeDirectoryAsync(directoryUri);
        console.log("Directory created successfully");
      } catch (error) {
        console.log("Error creating directory:", error);
      }
    } else {
      console.log("Directory already exists");
    }

    const tdlibParameters = {
      "@type": "setTdlibParameters",
      use_test_dc: false,
      database_directory: (FileSystem.documentDirectory + "killogram").replace(
        "file://",
        ""
      ),
      files_directory: (FileSystem.documentDirectory + "killogram").replace(
        "file://",
        ""
      ),
      database_encryption_key: "",
      use_file_database: true,
      use_chat_info_database: true,
      use_message_database: true,
      use_secret_chats: true,
      api_id: 7337339,
      api_hash: "13f387a757554c7d92dd99682c81117e",
      system_language_code: "en",
      device_model: "React Native",
      system_version: "1.0",
      application_version: "1.0",
      enable_storage_optimizer: true,
      ignore_file_names: false,
    };
    const jsonString = JSON.stringify(tdlibParameters);
    console.log("JSON STRINGIFIED: ", jsonString);
    TDLib.json_client_send(jsonString)
      .then((result: any) => {
        console.log(result);
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  const requestPhoneNumber = () => {
    TDLib.json_client_send(
      JSON.stringify({
        "@type": "setAuthenticationPhoneNumber",
        phone_number: phoneNumber,
        settings: {
          allow_flash_call: false,
          is_current_phone_number: true,
          allow_missed_call: false,
        },
      })
    );
  };

  const submitCode = () => {
    TDLib.json_client_send(
      JSON.stringify({
        "@type": "checkAuthenticationCode",
        code: code,
      })
    );
  };
  const handleTelegram = async () => {};

  return (
    <ScrollView>
      {!isLoggedIn ? (
        <View style={{ marginTop: 100 }}>
          <TextInput
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            style={styles.textField}
          />
          <Button title="Request Code" onPress={configureTDLib} />
          {updates.some(
            (update: any) => update["@type"] === "authorizationStateWaitCode"
          ) && (
            <View>
              <TextInput
                placeholder="Authentication Code"
                value={code}
                onChangeText={setCode}
                style={{ marginBottom: 10, borderBottomWidth: 1 }}
              />
              <Button title="Submit Code" onPress={submitCode} />
            </View>
          )}
        </View>
      ) : (
        <Text>You're logged in!</Text>
      )}
      <View>
        <Text>Updates:</Text>
        {updates.map((update: any, index: number) => (
          <Text key={index}>{JSON.stringify(update)}</Text>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textField: {
    padding: 20,
    color: "#ccc",
    fontSize: 32,
    marginBottom: 10,
    borderBottomWidth: 1,
  },
});
