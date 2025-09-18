import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {Index} from "./index.component.tsx";
import {HeaderBackground} from "../components/header-background.tsx";
import {AddAppointment} from "./add-appointment.component.tsx";
import {HeaderActions} from "../components/header-action.tsx";
import {Appointment} from "./appointment.component.tsx.tsx";

export type StackParamList = {
    HospitalIndex: undefined;
    HospitalAppointmentAdd: undefined;
    HospitalAppointment: {
        id: string;
    };
};

const Navigator = createNativeStackNavigator<StackParamList>();

export const HospitalNavigation = () => {
    return (
        <Navigator.Navigator
            screenOptions={{
                headerBackground: HeaderBackground,
                headerTintColor: "#444",
                headerTitleStyle: { fontWeight: "600" },
            }}
        >
            <Navigator.Screen
                name={'HospitalIndex'}
                component={Index}
                options={({navigation}) => ({
                    headerTitle: 'Госпиталь',
                    headerRight: () => (
                        <HeaderActions>
                            <HeaderActions.Action
                                onClick={() => navigation.navigate('HospitalAppointmentAdd')}
                                icon={'plus'}
                            />
                        </HeaderActions>
                    )
                })}
            />
            <Navigator.Screen
                name={'HospitalAppointmentAdd'}
                component={AddAppointment}
                options={{
                    headerTitle: 'Записаться',
                }}
            />
            <Navigator.Screen
                name={'HospitalAppointment'}
                component={Appointment}
                options={{
                    headerTitle: 'Запись',
                }}
            />
        </Navigator.Navigator>
    )
}