import {
    Button,
    List,
    View,
    WhiteSpace,
    WingBlank
} from "@ant-design/react-native";
import {FC} from "react";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {StackParamList} from './navigation.component.tsx';
import {ScrollView} from "../components/scroll-view.component.tsx";

type Props = NativeStackScreenProps<StackParamList, 'HospitalIndex'>;

export const Index: FC<Props> = ({ navigation }) => {

    return (
        <ScrollView>
            <WingBlank size="lg">
                <WhiteSpace />
                <List
                    renderFooter={
                        <View>
                            <Button
                                type={'ghost'}
                                onPress={() => {
                                    navigation.navigate('HospitalHistory')
                                }}
                            >
                                История Записей
                            </Button>
                        </View>
                    }
                >
                </List>
                <WhiteSpace />
                <List
                    renderFooter={
                        <Button
                            type={'primary'}
                        >
                            Принять
                        </Button>
                    }
                >
                    <List.Item>

                    </List.Item>
                    <List.Item>

                    </List.Item>
                </List>
            </WingBlank>
        </ScrollView>
    )
}