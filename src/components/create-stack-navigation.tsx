import React, {useCallback, useMemo} from 'react';
import {
    createNativeStackNavigator,
    NativeStackNavigationProp
} from '@react-navigation/native-stack';
import {IconNames} from "@ant-design/react-native/lib/icon";
import {ParamListBase} from "@react-navigation/native";
import {Page} from "./page.component.tsx";
import {MotherWeight} from "../actions/mother-weight.component.tsx";
import {MotherTemperature} from "../actions/mother-temperature.component.tsx";
import {MotherPressure} from "../actions/mother-pressure.component.tsx";
import {MotherMood} from "../actions/mother-mood.component.tsx";

type Actions<ParamList extends ParamListBase> = {
    action: (navigation: NativeStackNavigationProp<ParamList, keyof ParamList>) => void;
    icon: IconNames
}

type ScreenConfig<ParamList extends ParamListBase> = {
    name: keyof ParamList;
    component: React.ComponentType<any>;
    title: string;
    actions?: Actions<ParamList>[];
    headerRight?: React.ComponentType<any>;
};

export const createAppStack = <ParamList extends ParamListBase>(
    screens: ScreenConfig<ParamList>[]
) => {
    const Stack = createNativeStackNavigator<ParamList>();

    return () => {
        const memoScreens = useMemo(() => screens, []);

        return (
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                }}
            >
                {memoScreens.map((s) => {
                    const component = useCallback((props: any) => (
                        <Page
                            {...props}
                            title={s.title}
                            actions={s.actions}
                            headerRight={s.headerRight}
                        >
                            <s.component
                                {...props}
                            />
                        </Page>
                    ), [s])
                    return (
                        <Stack.Screen
                            key={String(s.name)}
                            name={s.name}
                            component={component}
                        />
                    );
                })}
                <Stack.Screen
                    key={'MotherWeight'}
                    name={'MotherWeight'}
                    component={MotherWeight}
                />
                <Stack.Screen
                    key={'MotherTemperature'}
                    name={'MotherTemperature'}
                    component={MotherTemperature}
                />
                <Stack.Screen
                    key={'MotherPressure'}
                    name={'MotherPressure'}
                    component={MotherPressure}
                />
                <Stack.Screen
                    key={'MotherMood'}
                    name={'MotherMood'}
                    component={MotherMood}
                />
            </Stack.Navigator>
        );
    };
}