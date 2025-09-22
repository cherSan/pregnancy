import {FC, useCallback, useRef} from "react";
import {DatePicker} from "@ant-design/react-native";
import {useQuery, useRealm} from "@realm/react";
import {useFormik} from "formik";
import * as Yup from "yup";
import {User} from "../realms/user.ts";
import {List} from "../components/list.component.tsx";
import {Input} from "../components/form/Input.component.tsx";
import {KicksInformation} from "./kicks-information.component.tsx";
import {MedicationStatistic} from "./medications-statistic.component.tsx";

const SettingsSchema = Yup.object().shape({
    name: Yup.string().max(14, "Не более 14 символов"),
    dob: Yup.date().nullable(),
    eddate: Yup.date().nullable(),
});

export const Settings: FC = () => {
    const realm = useRealm();
    const users = useQuery(User);
    const user = users[0];

    const formik = useFormik({
        initialValues: {
            name: user?.name || "",
            dob: user?.dob || null,
            eddate: user?.eddate || null,
        },
        validationSchema: SettingsSchema,
        onSubmit: (values) => {
            if (!user) return;
            realm.write(() => {
                user.name = values.name;
                if (values.dob && values.dob instanceof Date) {
                    values.dob.setHours(0, 0, 0, 0);
                    user.dob = values.dob;
                }
                if (values.eddate && values.eddate instanceof Date) {
                    values.eddate.setHours(0, 0, 0, 0);
                    user.eddate = values.eddate;
                }
            });
        },
    });

    const timeout = useRef<number>(null);
    const handleChange = useCallback(
        (field: keyof typeof formik.values) => (value: any) => {
            formik.setFieldValue(field, value);
            timeout.current = setTimeout(formik.submitForm, 300);
        },
        [formik]
    );

    if (!user) return null;

    return (
        <>
            <List>
                <Input
                    value={formik.values.name}
                    onChangeText={handleChange("name")}
                    onBlur={formik.handleBlur("name")}
                    placeholder="User Name"
                    maxLength={14}
                    error={formik.touched.name ? formik.errors.name : undefined}
                />
                <DatePicker
                    value={formik.values.dob || undefined}
                    precision="day"
                    minDate={new Date(1950, 7, 6)}
                    maxDate={new Date(2000, 11, 3)}
                    onChange={handleChange("dob")}
                    format="YYYY-MM-DD"
                >
                    <List.Item
                        title="Дата рождения"
                        extra={formik.values.dob instanceof Date ? formik.values.dob?.toLocaleDateString() : ""}
                        arrow
                    />
                </DatePicker>
                <DatePicker
                    value={formik.values.eddate || undefined}
                    precision="day"
                    minDate={new Date()}
                    maxDate={new Date(2100, 11, 3)}
                    onChange={handleChange("eddate")}
                    format="YYYY-MM-DD"
                >
                    <List.Item
                        title="EDD"
                        extra={formik.values.eddate instanceof Date ? formik.values.eddate?.toLocaleDateString() : ""}
                        arrow
                    />
                </DatePicker>
            </List>
            <KicksInformation />
            <MedicationStatistic />
        </>
    );
};
