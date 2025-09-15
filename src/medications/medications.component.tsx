import {
    Button,
    Input,
    List,
    Text,
    View,
    WhiteSpace,
    WingBlank
} from "@ant-design/react-native";
import {FC, useCallback, useMemo} from "react";
import {useQuery, useRealm} from "@realm/react";
import {Medication as MP} from "../realms/medication.ts";
import {useReactive} from "ahooks";
import {BSON} from "realm";
import {ScrollView} from "react-native";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {Medication} from "./medication.component.tsx";
import {MedicationStackParamList} from "./navigation.component.tsx";

type Props = NativeStackScreenProps<MedicationStackParamList, 'MedicationsInformation'>;

export const Medications: FC<Props> = ({ navigation }) => {
    const [fromDate, toDate] = useMemo(() => {
        const now = new Date();
        const from = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
        );

        const to = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() + 1,
        );

        return [from, to];
    }, []);

    const extraMedications = useReactive({
        name: '',
        comment: '',
    });

    const realm = useRealm();

    const medication = useQuery(MP)
        .filtered("planingTime >= $0 AND planingTime < $1", fromDate, toDate)
        .sorted('planingTime', false);

    const takeExtra = useCallback(() => {
        realm.write(() => {
            realm.create<MP>(
                MP,
                {
                    _id: new BSON.ObjectId(),
                    comment: extraMedications.comment,
                    name: extraMedications.name,
                    hasComment: true,
                    planingTime: new Date(),
                    realTime: new Date(),
                }
            );
        });
        extraMedications.name = '';
        extraMedications.comment = '';
    }, [extraMedications, realm]);

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
                                    navigation.navigate('MedicationConfiguration')
                                }}
                            >
                                Настройка
                            </Button>
                            <Button
                                type={'ghost'}
                                onPress={() => {
                                    navigation.navigate('MedicationsHistory')
                                }}
                            >
                                История Приема Лекарств
                            </Button>
                        </View>
                    }
                >
                    {
                        medication?.length
                            ? medication.map((medication) => (
                                <Medication medication={medication} />
                            ))
                            : (
                                <List.Item>
                                    <Text>Нет лекарств</Text>
                                </List.Item>
                            )
                    }
                </List>
                <WhiteSpace />
                <List
                    renderFooter={
                        <Button
                            type={'primary'}
                            onPress={takeExtra}
                        >
                            Принять
                        </Button>
                    }
                >
                    <List.Item>
                        <Input
                            placeholder={'Дополнительное лекарство'}
                            value={`${extraMedications.name}`}
                            onChange={e => {
                                extraMedications.name = (e.target as any).value
                            }}
                        />
                    </List.Item>
                    <List.Item>
                        <Input
                            placeholder={'Комментарий'}
                            value={`${extraMedications.comment}`}
                            onChange={e => {
                                extraMedications.comment = (e.target as any).value
                            }}
                        />
                    </List.Item>
                </List>
            </WingBlank>
        </ScrollView>
    )
}