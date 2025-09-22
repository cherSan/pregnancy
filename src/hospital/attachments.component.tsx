import { List } from "../components/list.component"
import {useObject} from "@realm/react";
import {FC, useMemo} from "react";
import {BSON} from "realm";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {Hospital} from "../realms/hospital.ts";
import {StackParamList} from "./navigation.component.tsx";
import {Attach} from "./attach.component.tsx";
import {Image} from "react-native";

type Props = NativeStackScreenProps<StackParamList, 'HospitalAppointmentPhotos'>;

export const Attachments: FC<Props> = ({ route }) => {
    const id = useMemo(() => route.params.id, [route]);
    const appointment = useObject(Hospital, new BSON.ObjectId(id));
    return (
        <>
            <List>
                <Attach id={id} />
            </List>
            <List>
                {
                    appointment?.attachments?.map((base64)  => {
                        return (
                            <List.Item key={base64}>
                                <Image
                                    source={{
                                        uri: `data:image/jpeg;base64,${base64}`
                                    }}
                                    style={{
                                        width: '100%',
                                        aspectRatio: 1,
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