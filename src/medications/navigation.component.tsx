import {MedicationConfiguration} from "./medications-configuration.component.tsx";
import {MedicationsHistory} from "./medications-history.component.tsx.tsx";
import {Medications} from "./medications.component.tsx";
import {createAppStack} from "../components/create-stack-navigation.tsx";
import {AddMedication} from "./add.medication.component.tsx";

export type MedicationStackParamList = {
    MedicationsInformation: undefined;
    MedicationConfiguration: undefined;
    MedicationsHistory: undefined;
};

export const MedicationNavigation = createAppStack<MedicationStackParamList>([
    {
        name: 'MedicationsInformation',
        component: Medications,
        title: 'Медикаменты',
        actions: [
            {
                action: (navigation) => navigation.navigate('MedicationsHistory'),
                icon: 'history'
            },
            {
                action: (navigation) => navigation.navigate('MedicationConfiguration'),
                icon: 'setting'
            }
        ]
    },
    {
        name: 'MedicationConfiguration',
        component: MedicationConfiguration,
        title: 'Расписание лекарств',
        headerRight: AddMedication
    },
    {
        name: 'MedicationsHistory',
        component: MedicationsHistory,
        title: 'История приема лекарств',
    }
])