import {RealmProvider} from "@realm/react";
import {User} from "./realms/user.ts";
import {Kick} from "./realms/kick.ts";
import {MedicationConfiguration} from "./realms/medication-configuration.ts";
import {Medication} from "./realms/medication.ts";
import {Notes} from "./realms/notes.ts";
import {Hospital} from "./realms/hospital.ts";
import {MotherPressure} from "./realms/mother-pressure.ts";
import {MotherTemperature} from "./realms/mother-temperature.ts";
import {MotherWeight} from "./realms/mother-weight.ts";
import {MotherMood} from "./realms/mother-mood.ts";
import {Image} from "./realms/image.ts";
import { I18nProvider } from "./i18n";
import { UI } from "./ui.tsx";

export const Application = () => {
    return (
        <RealmProvider
            schemaVersion={15}
            onMigration={(oldRealm, newRealm) => {
                if (oldRealm.schemaVersion < 3) {
                    const oldUsers = oldRealm.objects('User');
                    const newUsers = newRealm.objects('User');
                    for (let i = 0; i < oldUsers.length; i++) {
                        newUsers[i].eddate = null;
                    }
                }
                if (oldRealm.schemaVersion < 4) {}
                if (oldRealm.schemaVersion < 5) {}
                if (oldRealm.schemaVersion < 5) {}
                if (oldRealm.schemaVersion < 12) {
                    const oldHospital = oldRealm.objects('Hospital');
                    const newHospital = newRealm.objects('Hospital');
                    for (let i = 0; i < oldHospital.length; i++) {
                        newHospital[i].attachments = [];
                    }
                }
            }}
            schema={[
                User,
                Kick,
                MedicationConfiguration,
                Medication,
                Notes,
                Hospital,
                MotherPressure,
                MotherTemperature,
                MotherWeight,
                MotherMood,
                Image,
            ]}
        >
            <I18nProvider initialLanguage={"en"}>
                <UI />
            </I18nProvider>
        </RealmProvider>
    )
}