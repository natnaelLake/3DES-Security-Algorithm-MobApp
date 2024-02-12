import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  HelperText,
  Portal,
  RadioButton,
  TextInput,
} from "react-native-paper";
import {  startDecrypt } from "./algorthim";
import { SafeAreaView } from "react-native-safe-area-context";

const Decrypt = () => {
  const [plainText, setPlainText] = useState("123456ABCD132536");
  const [keyInput, setKeyInput] = useState(
    "AABB09182736CCDDCCDDEE33446688FF1023456789ABCDEF"
  );
  const [plainTextCheck, setPlainTextCheck] = useState("plainText");
  const [keyCheck, setKeyCheck] = useState("plainText");
  const [DesResult, setDesResult] = useState({
    cipherText: "",
    plainText: "",
  });
  const [errorMessage, setErrorMessage] = useState({
    plainTextError: "",
    keyInputError: "",
    error: "",
  });
  const [inputError, setInputError] = useState({
    plainTextError: "",
    keyInputError: "",
  });
  const [visible, setVisible] = useState(false);
  const [showDecrypt, setShowDecrypt] = useState(false);
  const hideDialog = () => {
    setVisible(false);
    setShowDecrypt(false);
  };

  const showDialog = () => {
    setVisible(true);
  };

  const hasInputErrors = () => {
    return inputError.keyInputError || inputError.plainTextError;
  };
  const hasServerErrors = () => {
    return (
      errorMessage.keyInputError ||
      errorMessage.plainTextError ||
      errorMessage.error
    );
  };
  const handleSubmit = () => {
    if (plainText === "") {
      setInputError((prevState) => ({
        ...prevState,
        plainTextError: "Please Write Your Message",
      }));
    } else {
      setInputError((prevState) => ({
        ...prevState,
        plainTextError: "",
      }));
    }
    if (keyInput === "") {
      setInputError((prevState) => ({
        ...prevState,
        keyInputError: "Please Add Your Encryption Key",
      }));
    } else {
      setInputError((prevState) => ({
        ...prevState,
        keyInputError: "",
      }));
    }
    startEncryption();
  };
  const startEncryption = async () => {
      const response = await startDecrypt(
        plainText,
        keyInput,
        plainTextCheck,
        keyCheck
      );
      if (Object.keys(response).length === 2) {
        setDesResult((prevState) => ({
          ...prevState,
          cipherText: response.encryptedCipherText,
        }));
        setDesResult((prevState) => ({
          ...prevState,
          plainText: response.decryptedCipherText,
        }));
        setErrorMessage((prevState) => ({
          ...prevState,
          plainTextError: "",
        }));
        setErrorMessage((prevState) => ({
          ...prevState,
          keyInputError: "",
        }));
        setErrorMessage((prevState) => ({
          ...prevState,
          error: "",
        }));
      } else if (Object.keys(response).length === 1) {
        setErrorMessage( response.error);
      }
  };
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <ScrollView style={styles.containerStyle}>
          <View>
            <View>
              <View>
                <HelperText type="error" visible={hasServerErrors()}>
                  {errorMessage.error}
                </HelperText>
              </View>
              <View>
                <TextInput
                  label={"Encrypted Message Input"}
                  error={false}
                  multiline={true}
                  numberOfLines={5}
                  placeholder="Write Your Encrypted Message To be Decrypt."
                  value={plainText}
                  underlineColor="#52D2D9"
                  style={{
                    color: "black",
                    backgroundColor: "#FEFFFE",
                    width: "100%",
                  }}
                  onChangeText={(text) => setPlainText(text)}
                  theme={{
                    colors: {
                      text: "black",
                      placeholder: "gray",
                      // background: "white",
                    },
                  }}
                />
                {inputError.plainTextError ? (
                  <HelperText type="error" visible={hasInputErrors()}>
                    {inputError.plainTextError}
                  </HelperText>
                ) : (
                  <HelperText type="error" visible={hasServerErrors()}>
                    {errorMessage.plainTextError}
                  </HelperText>
                )}
              </View>
              <View>
                <Text
                  variant="titleLarge"
                  style={{ marginTop: "10px", marginBottom: "10px" }}
                >
                  Select The Type of your Message
                </Text>
              </View>
              <View style={styles.radioContainer}>
                <View style={styles.radioStyle}>
                  <RadioButton
                    value="plainText"
                    status={
                      plainTextCheck === "plainText" ? "checked" : "unchecked"
                    }
                    onPress={() => setPlainTextCheck("plainText")}
                    theme={{
                      colors: {
                        text: "black",
                      },
                    }}
                  />
                  <Text variant="titleLarge">Plain Text</Text>
                </View>
                <View style={styles.radioStyle}>
                  <RadioButton
                    value="hexaDecimal"
                    status={
                      plainTextCheck === "hexaDecimal" ? "checked" : "unchecked"
                    }
                    onPress={() => setPlainTextCheck("hexaDecimal")}
                    labelStyle={{ color: "black" }}
                    theme={{
                      colors: {
                        text: "black",
                      },
                    }}
                  />
                  <Text variant="titleLarge">Hexa Decimal</Text>
                </View>
              </View>
            </View>
            <View>
              <View>
                <TextInput
                  label={"Enter Decryption Key"}
                  error={false}
                  multiline={true}
                  numberOfLines={3}
                  placeholder="Write Decryption Key."
                  value={keyInput}
                  underlineColor="#52D2D9"
                  style={{
                    color: "black",
                    backgroundColor: "#FEFFFE",
                    width: "100%",
                  }}
                  onChangeText={(text) => setKeyInput(text)}
                  theme={{
                    colors: {
                      text: "black",
                      placeholder: "gray",
                      // background: "white",
                    },
                  }}
                />
                {inputError.keyInputError ? (
                  <HelperText type="error" visible={hasInputErrors()}>
                    {inputError.keyInputError}
                  </HelperText>
                ) : (
                  <HelperText type="error" visible={hasServerErrors()}>
                    {errorMessage.keyInputError}
                  </HelperText>
                )}
              </View>
              <View>
                <Text
                  variant="titleLarge"
                  style={{ marginTop: "10px", marginBottom: "10px" }}
                >
                  Select The Type of your Key
                </Text>
              </View>
              <View style={styles.radioContainer}>
                <View style={styles.radioStyle}>
                  <RadioButton
                    value="plainText"
                    status={keyCheck === "plainText" ? "checked" : "unchecked"}
                    onPress={() => setKeyCheck("plainText")}
                    theme={{
                      colors: {
                        text: "black",
                      },
                    }}
                  />
                  <Text variant="titleLarge">Plain Text</Text>
                </View>
                <View style={styles.radioStyle}>
                  <RadioButton
                    value="hexaDecimal"
                    status={
                      keyCheck === "hexaDecimal" ? "checked" : "unchecked"
                    }
                    onPress={() => setKeyCheck("hexaDecimal")}
                    labelStyle={{ color: "black" }}
                    theme={{
                      colors: {
                        text: "black",
                      },
                    }}
                  />
                  <Text variant="titleLarge">Hexa Decimal</Text>
                </View>
              </View>
            </View>
            <View style={styles.buttonStyle}>
              <Button
                dark
                mode="contained"
                //   disabled={!hasInputErrors()}
                onPress={() => {
                  handleSubmit();
                  showDialog();
                }}
                style={{
                  backgroundColor: "#38E54D",
                  width: "150px",
                }}
              >
                Decrypt
              </Button>
            </View>
          </View>
          <View>
            {!hasInputErrors() && !hasServerErrors() && (
              <Portal>
                <Dialog
                  visible={visible}
                  onDismiss={hideDialog}
                  style={{
                    backgroundColor: "white",
                  }}
                >
                  <Dialog.Title>Alert</Dialog.Title>
                  <Dialog.Content>
                    {!showDecrypt ? (
                      <Text variant="bodyMedium">
                        Decrypted Plain Text Is : {DesResult.plainText}
                      </Text>
                    ) : (
                      <Text variant="bodyMedium">
                        Encrypted Cipher Text Is : {DesResult.cipherText}
                      </Text>
                    )}
                  </Dialog.Content>
                  <Dialog.Actions>
                    <Button onPress={hideDialog}>Cancel</Button>
                    <Button onPress={() => setShowDecrypt(!showDecrypt)}>
                      {showDecrypt ? "Decrypt" : "Encrypt"}
                    </Button>
                  </Dialog.Actions>
                </Dialog>
              </Portal>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Decrypt;
const styles = StyleSheet.create({
  containerStyle: {
    width: "90%",
    marginTop: "20px",
    height: "100vh",
  },
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
    alignItems: "center",
    width: "100%",
    // justifyContent: "center",
  },
  radioContainer: {
    display: "flex",
    flexDirection: "row",
  },
  radioStyle: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "50px",
  },
});
