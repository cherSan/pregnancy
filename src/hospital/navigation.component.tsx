import {Index} from "./index.component.tsx";
import {AddAppointment} from "./add-appointment.component.tsx";
import {Appointment} from "./appointment.component.tsx.tsx";
import {createAppStack} from "../components/create-stack-navigation.tsx";
import {Attachments} from "./attachments.component.tsx";

export type StackParamList = {
    HospitalAppointments: undefined;
    HospitalAppointmentAdd: undefined;
    HospitalAppointment: {
        id: string;
    };
    HospitalAppointmentPhotos: {
        id: string;
    }
};

export const HospitalNavigation = createAppStack<StackParamList>([
    {
        name: 'HospitalAppointments',
        component: Index,
        title: 'Appointments',
        actions: [
            {
                action: (navigation) => navigation.navigate('HospitalAppointmentAdd'),
                icon: 'plus'
            }
        ]
    },
    {
        name: 'HospitalAppointmentAdd',
        component: AddAppointment,
        title: 'Make an appointment',
    },
    {
        name: 'HospitalAppointment',
        component: Appointment,
        title: 'Appointment',
    },
    {
        name: 'HospitalAppointmentPhotos',
        component: Attachments,
        title: 'Photos',
    }
])