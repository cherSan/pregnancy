import {createDrawerNavigator} from "@react-navigation/drawer";
import {Test} from "./test.component.tsx";

const Drawer = createDrawerNavigator();

export const Home = () => {
    console.log("Home");
    return (
        <Drawer.Navigator>
            <Drawer.Screen name={'Home'} component={Test} />
            <Drawer.Screen name={'Settings'} component={Test} />
        </Drawer.Navigator>
    )
}