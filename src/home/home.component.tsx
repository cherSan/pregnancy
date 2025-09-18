import {WhiteSpace, WingBlank} from "@ant-design/react-native";
import {KicksInformation} from "./kicks-information.component";
import {KickButton} from "./kick-button";
import {ScrollView} from "../components/scroll-view.component.tsx";

export const Home = () => {
    return (
        <ScrollView>
            <KicksInformation />
            <WhiteSpace />
            <WingBlank size="lg">
                <KickButton />
            </WingBlank>
        </ScrollView>
    )
}