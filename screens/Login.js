import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";

import {
  FormLabel,
  Formbutton,
  Forminput,
  Forminputpassword,
} from "../component/shared/InputForm";

import { Ionicons, AntDesign } from "@expo/vector-icons";
import AppScreen from "../component/shared/AppScreen";
import {
  RegistraionHeadersText,
  RegistraionParagraphText,
} from "../component/shared/Registraion";
import { useDispatch, useSelector } from "react-redux";
import { Alert } from "react-native";
import { EMAIL_REG } from "../component/Constants";
import { Login_Fun, REG_Fun } from "../redux/slices/authslice";
import { ActivityIndicator } from "react-native";

const Login = ({ navigation }) => {
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const { user_isLoading } = useSelector((state) => state.authslice);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [privacypolicy, setPrivacypolicy] = useState(false);
  const [privacyPolicyColor, setPrivacyPolicyColor] = useState("#04973C");

  const { logindata } = useSelector((state) => state.authslice);

  useEffect(() => {
    if (logindata) {
      navigation.navigate("Welcome");
    }
    return () => {};
  }, [logindata]);

  const handleSubmit = () => {
    if (!email.trim() || !password.trim()) {
      // Toast.show("All fields are required!");
      Alert.alert(
        "Alert Title",
        "All fields are required!",
        [
          {
            text: "OK",
          },
        ],
        { cancelable: false }
      );
    } else if (EMAIL_REG.test(email) === false) {
      // Toast.show("Invalid email!");

      Alert.alert(
        "Alert Title",
        "Invalid email!",
        [
          {
            text: "OK",
          },
        ],
        { cancelable: false }
      );
    } else {
      let data = {
        email: email,
        password: password,
      };

      dispatch(Login_Fun(data));
    }

    // dispatch(Reg_fun("data"));
    // Add your password change logic here, e.g., sending it to a server
  };

  const handleInputChange = (text) => {
    setInputValue(text);
  };
  return (
    <AppScreen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 20,
            flex: 1,
            justifyContent: "center",
            // alignItems: "center",
          }}
        >
          <RegistraionHeadersText data="Login" textStyle={{}} />

          <View style={{ flexDirection: "row", gap: 10, marginBottom: 30 }}>
            <RegistraionParagraphText
              data="Don't Already have an account?"
              color="#8E8E8F"
            />

            <TouchableOpacity
              onPress={() => navigation.navigate("Registraion")}
            >
              <RegistraionParagraphText data="Sign Up" color="#04973C" />
            </TouchableOpacity>
          </View>

          <View style={{ marginBottom: 15 }}>
            <FormLabel data="Email " />
            <Forminput
              placeholder="Enter your email"
              onChangeText={setEmail}
              value={email}
            />
          </View>

          <View style={{ marginBottom: 20 }}>
            <FormLabel data="Password " />

            <Forminputpassword
              placeholder="Enter your password"
              onChangeText={setPassword}
              value={password}
            />
          </View>

          <TouchableOpacity
            onPress={() => setPrivacypolicy(!privacypolicy)}
            style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
          >
            <Ionicons
              name={`${
                privacypolicy
                  ? "checkmark-circle-sharp"
                  : "checkmark-circle-outline"
              }`}
              size={24}
              color={`${privacypolicy ? "green" : "gray"}`}
            />

            <Text
              style={{
                fontSize: 14,
                fontWeight: "400",
              }}
            >
              I accept the terms and privacy policy
            </Text>
          </TouchableOpacity>

          {user_isLoading ? (
            <ActivityIndicator animating={true} color="green" />
          ) : (
            <Formbutton
              buttonStyle={{
                backgroundColor: "darkslategrey",

                paddingVertical: 14,
                alignItems: "center",
                borderRadius: 5,
              }}
              textStyle={{
                color: "white",
                fontWeight: "500",
                fontSize: 14,
              }}
              data="Sign Up"
              onPress={handleSubmit}
            />
          )}

          <View
            style={{ height: 20, alignItems: "center", marginVertical: 15 }}
          >
            {/* <Image
                source={require("../assets/images/or.png")}
                style={{ width: "80%", flex: 1 }}
              /> */}
          </View>
        </View>
      </KeyboardAvoidingView>
    </AppScreen>
  );
};

export default Login;

const styles = StyleSheet.create({
  customInput: {
    borderWidth: 1,
    borderColor: "red",
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    backgroundColor: "#f6f8fa",
    // opacity: 0.4
  },
});
