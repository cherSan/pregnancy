import {
    Button,
    Text,
} from "@ant-design/react-native";
import {FC, useCallback, useMemo} from "react";
import {useQuery, useRealm} from "@realm/react";
import {Medication as MP} from "../realms/medication.ts";
import {useReactive} from "ahooks";
import {BSON} from "realm";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {Medication} from "../components/medication.component.tsx";
import {MedicationStackParamList} from "./navigation.component.tsx";
import {List} from "../components/list.component.tsx";
import {Input} from "../components/form/Input.component.tsx";
import {useDate} from "../hooks/useDate.ts";

type Props = NativeStackScreenProps<MedicationStackParamList, 'MedicationsInformation'>;

export const Medications: FC<Props> = () => {
    const {startOfTheDay, endOfTheDay} = useDate();

    const extraMedications = useReactive({
        name: '',
        comment: '',
    });

    const realm = useRealm();

    const medication = useQuery(MP)
        .filtered("planingTime >= $0 AND planingTime < $1", startOfTheDay, endOfTheDay)
        .sorted('planingTime', false);

    const takeExtra = useCallback(() => {
        if (!extraMedications.name) return;
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
        <>
            <List>
                {
                    medication?.length
                        ? medication.map((med) => (
                            <Medication
                                key={med._id.toString()}
                                medication={med}
                            />
                        ))
                        : (
                            <List.Item>
                                <Text>Нет лекарств</Text>
                            </List.Item>
                        )
                }
            </List>
            <List>
                <Input
                    placeholder={'Дополнительное лекарство'}
                    value={`${extraMedications.name}`}
                    onChangeText={e => {
                        extraMedications.name = e
                    }}
                />
                <Input
                    placeholder={'Комментарий'}
                    value={`${extraMedications.comment}`}
                    onChangeText={e => {
                        extraMedications.comment = e
                    }}
                />
                <Button
                    role={'list'}
                    type={'primary'}
                    onPress={takeExtra}
                >
                    Принять
                </Button>
            </List>
        </>
    )
}