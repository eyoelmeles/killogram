import {
  Button,
  NativeEventEmitter,
  NativeModules,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React from "react";
import * as FileSystem from "expo-file-system";

const { TDLib } = NativeModules;
const eventEmitter = new NativeEventEmitter(TDLib);

type LoginState =
  | "authorizationStateWaitPhoneNumber"
  | "authorizationStateWaitCode"
  | "authorizationStateWaitPassword";

const Login = () => {
  const [phoneNumber, setPhoneNumber] = React.useState<string>("");
  const [code, setCode] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [updates, setUpdates] = React.useState<any>([]);
  const [state, setState] = React.useState<LoginState>(
    "authorizationStateWaitPhoneNumber"
  );

  React.useEffect(() => {
    TDLib.createClient()
      .then((newClient: any) => {
        console.log("NEW CLIENT", newClient);
        configureTDLib()
          .then(() => {
            TDLib.json_client_send(
              JSON.stringify({
                "@type": "addProxy",
                server: "47.243.10.28",
                port: 443,
                enable: true,
                type: {
                  "@type": "proxyTypeMtproto",
                  secret:
                    "ee6b3130a76fb7855d2a85fcd3ea260e81617a7572652e6d6963726f736f66742e636f6d",
                },
              })
            )
              .then((result: any) => {
                console.log("RESULT: ", result);
              })
              .catch((error: any) => console.log("error"));

            TDLib.startUpdateListener()
              .then(() => {
                console.log("Update listener started");
              })
              .catch((error: any) =>
                console.error("Error starting listener:", error)
              );
          })
          .catch((error: any) => {
            console.log(error);
          });
      })
      .catch(() => console.log("ERROR"));

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
          } else if (state === "authorizationStateWaitCode") {
            setState("authorizationStateWaitCode");
          } else if (state === "authorizationStateWaitPassword") {
            setState("authorizationStateWaitPassword");
          } else if (state === "authorizationStateReady") {
            console.log("Logged in successfully!", updates);
          }
        }
      }
    );

    // return () => {
    //   TDLib.json_client_destroy()
    //     .then(() => console.log("Client destroyed"))
    //     .catch((error: any) =>
    //       console.error("Error destroying client:", error)
    //     );
    //   subscription.remove();
    // };
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

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 32, fontWeight: "bold", paddingVertical: 8 }}>
        Login
      </Text>
      <Text style={{ fontSize: 22, fontWeight: "400" }}>
        Enter phone number
      </Text>
      {state === "authorizationStateWaitPhoneNumber" && (
        <TextInput
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="Phone Number"
          style={styles.textField}
        />
      )}
      {state === "authorizationStateWaitCode" && (
        <TextInput
          value={code}
          onChangeText={setCode}
          placeholder="Code"
          style={styles.textField}
        />
      )}
      {state === "authorizationStateWaitPassword" && (
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          style={styles.textField}
        />
      )}
      <Button
        title="Continue"
        onPress={() => {
          if (state === "authorizationStateWaitPhoneNumber") {
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
          } else if (state === "authorizationStateWaitCode") {
            TDLib.json_client_send(
              JSON.stringify({
                "@type": "checkAuthenticationCode",
                code: code,
              })
            );
          } else if (state === "authorizationStateWaitPassword") {
            TDLib.json_client_send(
              JSON.stringify({
                "@type": "checkAuthenticationPassword",
                password: "Eyusweet1",
              })
            );
          }
        }}
      />
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  textField: {
    padding: 20,
    color: "#ccc",
    fontSize: 32,
    marginBottom: 10,
    borderBottomWidth: 1,
    width: "100%",
  },
});
