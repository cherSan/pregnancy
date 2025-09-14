import {useQuery, useRealm} from "@realm/react";
import {FC, ReactNode, useEffect, useState} from "react";
import {BSON} from "realm";
import {User} from "./realms/user.ts";
import {MedicationConfiguration} from "./realms/medication-configuration.ts";
import {Medication} from "./realms/medication.ts";

type Props = {
    children: ReactNode;
}

export const Initialize: FC<Props> = ({ children }) => {
    const realm = useRealm();
    const users = useQuery(User);
    const medicationConfiguration = useQuery(MedicationConfiguration);
    const medication = useQuery(Medication);

    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        const user = users[0];
        if (!user) {
            realm.write(() => {
                realm.create<User>(
                    'User',
                    {
                        _id: new BSON.ObjectId(),
                        name: ''
                    }
                );
            });
        }
        medicationConfiguration.forEach(config => {
            const {
                planingTimeHours,
                planingTimeMinutes,
                name,
                hasComment,
            } = config;
            const now = new Date();
            const planingTime = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                planingTimeHours,
                planingTimeMinutes,
                0,
                0
            );
            const test = medication
                .filtered(
                    'name = $0 AND planingTime = $1',
                    config.name,
                    planingTime,
                );

            if (test.length > 0) return;
            realm.write(() => {
                realm.create<Medication>(
                    'Medication',
                    {
                        _id: new BSON.ObjectId(),
                        name,
                        planingTime,
                        hasComment,
                    }
                );
            });
        })

        setInitialized(true)
    }, [users, realm, setInitialized, medicationConfiguration, medication]);

    return initialized
        ? children
        : null;
}