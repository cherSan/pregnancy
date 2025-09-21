import {Children, FC, ReactElement} from "react";
import {Card} from "./card.component.tsx";
import {StyleSheet, View} from "react-native";
import {Colors} from "../constants/colors.ts";
import {Record} from "./record.component.tsx";
import {Text} from "@ant-design/react-native";

type Props = {
    title?: string;
    children?: ReactElement | ReactElement[];
}

export const List: FC<Props> & { Item: typeof Record } = ({children, title}) => {
    return (
        <Card>
            {
                title
                    ? (
                        <View style={styles.header}>
                            <Text style={styles.title}>{title}</Text>
                        </View>
                    )
                    : null
            }
            {
                Children.toArray(children).map((element, index) => (
                    <View
                        key={index}
                        style={[styles.element, { borderTopWidth: index > 0 ? 1 : 0 }]}
                    >
                        {element}
                    </View>
                ))
            }
        </Card>
    )
}

const styles = StyleSheet.create({
    element: {
        backgroundColor: "transparent",
        flex: 1,
        borderColor: Colors.background.solidLight,
    },
    header: {
        display: "flex",
        flexDirection: "row",
        paddingBottom: 14,
        justifyContent: "flex-end",
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        color: Colors.secondary.contrastText
    }
});


List.Item = Record;
