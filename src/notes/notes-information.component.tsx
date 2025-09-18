import {Button, Input, List, View, WhiteSpace, WingBlank} from "@ant-design/react-native";
import {ScrollView} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {useReactive} from "ahooks";
import {useCallback} from "react";
import {BSON} from "realm";
import {useRealm} from "@realm/react";
import {NotesStackParamList} from "./navigation.component.tsx";
import {Notes} from "../realms/notes.ts";

type NavigationProp = NativeStackNavigationProp<
    NotesStackParamList,
    'NotesInformation'
>;

export const NotesInformation = () => {
    const navigation = useNavigation<NavigationProp>();
    const realm = useRealm();

    const data = useReactive({
        title: '',
        comment: '',
        important: '',
    });

    const onCreate = useCallback(() => {
        realm.write(() => {
            realm.create<Notes>(
                Notes,
                {
                    _id: new BSON.ObjectId(),
                    datetime: new Date(),
                    ...data
                }
            );
        });
        data.title = '';
        data.comment = '';
        data.important = '';
    }, [realm, data]);

    return (
        <ScrollView
            automaticallyAdjustContentInsets={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps={true}
        >
            <WingBlank size="lg">
                <WhiteSpace />
                <List
                    renderFooter={
                        <View>
                            <Button
                                type={'primary'}
                                onPress={onCreate}
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
                            autoCapitalize={'characters'}
                            placeholder={'Заголовок'}
                            onChange={(e) => {data.title = (e.target as any).value}}
                        />
                    </List.Item>
                    <List.Item>
                        <Input
                            multiline={true}
                            numberOfLines={4}
                            maxLength={1280}
                            placeholder={'Описание'}
                            value={data.comment}
                            onChange={(e) => {
                                data.comment = (e.target as any).value;
                            }}
                        />
                    </List.Item>
                    <List.Item>
                        <Input
                            style={{
                                borderWidth: 1,
                                borderColor: 'red',
                            }}
                            multiline={true}
                            numberOfLines={4}
                            maxLength={1280}
                            placeholder={'ВАЖНО!'}
                            value={data.important}
                            onChange={(e) => {
                                data.important = (e.target as any).value;
                            }}
                        />
                    </List.Item>
                </List>
            </WingBlank>
        </ScrollView>
    );
}