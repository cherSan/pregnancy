import {
    Button,
    List,
    View,
    WhiteSpace,
    WingBlank
} from "@ant-design/react-native";
import {FC} from "react";
import {ScrollView} from "react-native";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {StackParamList} from './navigation.component.tsx';

type Props = NativeStackScreenProps<StackParamList, 'HospitalIndex'>;

export const Index: FC<Props> = ({ navigation }) => {

    return (
        <ScrollView
            automaticallyAdjustContentInsets={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
        >
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