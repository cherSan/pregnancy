import {useQuery} from "@realm/react";
import {Icon, Text} from "@ant-design/react-native";
import {useDate} from "../hooks/useDate.ts";
import {List} from "../components/list.component.tsx";
import {Hospital} from "../realms/hospital.ts";


export const NextAppointments = () => {
    const {
        now,
    } = useDate();

    const nextHospitalVisits = useQuery(Hospital)
        .filtered('datetime >= $0 AND (isCompleted == false OR isCompleted == null)', now)
        .sorted('datetime', false);

    if (!nextHospitalVisits.length) return null;

    return (
        <List
            title="Записи"
        >
            {
                Array.from({ length: Math.min(3, nextHospitalVisits.length) }, (_, i) => {
                    const h = nextHospitalVisits[i];
                    return (
                        <List.Item
                            key={h._id.toString()}
                            extra={h.datetime.toLocaleString()}
                            icon={
                                h.isCompleted
                                    ? <Icon name={'check'} color={'green'} />
                                    : (
                                        <Icon
                                            name={'clock-circle'}
                                            color={now.getTime() > h.datetime.getTime() ? 'red' : undefined}
                                        />
                                    )
                            }
                        >
                            <Text>
                                {h.doctor}
                            </Text>
                            <Text>
                                {h.hospital}
                            </Text>
                        </List.Item>
                    )
                })
            }
        </List>
    )
}