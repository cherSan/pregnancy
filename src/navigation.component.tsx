import {NavigationContainer} from "@react-navigation/native";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {Settings} from "./settings.component.tsx";
import {HomeNavigation} from "./home/navigation.component.tsx";

const Navigator = createBottomTabNavigator();

export const RootNavigation = () => {
    return (
        <NavigationContainer>
            <Navigator.Navigator
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Navigator.Screen name={'Home'} component={HomeNavigation} />
                <Navigator.Screen name={'Settings'} component={Settings} />
            </Navigator.Navigator>
        </NavigationContainer>
    )
}