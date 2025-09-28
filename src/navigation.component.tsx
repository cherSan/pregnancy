import {NavigationContainer} from "@react-navigation/native";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {Icon} from "@ant-design/react-native";
import {HomeNavigation} from "./home/navigation.component.tsx";
import {MedicationNavigation} from "./medications/navigation.component.tsx";
import {NotesNavigation} from "./notes/navigation.component.tsx";
import {HospitalNavigation} from "./hospital/navigation.component.tsx";
import {SettingsNavigation} from "./settings/navigation.component.tsx";
import { useT } from "./i18n";

const Navigator = createBottomTabNavigator();

export const RootNavigation = () => {
    const t = useT();
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
                        title: t('Home'),
                        tabBarIcon: () => (
                            <Icon name="info-circle" />
                        )
                    }}
                    component={HomeNavigation}
                />
                <Navigator.Screen
                    name={'Medications'}
                    options={{
                        title: t('Medications'),
                        tabBarIcon: () => <Icon name="medicine-box" />
                    }}
                    component={MedicationNavigation}
                />
                <Navigator.Screen
                    name={'Notes'}
                    options={{
                        title: t('Notes'),
                        tabBarIcon: () => <Icon name="message" />
                    }}
                    component={NotesNavigation}
                />
                <Navigator.Screen
                    name={'Hospital'}
                    options={{
                        title: t('Hospital'),
                        tabBarIcon: () => <Icon name="home" />
                    }}
                    component={HospitalNavigation}
                />
                <Navigator.Screen
                    name={'Settings'}
                    component={SettingsNavigation}
                    options={{
                        title: t('Settings'),
                        tabBarIcon: () => <Icon name="profile" />
                    }}
                />
            </Navigator.Navigator>
        </NavigationContainer>
    )
}