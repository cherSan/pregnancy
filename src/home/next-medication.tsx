import {useQuery} from "@realm/react";
import {Medication as Med} from "../realms/medication.ts";
import {useDate} from "../hooks/useDate.ts";
import {List} from "../components/list.component.tsx";
import {Medication} from "../components/medication.component.tsx";


export const NextMedication = () => {
    const {
        endOfTheDay,
        startOfTheDay,
    } = useDate();

    const upcoming = useQuery(Med)
        .filtered('planingTime >= $0 AND planingTime <= $1 AND realTime = NULL', startOfTheDay, endOfTheDay)
        .sorted('planingTime', false);

    if (!upcoming.length) return null;

    return (
        <List
            title="Лекарства"
        >
            {
                upcoming.map((medication) => {
                    return (
                        <Medication
                            key={medication._id.toString()}
                            medication={medication}
                        />
                    )
                })
            }
        </List>
    )
}