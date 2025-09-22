import {useQuery, useRealm} from "@realm/react";
import {Modal} from "@ant-design/react-native";
import {useCallback} from "react";
import {Medication as Med} from "../realms/medication.ts";
import {useDate} from "../hooks/useDate.ts";
import {List} from "../components/list.component.tsx";
import {Medication} from "../components/medication.component.tsx";


export const NextMedication = () => {
    const {
        now,
        endOfTheDay,
        startOfTheDay,
    } = useDate();

    const upcoming = useQuery(Med)
        .filtered('planingTime >= $0 AND planingTime <= $1 AND realTime = NULL', startOfTheDay, endOfTheDay)
        .sorted('planingTime', false);

    const realm = useRealm();
    const done = useCallback((medication: Med) => {
        realm.write(() => {
            medication.realTime = new Date();
        });
        if (medication.hasComment) {
            Modal.prompt(
                'Comment',
                'Please provide comment',
                (comment: string) => {
                    realm.write(() => {
                        medication.comment = comment;
                    });
                },
                'text',
                '',
                ['comment'],
            )
        }
    }, [realm]);

    if (!upcoming.length) return null;

    return (
        <List
            title="Лекарства"
        >
            {
                upcoming.map((medication) => {
                    return (
                        <Medication
                            key={medication._id.toString()}
                            medication={medication}
                        />
                    )
                })
            }
        </List>
    )
}