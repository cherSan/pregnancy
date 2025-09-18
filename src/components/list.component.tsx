import {FC, ReactElement} from "react";
import {List as L, View} from "@ant-design/react-native";
import {StyleSheet} from "react-native";

type Props = {
    children?: ReactElement | ReactElement[];
}

export const List: FC<Props> & { Item: typeof L.Item } = ({children}) => {
    return (
        <View style={styles.shadowWrapper}>
            <L>
                { children }
            </L>
        </View>
    )
}

const styles = StyleSheet.create({
    shadowWrapper: {
        borderRadius: 8,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 8,
    },
});



List.Item = L.Item;
