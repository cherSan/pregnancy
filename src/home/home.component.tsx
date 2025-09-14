import {ScrollView} from "react-native";
import {WhiteSpace, WingBlank} from "@ant-design/react-native";
import {KicksStatistic} from "./kicks-statistic.component.tsx";
import {MedicationsStatistic} from "./medications-statistic.component.tsx";

export const Home = () => {
    return (
        <ScrollView
            automaticallyAdjustContentInsets={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
        >
            <WingBlank size="lg">
                <WhiteSpace />
                <KicksStatistic />
                <WhiteSpace />
                <MedicationsStatistic />
                <WhiteSpace />
            </WingBlank>
        </ScrollView>
    )
}