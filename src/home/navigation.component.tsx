import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {Home} from "./home.component.tsx";
import {Kicks} from "./kicks.component.tsx";
import {MedicationConfiguration} from "./medications-configuration.component.tsx";

const Navigator = createNativeStackNavigator();

export const HomeNavigation = () => {
    return (
        <Navigator.Navigator>
            <Navigator.Screen name={'Home'} component={Home} />
            <Navigator.Screen name={'Kicks'} component={Kicks} />
            <Navigator.Screen name={'MedicationConfiguration'} component={MedicationConfiguration} />
        </Navigator.Navigator>
    )
}