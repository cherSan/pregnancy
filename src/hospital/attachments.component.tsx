import {useObject} from "@realm/react";
import {FC, useMemo} from "react";
import {BSON} from "realm";
import {Image} from "react-native";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import { List } from "../components/list.component"
import {Hospital} from "../realms/hospital.ts";
import {StackParamList} from "./navigation.component.tsx";
import {Attach} from "./attach.component.tsx";

type Props = NativeStackScreenProps<StackParamList, 'HospitalAppointmentPhotos'>;

export const Attachments: FC<Props> = ({ route }) => {
    const id = useMemo(() => route.params.id, [route]);
    const appointment = useObject(Hospital, new BSON.ObjectId(id));

    if (!appointment) return null;

    return (
        <>
            <List>
                {!appointment?.isCompleted ? <Attach id={id} /> : null }
                {
                    appointment?.attachments.map((attach)  => {
                        return (
                            <List.Item key={attach.base64} title={attach.createdAt.toLocaleString()}>
                                <Image
                                    source={{
                                        uri: `data:image/jpeg;base64,${attach.base64}`
                                    }}
                                    style={{
                                        width: '100%',
                                        aspectRatio: attach.width && attach.height
                                            ? attach.width / (attach.height || 1)
                                            : 1,
                                        resizeMode: 'contain',
                                    }}
                                />
                            </List.Item>
                        )
                    })
                }
            </List>
        </>
    )
}