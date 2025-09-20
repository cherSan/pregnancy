import LinearGradient from "react-native-linear-gradient";
import {StyleSheet} from "react-native";
import {View} from "@ant-design/react-native";
import {Colors} from "../constants/colors.ts";

export const HeaderBackground = () => (
    <View style={styles.container}>
        <LinearGradient
            colors={Colors.background.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
        />
    </View>
);

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: 'transparent',
    },
});