import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Home} from "./home.component.tsx";
import {KicksHistory} from "./kicks-history.component.tsx";
import {HeaderBackground} from "../components/header-background.tsx";
import {HeaderActions} from "../components/header-action.tsx";

export type HomeStackParamList = {
    HomeInformation: undefined;
    HomeKicks: undefined;
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
        </Navigator.Navigator>
    )
}

