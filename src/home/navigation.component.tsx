import {Home} from "./home.component.tsx";
import {KicksHistory} from "./kicks-history.component.tsx";
import {createAppStack} from "../components/create-stack-navigation.tsx";

export type HomeStackParamList = {
    HomeInformation: undefined;
    HomeKicks: undefined;
    MotherInformation: undefined;
};

export const HomeNavigation = createAppStack<HomeStackParamList>([
    {
        name: 'HomeInformation',
        component: Home,
        title: 'Информация',
        actions: [
            {
                action: (navigation) => {
                    navigation.navigate('HomeKicks')
                },
                icon: 'history'
            }
        ]
    },
    {
        name: 'HomeKicks',
        component: KicksHistory,
        title: 'История толчков',
    }
])

