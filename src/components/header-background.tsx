import LinearGradient from "react-native-linear-gradient";
import {StyleSheet} from "react-native";
import {View} from "@ant-design/react-native";

export const HeaderBackground = () => (
    <View style={styles.container}>
        <LinearGradient
            colors={["#4f7fd9", "#5d88d6", "#bcd4f7"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[StyleSheet.absoluteFill, styles.container]}
        />
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        height: "100%",
        elevation: 5,
        shadowOpacity: 0.2,
    },
});