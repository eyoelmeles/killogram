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
  const [phoneNumber, setPhoneNumber] = useState("+8618691502152");
  const [code, setCode] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [updates, setUpdates] = useState<any>([]);
  const [tdlibResponse, setTdlibResponse] = useState(null);

  useEffect(() => {
    // Subscribe to updates
    // const subscription = eventEmitter.addListener(
    //   "onTelegramUpdate",
    //   (update) => {
    //     const parsedUpdate = JSON.parse(update);
    //     console.log("Received update:", parsedUpdate);
    //     setUpdates((prevUpdates: any) => [...prevUpdates, parsedUpdate]);
    //     if (parsedUpdate["@type"] === "updateAuthorizationState") {
    //       const state = parsedUpdate.authorization_state["@type"];
    //       if (state === "authorizationStateWaitPhoneNumber") {
    //         console.log("☎️ PHONE NUMBER: ", phoneNumber);
    //         // requestPhoneNumber();
    //       } else if (state === "authorizationStateWaitCode") {
    //         // Prompt user for the authentication code
    //       } else if (state === "authorizationStateReady") {
    //         setIsLoggedIn(true);
    //         console.log("Logged in successfully!");
    //       }
    //     }
    //   }
    // );
    // return () => {
    //   TDLib.json_client_destroy()
    //     .then(() => console.log("Client destroyed"))
    //     .catch((error: any) =>
    //       console.error("Error destroying client:", error)
    //     );
    //   subscription.remove();
    // };
  }, []);

  // const requestPhoneNumber = () => {
  //   TDLib.json_client_send(
  //     JSON.stringify({
  //       "@type": "addProxy",
  //       server: "47.243.10.28",
  //       port: 443,
  //       enable: true,
  //       type: {
  //         "@type": "proxyTypeMtproto",
  //         secret:
  //           "ee6b3130a76fb7855d2a85fcd3ea260e81617a7572652e6d6963726f736f66742e636f6d",
  //       },
  //     })
  //   );
  //   TDLib.json_client_send(
  //     JSON.stringify({
  //       "@type": "setAuthenticationPhoneNumber",
  //       phone_number: phoneNumber,
  //       settings: {
  //         allow_flash_call: false,
  //         is_current_phone_number: true,
  //         allow_missed_call: false,
  //       },
  //     })
  //   );
  // };

  // const submitCode = () => {
  //   TDLib.json_client_send(
  //     JSON.stringify({
  //       "@type": "checkAuthenticationCode",
  //       code: code,
  //     })
  //   );
  // };
  // const submitPass = () => {
  //   TDLib.json_client_send(
  //     JSON.stringify({
  //       "@type": "checkAuthenticationPassword",
  //       password: "Eyusweet1",
  //     })
  //   );
  // };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text>Hello</Text>
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
  updateCard: {
    backgroundColor: "#fff",
    padding: 16,
    shadowColor: "#ccc",
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 0.3,
      height: 0.3,
    },
    shadowRadius: 16,
  },
});
