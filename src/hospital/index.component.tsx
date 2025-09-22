import {FC} from "react";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {useQuery} from "@realm/react";
import {Icon, Text} from "@ant-design/react-native";
import {StackParamList} from './navigation.component.tsx';
import {List} from "../components/list.component.tsx";
import {Hospital} from "../realms/hospital.ts";
import {useDate} from "../hooks/useDate.ts";
import {Colors} from "../constants/colors.ts";

type Props = NativeStackScreenProps<StackParamList, 'HospitalAppointments'>;

export const Index: FC<Props> = ({ navigation }) => {
    const hospitals = useQuery(Hospital)
        .sorted('datetime', true);

    const {now} = useDate();

    return (
        <List>
            {
                hospitals.length
                    ?  hospitals.map((h) => (
                        <List.Item
                            key={h._id.toString()}
                            extra={h.datetime.toLocaleString()}
                            title={h.visitType}
                            description={h.doctor}
                            onPress={() => {
                                navigation.navigate(
                                    {
                                        name: 'HospitalAppointment',
                                        params: {
                                            id: h._id.toString()
                                        }
                                    }
                                )
                            }}
                            icon={
                                h.isCompleted
                                    ? <Icon name={'check'} color={Colors.accent.success} />
                                    : (
                                        <Icon
                                            name={'clock-circle'}
                                            color={
                                                now.getTime() > h.datetime.getTime()
                                                    ? Colors.accent.error
                                                    : Colors.accent.info
                                            }
                                        />
                                    )
                            }
                        >
                            <Text>
                                {h.hospital}
                            </Text>
                        </List.Item>
                    ))
                    : (
                        <List.Item>
                            <Text>Нет записей</Text>
                        </List.Item>
                    )
            }
        </List>
    )
}