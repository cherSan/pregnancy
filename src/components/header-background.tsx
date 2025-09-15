import {ImageBackground, StyleSheet} from "react-native";

export const HeaderBackground = () => (
    <ImageBackground
        source={require("../../assets/images/home-header-gradient.jpg")}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
    />
);
