import {FC, useCallback, useMemo} from "react";
import {List, Modal, SwipeAction, Text} from "@ant-design/react-native";
import {useRealm} from "@realm/react";
import {Medication as MP} from "../realms/medication.ts";

type Props = {
    medication: MP;
}

export const Medication: FC<Props> = ({
    medication
}) => {
    const now = useMemo(() => new Date(), []);
    const realm = useRealm();
    const done = useCallback(() => {
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
    }, [realm, medication]);

    return (
        <SwipeAction
            right={
                !medication.realTime
                    ? [
                        {
                            text: 'Принять',
                            onPress: done,
                            backgroundColor: 'blue',
                            color: 'white',
                        },
                    ]
                    : undefined
            }
            closeOnAction
            closeOnTouchOutside
        >
            <List.Item
                extra={
                    <Text
                        style={{
                            color: medication.realTime
                                ? 'green'
                                : (
                                    !medication.realTime && medication.planingTime?.getTime() < now.getTime()
                                        ? 'red'
                                        : undefined
                                )
                        }}
                    >
                        { medication.realTime?.toLocaleTimeString() || medication.planingTime?.toLocaleTimeString() }
                    </Text>
                }
            >
                <Text>{ medication?.name }</Text>
            </List.Item>
        </SwipeAction>
    )
}