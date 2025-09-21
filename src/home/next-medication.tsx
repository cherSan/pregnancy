import {useQuery, useRealm} from "@realm/react";
import {Icon, Modal, SwipeAction} from "@ant-design/react-native";
import {useCallback} from "react";
import {Medication} from "../realms/medication.ts";
import {useDate} from "../hooks/useDate.ts";
import {Colors} from "../constants/colors.ts";
import {List} from "../components/list.component.tsx";


export const NextMedication = () => {
    const {
        now,
        endOfTheDay,
        startOfTheDay,
    } = useDate();

    const upcoming = useQuery(Medication)
        .filtered('planingTime >= $0 AND planingTime <= $1 AND realTime = NULL', startOfTheDay, endOfTheDay)
        .sorted('planingTime', false);

    const realm = useRealm();
    const done = useCallback((medication: Medication) => {
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
                        <SwipeAction
                            right={
                                !medication.realTime
                                    ? [
                                        {
                                            text: 'Принять',
                                            onPress: () => done(medication),
                                            backgroundColor: Colors.accent.success,
                                            color: 'white',
                                        },
                                    ]
                                    : undefined
                            }
                            closeOnAction
                            closeOnTouchOutside
                        >
                            <List.Item
                                icon={
                                    medication.realTime
                                        ? (
                                            <Icon name={'check'} color={Colors.accent.success} />
                                        )
                                        : (
                                            <Icon
                                                name={'clock-circle'}
                                                color={
                                                    !medication.realTime && medication.planingTime?.getTime() < now.getTime()
                                                        ? Colors.accent.error
                                                        : Colors.accent.info
                                                }
                                            />
                                        )
                                }
                                title={medication.realTime?.toLocaleTimeString() || medication.planingTime?.toLocaleTimeString()}
                                extra={medication?.name}
                                description={medication.comment}
                            />
                        </SwipeAction>
                    )
                })
            }
        </List>
    )
}