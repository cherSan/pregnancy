import {StatusBar, StyleSheet} from "react-native";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import {RootNavigation} from "./navigation.component.tsx";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const style = StyleSheet.create({
    container: {
        flex: 1,
        gap: 16,
    },
    root: {
        flex: 1,
    }
});

export const Application = () => {
    return (
        <GestureHandlerRootView style={style.root}>
            <SafeAreaProvider>
                <StatusBar barStyle={'dark-content'} />
                <SafeAreaView style={style.container}>
                    <RootNavigation />
                </SafeAreaView>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    )
}