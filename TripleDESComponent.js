import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Button, HelperText, RadioButton, TextInput } from "react-native-paper";

const TripleDES = () => {
  const [plainText, setPlainText] = useState("");
  const [keyInput, setKeyInput] = useState("");
  const [plainTextCheck, setPlainTextCheck] = useState("plainText");
  const [keyCheck, setKeyCheck] = useState("plainText");
  const [errorMessage, setErrorMessage] = useState({
    plainTextError: "",
    keyInputError: "",
  });

  const handleSubmit = () => {
    if (plainText === "") {
      setErrorMessage((prevState) => ({
        ...prevState,
        plainTextError: "Please Write Your Message",
      }));
    } else {
      setErrorMessage((prevState) => ({
        ...prevState,
        plainTextError: "",
      }));
    }

    if (keyInput === "") {
      setErrorMessage((prevState) => ({
        ...prevState,
        keyInputError: "Please Add Your Encryption Key",
      }));
    } else {
      setErrorMessage((prevState) => ({
        ...prevState,
        keyInputError: "",
      }));
    }
  };
  const hasErrors = () => {
    return errorMessage.keyInputError || errorMessage.plainTextError;
  };
  return (
    <ScrollView style={styles.containerStyle}>
      <View>
        <View>
          <View>
            <TextInput
              label={"Message Input"}
              error={false}
              multiline={true}
              numberOfLines={5}
              placeholder="Write Message To be Encrypted."
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
            <HelperText type="error" visible={hasErrors()}>
              {errorMessage.plainTextError}
            </HelperText>
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
              label={"Encryption Key"}
              error={false}
              multiline={true}
              numberOfLines={3}
              placeholder="Write Encryption Key."
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
            <HelperText type="error" visible={hasErrors()}>
              {errorMessage.keyInputError}
            </HelperText>
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
                status={keyCheck === "hexaDecimal" ? "checked" : "unchecked"}
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
            onPress={() => handleSubmit()}
            style={{
              backgroundColor: "#38E54D",
              width: "150px",
            }}
          >
            Encrypt
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export default TripleDES;
const styles = StyleSheet.create({
  containerStyle: {
    width: "90%",
    marginTop: "20px",
    height: "100vh",
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
