import {useQuery} from "@realm/react";
import {useDate} from "../hooks/useDate.ts";
import {List} from "../components/list.component.tsx";
import {Hospital} from "../realms/hospital.ts";
import {AppointmentRecord} from "../components/appointment-record.component.tsx";


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
                    const hv = nextHospitalVisits[i];
                    return (
                        <AppointmentRecord
                            key={hv._id.toString()}
                            appointment={hv}
                        />
                    )
                })
            }
        </List>
    )
}