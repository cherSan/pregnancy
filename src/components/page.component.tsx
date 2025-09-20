import {FC, ReactNode} from "react";
import {View} from "@ant-design/react-native";
import {StyleSheet} from "react-native";
import {Colors} from "../constants/colors.ts";
import {ScrollView} from "./scroll-view.component.tsx";

type Props = {
    children: ReactNode
}

export const Page: FC<Props> = (props) => {
    return (
        <View style={styles.container}>
            <ScrollView>
                {props.children}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.black,
    }
});