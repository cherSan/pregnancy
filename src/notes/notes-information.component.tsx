import {Button, Input, List, View, WhiteSpace, WingBlank} from "@ant-design/react-native";
import {ScrollView} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {NotesStackParamList} from "./navigation.component.tsx";
import {useReactive} from "ahooks";

type NavigationProp = NativeStackNavigationProp<
    NotesStackParamList,
    'NotesInformation'
>;

export const NotesInformation = () => {
    const navigation = useNavigation<NavigationProp>();

    const data = useReactive({
        title: '',
        comment: ''
    })

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
                                type={'primary'}
                                onPress={() => {

                                }}
                            >
                                Сохранить
                            </Button>
                            <Button
                                type={'ghost'}
                                onPress={() => {
                                    navigation.navigate('NotesHistory')
                                }}
                            >
                                История заметок
                            </Button>
                        </View>
                    }
                >
                    <List.Item>
                        <Input
                            value={data.title}
                            placeholder={'Заголовок'}
                            onChange={(e) => {data.title = (e.target as any).value}}
                        />
                    </List.Item>
                    <List.Item
                        multipleLine={true}
                    >
                        <Input.TextArea
                            rows={3}
                            showCount
                            allowClear
                            value={data.comment}
                            placeholder={'Описание'}
                            onChange={(e) => {data.comment = (e.target as any).value}}
                        />
                    </List.Item>
                    <List.Item>
                        <Input
                            value={data.title}
                            placeholder={'Заголовок'}
                            onChange={(e) => {data.title = (e.target as any).value}}
                        />
                    </List.Item>
                </List>
            </WingBlank>
        </ScrollView>
    );
}