import {FC, useCallback} from "react";
import {Icon, Modal} from "@ant-design/react-native";
import {useRealm} from "@realm/react";
import {Medication as MP} from "../realms/medication.ts";
import { List } from "./list.component.tsx";
import {useDate} from "../hooks/useDate.ts";
import {Colors} from "../constants/colors.ts";

type Props = {
    medication: MP;
}

export const Medication: FC<Props> = ({
    medication
}) => {
    const {now} = useDate();
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
        <List.Item
            actions={{
                right: !medication.realTime
                    ? [
                        {
                            text: 'Принять',
                            onPress: done,
                            backgroundColor: Colors.accent.success,
                        },
                    ]
                    : undefined
            }}
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
    )
}