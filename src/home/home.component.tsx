import {KickButton} from "./kick-button";
import {NextMedication} from "./next-medication.tsx";
import {PregnancyTime} from "../components/pregnancy-time.component.tsx";
import {NextAppointments} from "./next-appointments.tsx";

export const Home = () => {
    return (
        <>
            <PregnancyTime />
            <KickButton />
            <NextMedication />
            <NextAppointments />
        </>
    )
}

