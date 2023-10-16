import { useEffect, useRef, useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";

export const Forminput = ({ placeholder, onChangeText, value }) => {
  return (
    <View style={{}}>
      <TextInput
        placeholder={placeholder}
        onChangeText={onChangeText}
        value={value}
        style={{
          // borderWidth: 1,
          padding: 10,
          borderRadius: 5,
          fontSize: 16,
          backgroundColor: "#F6F8FAE5",
          // opacity: 0.4
        }}
      />

      {/* <Text>{value}</Text> */}
    </View>
  );
};

export const Forminputpassword = ({ placeholder, onChangeText, value }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F6F8FAE5",
        paddingHorizontal: 10,
      }}
    >
      <TextInput
        placeholder={placeholder}
        onChangeText={onChangeText}
        value={value}
        secureTextEntry={!isPasswordVisible}
        style={{
          flex: 1,
          padding: 10,
          // paddingVertical: 20,

          // opacity: 0.4
        }}
      />
      <TouchableOpacity onPress={togglePasswordVisibility}>
        <MaterialIcons
          name={isPasswordVisible ? "visibility" : "visibility-off"}
          size={24}
          color="#888"
        />
      </TouchableOpacity>
    </View>
  );
};

export const FormLabel = ({ data }) => {
  return (
    <Text
      style={{
        color: "rgba(38, 50, 56, 0.71)",
        fontWeight: "400",
        fontSize: 13,
        marginBottom: 5,
      }}
    >
      {data}
    </Text>
  );
};

// interface FormbuttonProps {
//   buttonStyle?: ViewStyle;
//   textStyle?: TextStyle;
//   data: string;
//   icon?: React.ReactElement; // Add this line
//   onPress?: () => void;
// }

export const Formbutton = ({ buttonStyle, textStyle, data, icon, onPress }) => {
  return (
    <TouchableOpacity style={[buttonStyle]} onPress={onPress}>
      {icon && <View>{icon}</View>}
      <Text style={[textStyle]}>{data}</Text>
    </TouchableOpacity>
  );
};

export const Otpinput = ({ onOTPChange, containerView, inputStyle }) => {
  const [otp, setOTP] = useState < string > "";
  const inputRefs = [
    useRef < TextInput > null,
    useRef < TextInput > null,
    useRef < TextInput > null,
    useRef < TextInput > null,
  ];

  useEffect(() => {
    const otpValue = otp.split("").filter((char) => !isNaN(Number(char)));
    setOTP(otpValue.join(""));

    // Call the parent component's callback with the OTP value
    onOTPChange(otpValue.join(""));

    // Move to the next input field automatically when 1 digit is entered
    if (otp.length === 1) {
      inputRefs[1].current?.focus();
    }
    if (otp.length === 2) {
      inputRefs[2].current?.focus();
    }
    if (otp.length === 3) {
      inputRefs[3].current?.focus();
    }
  }, [otp, onOTPChange]);

  const handleInputChange = (text, index) => {
    const newOTP = otp.split("");
    newOTP[index] = text;
    setOTP(newOTP.join(""));
  };

  return (
    <View style={[containerView]}>
      {inputRefs.map((inputRef, index) => (
        <TextInput
          key={index}
          ref={inputRef}
          style={[inputStyle]}
          value={otp[index]}
          onChangeText={(text) => handleInputChange(text, index)}
          keyboardType="numeric"
          maxLength={1}
        />
      ))}
    </View>
  );
};
