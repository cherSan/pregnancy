import LinearGradient from "react-native-linear-gradient";
import {StyleSheet} from "react-native";

export const HeaderBackground = () => (
    <LinearGradient
        colors={['#5d88d6', '#cce0f8']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}
    />
);

const styles = StyleSheet.create({
    background: {
        flex: 1,
        elevation: 5,
    },
});