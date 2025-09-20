import {FC} from "react";
import {useQuery} from "@realm/react";
import {Medication} from "../realms/medication.ts";
import {List} from "../components/list.component.tsx";

export const MedicationsHistory: FC = () => {
    const medications = useQuery(Medication)
        .filtered('realTime != NULL')
        .sorted('realTime', true);

    return (
        <List>
            {
                medications.map((medication: Medication) => (
                    <List.Item
                        key={medication._id.toString()}
                        title={medication.name}
                        extra={medication?.realTime?.toLocaleString()}
                        description={medication.comment}
                    />
                ))
            }
        </List>
    )
}