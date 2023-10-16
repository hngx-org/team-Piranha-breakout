import * as React from "react";
import { Platform, ScrollView, StyleSheet, ViewStyle } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";



const AppScreen = ({ children, style, isScrollable = false }) => {
    return (
        <SafeAreaView
            style={{

                // flex: 1,
                backgroundColor: "transparent",
                paddingTop: Platform.OS === 'android' ? 25 : 0,
                flex: 1,
                // backgroundColor: "white",
                ...style,
            }}
        >
            <StatusBar style="light" backgroundColor="#04973C" />
            {isScrollable ? (
                <ScrollView>{children}</ScrollView>
            ) : (
                <>{children}</>
            )}
        </SafeAreaView>
    );
};

export default AppScreen;

const styles = StyleSheet.create({});
