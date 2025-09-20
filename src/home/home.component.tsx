import {View} from "react-native";
import {WhiteSpace} from "@ant-design/react-native";
import {KicksInformation} from "./kicks-information.component";
import {KickButton} from "./kick-button";
import {PregnancyTime} from "../components/pregnancy-time.component.tsx";

export const Home = () => {
    return (
        <View>
            <PregnancyTime />
            <WhiteSpace />
            <KicksInformation />
            <WhiteSpace />
            <KickButton />
        </View>
    )
}

