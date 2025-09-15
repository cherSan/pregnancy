import {NavigationContainer} from "@react-navigation/native";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {Icon} from "@ant-design/react-native";
import {Settings} from "./settings.component.tsx";
import {HomeNavigation} from "./home/navigation.component.tsx";
import {MedicationNavigation} from "./medications/navigation.component.tsx";
import {NotesNavigation} from "./notes/navigation.component.tsx";

const Navigator = createBottomTabNavigator();

export const RootNavigation = () => {
    return (
        <NavigationContainer>
            <Navigator.Navigator
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Navigator.Screen
                    name={'Home'}
                    options={{
                        title: 'Главная',
                        tabBarIcon: () => (
                            <Icon name="info-circle" />
                        )
                    }}
                    component={HomeNavigation}
                />
                <Navigator.Screen
                    name={'Medications'}
                    options={{
                        title: 'Лекарства',
                        tabBarIcon: () => <Icon name="medicine-box" />
                    }}
                    component={MedicationNavigation}
                />
                <Navigator.Screen
                    name={'Notes'}
                    options={{
                        title: 'Заметки',
                        tabBarIcon: () => <Icon name="frown" />
                    }}
                    component={NotesNavigation}
                />
                <Navigator.Screen
                    name={'Hospital'}
                    options={{
                        title: 'Госпиталь',
                        tabBarIcon: () => <Icon name="home" />
                    }}
                    component={MedicationNavigation}
                />
                <Navigator.Screen
                    name={'Settings'}
                    component={Settings}
                    options={{
                        title: 'Настройки',
                        tabBarIcon: () => <Icon name="setting" />
                    }}
                />
            </Navigator.Navigator>
        </NavigationContainer>
    )
}