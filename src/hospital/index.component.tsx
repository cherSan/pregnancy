import {FC} from "react";
import {useQuery} from "@realm/react";
import {Text} from "@ant-design/react-native";
import {List} from "../components/list.component.tsx";
import {Hospital} from "../realms/hospital.ts";
import {AppointmentRecord} from "../components/appointment-record.component.tsx";
import { useT } from "../i18n";

export const Index: FC = () => {
    const t = useT();
    const appointments = useQuery(Hospital)
        .sorted('datetime', true);

    return (
        <List>
            {
                appointments.length
                    ?  appointments.map((appointment) => (
                        <AppointmentRecord
                            key={appointment._id.toString()}
                            appointment={appointment}
                        />
                    ))
                    : (
                        <List.Item>
                            <Text>{t('No appointments')}</Text>
                        </List.Item>
                    )
            }
        </List>
    )
}