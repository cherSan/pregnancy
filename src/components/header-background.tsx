import LinearGradient from "react-native-linear-gradient";
import {StyleSheet} from "react-native";
import {View} from "@ant-design/react-native";

export const HeaderBackground = () => (
    <View style={styles.container}>
        <LinearGradient
            colors={["#5d88d6", "#cce0f8"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
        />
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
});