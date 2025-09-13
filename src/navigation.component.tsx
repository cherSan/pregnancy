import {NavigationContainer} from "@react-navigation/native";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {Home} from "./home.component.tsx";
import {Test} from "./test.component.tsx";

const Tab = createBottomTabNavigator();

export const RootNavigation = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator>
                <Tab.Screen name={'Home'} component={Home} />
                <Tab.Screen name={'Test'} component={Test} />
            </Tab.Navigator>
        </NavigationContainer>
    )
}