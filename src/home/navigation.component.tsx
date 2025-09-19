import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Home} from "./home.component.tsx";
import {KicksHistory} from "./kicks-history.component.tsx";
import {HeaderBackground} from "../components/header-background.tsx";
import {HeaderActions} from "../components/header-action.tsx";
import {MotherInformation} from "./mother-information.tsx";

export type HomeStackParamList = {
    HomeInformation: undefined;
    HomeKicks: undefined;
    MotherInformation: undefined;
};

const Navigator = createNativeStackNavigator<HomeStackParamList>();

export const HomeNavigation = () => {
    return (
        <Navigator.Navigator
            screenOptions={{
                headerBackground: HeaderBackground,
                headerTintColor: "#444",
                headerTitleStyle: { fontWeight: "600" },
            }}
        >
            <Navigator.Screen
                name={'HomeInformation'}
                component={Home}
                options={({navigation}) => ({
                    headerTitle: 'Информация',
                    headerRight: () => (
                        <HeaderActions>
                            <HeaderActions.Action
                                onClick={() => navigation.navigate('HomeKicks')}
                                icon={'history'}
                            />
                            <HeaderActions.Action
                                onClick={() => navigation.navigate('MotherInformation')}
                                icon={'info-circle'}
                            />
                        </HeaderActions>
                    ),
                })}
            />
            <Navigator.Screen
                name={'HomeKicks'}
                component={KicksHistory}
                options={{
                    headerTitle: 'История толчков',
                }}
            />
            <Navigator.Screen
                name={'MotherInformation'}
                component={MotherInformation}
                options={{
                    headerTitle: 'Мама',
                }}
            />
        </Navigator.Navigator>
    )
}

