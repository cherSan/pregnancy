import {FC, ReactNode} from "react";
import {ScrollView as SV, StyleSheet} from "react-native";

type Props = {
    children: ReactNode;
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        gap: 16,
        backgroundColor: '#cce0f8',
    }
});

export const ScrollView: FC<Props> = (
    { children }
) => {
    return (
        <SV
            style={style.container}
            automaticallyAdjustContentInsets={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            keyboardDismissMode={'on-drag'}
            keyboardShouldPersistTaps={"always"}
        >
            {children}
        </SV>
    )
}