import React, {useCallback, useMemo} from 'react';
import {
    createNativeStackNavigator,
    NativeStackNavigationProp
} from '@react-navigation/native-stack';
import {IconNames} from "@ant-design/react-native/lib/icon";
import {ParamListBase} from "@react-navigation/native";
import { HeaderBackground } from './header-background';
import {HeaderActions} from "./header-action.tsx";

type Actions<ParamList extends ParamListBase> = {
    action: (navigation: NativeStackNavigationProp<ParamList, keyof ParamList>) => void;
    icon: IconNames
}

type ScreenConfig<ParamList extends ParamListBase> = {
    name: keyof ParamList;
    component: React.ComponentType<any>;
    title: string;
    actions?: Actions<ParamList>[];
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
                    headerBackground: HeaderBackground,
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: '600'
                    },
                    headerShadowVisible: true,
                    headerTransparent: false,
                    headerBlurEffect: 'dark',
                }}
            >
                {memoScreens.map((s) => {
                    const headerRight = useCallback((navigation: NativeStackNavigationProp<ParamList, keyof ParamList>) => {
                        return () => {
                            if (!s.actions) return null;
                            return (
                                <HeaderActions>
                                    {
                                        s.actions.map((action) => (
                                            <HeaderActions.Action
                                                key={action.icon}
                                                onClick={() => action.action(navigation)}
                                                icon={action.icon}
                                            />
                                        ))
                                    }
                                </HeaderActions>
                            )
                        }
                    }, [s.actions])
                    return (
                        <Stack.Screen
                            key={String(s.name)}
                            name={s.name}
                            component={s.component}
                            options={({navigation}) => ({
                                title: s.title,
                                headerRight: headerRight(navigation)
                            })}
                        />
                    );
                })}
            </Stack.Navigator>
        );
    };
    }