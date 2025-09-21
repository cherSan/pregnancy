import {Icon} from "@ant-design/react-native";
import {FC, ReactNode} from "react";
import {StyleSheet, View} from "react-native";
import {IconNames} from "@ant-design/react-native/lib/icon";
import {Pressable} from "react-native-gesture-handler";

type HeaderActionButtonProps = {
    onClick: () => void,
    icon: IconNames,
}

const HeaderActionButton: FC<HeaderActionButtonProps> = ({
    onClick,
    icon,
}) => {
    return (
        <Pressable
            onPress={onClick}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            style={({ pressed }) => [
                styles.buttonWrapper,
                pressed && { opacity: 0.6 }
            ]}
        >
            <Icon name={icon} style={styles.button} />
        </Pressable>
    )
}

type HeaderActionsProps = {
    children: ReactNode;
}

export const HeaderActions: FC<HeaderActionsProps> & {Action: typeof HeaderActionButton} = ({ children }) => {
    return (
        <View style={styles.headerActions}>
            {children}
        </View>
    )
}

HeaderActions.Action = HeaderActionButton;

const styles = StyleSheet.create({
    button: {
        color: '#fff',
        fontSize: 20,
    },
    headerActions: {
        display: 'flex',
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
    },
    buttonWrapper: {
        padding: 8,
        minWidth: 40,
        minHeight: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
});