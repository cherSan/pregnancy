
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import {StatusBar, StyleSheet} from "react-native";
import {Provider} from "@ant-design/react-native";
import {Initialize} from "./initialize.component.tsx";
import {RootNavigation} from "./navigation.component.tsx";
import {usePack} from "./i18n";

export const UI = () => {
    const pack = usePack();
    return (
        <Provider locale={pack}>
            <GestureHandlerRootView style={style.root}>
                <SafeAreaProvider>
                    <StatusBar translucent backgroundColor={'transparent'} />
                    <SafeAreaView style={style.container}>
                        <Initialize>
                            <RootNavigation />
                        </Initialize>
                    </SafeAreaView>
                </SafeAreaProvider>
            </GestureHandlerRootView>
        </Provider>
    );
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        gap: 16,
        backgroundColor: '#eee',
    },
    root: {
        flex: 1,
    }
});