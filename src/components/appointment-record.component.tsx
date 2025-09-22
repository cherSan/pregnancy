import {FC} from "react";
import {useNavigation} from "@react-navigation/core";
import {Icon, Text} from "@ant-design/react-native";
import { List } from "./list.component";
import {Hospital} from "../realms/hospital.ts";
import {Colors} from "../constants/colors.ts";
import {useDate} from "../hooks/useDate.ts";

type Props = {
    appointment: Hospital;
}

export const AppointmentRecord: FC<Props> = ({
    appointment
}) => {
    const {now} = useDate();

    const navigation = useNavigation<any>()
    
    return (
        <List.Item
            key={appointment._id.toString()}
            extra={appointment.datetime.toLocaleString()}
            title={appointment.visitType}
            description={appointment.doctor}
            onPress={() => {
                navigation.navigate(
                    'Hospital',
                    {
                        screen: 'HospitalAppointment',
                        params: {
                            id: appointment._id.toString()
                        }
                    }
                )
            }}
            icon={
                appointment.isCompleted
                    ? <Icon name={'check'} color={Colors.accent.success} />
                    : (
                        <Icon
                            name={'clock-circle'}
                            color={
                                now.getTime() > appointment.datetime.getTime()
                                    ? Colors.accent.error
                                    : Colors.accent.info
                            }
                        />
                    )
            }
        >
            <Text>
                {appointment.hospital}
            </Text>
        </List.Item>
    )
}