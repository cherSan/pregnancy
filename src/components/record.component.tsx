import {FC, ReactNode} from "react";
import {StyleSheet, View, Text} from "react-native";
import {Pressable} from "react-native-gesture-handler";
import {Colors} from "../constants/colors.ts";

type Props = {
    title?: string;
    description?: string;
    icon?: ReactNode;
    extra?: string | ReactNode;
    children?: ReactNode;
    onPress?: () => void;
}

export const Record: FC<Props> = ({
    title,
    description,
    icon,
    extra,
    children,
    onPress = () => {},
}) => {
    if (
        !title
        && !description
        && !icon
        && !extra
        && !children
    ) return null;

    if (
        !title
        && !description
        && !icon
        && !extra
    ) return (
        <Pressable style={styles.container} onPress={onPress}>
            <View style={styles.content}>
                {children}
            </View>
        </Pressable>
    )

    if (
        !title
        && !description
        && !extra
    ) return (
        <Pressable style={styles.container} onPress={onPress}>
            <View
                style={styles.header}
            >
                <View
                    style={styles.icon}
                >
                    { icon }
                </View>
                <View style={styles.content}>
                    {children}
                </View>
            </View>
        </Pressable>
    )

    return (
        <Pressable style={styles.container} onPress={onPress}>
            <View
                style={styles.header}
            >
                {
                    icon
                        ? (
                            <View
                                style={styles.icon}
                            >
                                { icon }
                            </View>
                        )
                        : null
                }
                {
                    title || extra || description
                        ? (
                            <View
                                style={styles.headerData}
                            >
                                <View
                                    style={styles.headerDataRow}
                                >
                                    {title ? <Text style={styles.title}>{title}</Text> : null}
                                    {
                                        extra
                                            ? (
                                                typeof extra === 'string'
                                                    ? <Text style={styles.extra}>{extra}</Text>
                                                    : extra
                                            )
                                            : null
                                    }
                                </View>
                                {
                                    description
                                        ? (
                                            <View>
                                                <Text style={styles.description}>
                                                    {description}
                                                </Text>
                                            </View>
                                        )
                                        : null
                                }
                            </View>
                        )
                        : null
                }
            </View>
            {
                children
                    ? (
                        <View style={styles.content}>
                            {children}
                        </View>
                    )
                    : null
            }
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flex: 1,
        flexDirection: "column",
        color: Colors.secondary.contrastText,
        backgroundColor: 'transparent',

    },
    header: {
        display: "flex",
        flex: 1,
        flexDirection: "row",
        backgroundColor: 'transparent',
    },
    icon: {
        width: 30,
        backgroundColor: 'transparent',
    },
    headerData: {
        display: "flex",
        flex: 1,
        gap: 6,
        flexDirection: "column",
        backgroundColor: 'transparent',
    },
    headerDataRow: {
        display: "flex",
        flex: 1,
        gap: 6,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: 'transparent',
        flexWrap: "wrap",
    },
    title: {
        fontWeight: "bold",
        color: Colors.secondary.contrastText,
        backgroundColor: 'transparent',
    },
    extra: {
        fontWeight: "bold",
        color: Colors.secondary.default,
        backgroundColor: 'transparent',
    },
    description: {
        color: Colors.neutral[600],
        backgroundColor: 'transparent',
    },
    content: {
        display: "flex",
        color: Colors.secondary.contrastText,
        backgroundColor: 'transparent',
    }
});