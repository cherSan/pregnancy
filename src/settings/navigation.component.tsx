import {Settings} from "./settings.component.tsx";
import {createAppStack} from "../components/create-stack-navigation.tsx";

export type StackParamList = {
    SettingsIndex: undefined;
};

export const SettingsNavigation = createAppStack<StackParamList>([
    {
        name: 'SettingsIndex',
        component: Settings,
        title: 'Настройки',
    }
])