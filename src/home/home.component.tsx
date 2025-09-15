import {ScrollView} from "react-native";
import {WhiteSpace, WingBlank} from "@ant-design/react-native";
import {KicksInformation} from "./kicks-information.component";
import {KickButton} from "./kick-button";

export const Home = () => {
    return (
        <ScrollView
            automaticallyAdjustContentInsets={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
        >
            <WingBlank size="lg">
                <WhiteSpace />
                <KickButton />
                <WhiteSpace />
                <KicksInformation />
                <WhiteSpace />
            </WingBlank>
        </ScrollView>
    )
}