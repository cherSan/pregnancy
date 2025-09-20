import {FC, ReactNode} from "react";
import {StyleSheet, View, Text} from "react-native";
import {Colors} from "../constants/colors.ts";

type Props = {
    title: string;
    description?: string;
    icon?: ReactNode;
    extra?: string;
    children?: ReactNode;
}

export const Record: FC<Props> = ({
    title,
    description,
    icon,
    extra,
    children,
}) => {
    return (
        <View style={styles.container}>
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
                <View
                    style={styles.headerData}
                >
                    <View
                        style={styles.headerDataRow}
                    >
                        <Text style={styles.title}>{title}</Text>
                        {extra ? <Text style={styles.extra}>{extra}</Text> : null}
                    </View>
                    {
                        description
                            ? (
                                <Text style={styles.description}>
                                    {description}
                                </Text>
                            )
                            : null
                    }
                </View>
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
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flex: 1,
        flexDirection: "column",
        color: Colors.secondary.contrastText,
        backgroundColor: 'transparent',
        paddingVertical: 8,
    },
    header: {
        display: "flex",
        flex: 1,
        flexDirection: "row",
        backgroundColor: 'transparent',
    },
    icon: {
        width: 60,
        backgroundColor: 'transparent',
    },
    headerData: {
        display: "flex",
        flex: 1,
        flexDirection: "column",
        backgroundColor: 'transparent',
    },
    headerDataRow: {
        display: "flex",
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: 'transparent',
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