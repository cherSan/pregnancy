import {FC, useCallback, useMemo, useRef} from "react";
import {DatePicker, Picker} from "@ant-design/react-native";
import {useQuery, useRealm} from "@realm/react";
import {useFormik} from "formik";
import * as Yup from "yup";
import {User} from "../realms/user.ts";
import {List} from "../components/list.component.tsx";
import {Input} from "../components/form/Input.component.tsx";
import {KicksInformation} from "./kicks-information.component.tsx";
import {MedicationStatistic} from "./medications-statistic.component.tsx";
import {useDate} from "../hooks/useDate.ts";
import {Report} from "./report.component.tsx";
import {BackupComponent} from "./backup.component.tsx";
import { useT } from "../i18n";
import {useReactive} from "ahooks";

export const Settings: FC = () => {
    const t = useT();
    const realm = useRealm();
    const users = useQuery(User);
    const user = users[0];
    const { now } = useDate();

    const state = useReactive({
        lang: false,
        langValue: user.lang || 'en',
    })

    const SettingsSchema = useMemo(() => Yup.object().shape({
        name: Yup.string().max(14, t("No more than 14 characters")),
        dob: Yup.date().nullable(),
        eddate: Yup.date().nullable(),
    }), [t]);

    const formik = useFormik({
        initialValues: {
            name: user?.name || "",
            dob: user?.dob || null,
            eddate: user?.eddate || null,
            lang: user?.lang || 'en'
        },
        validationSchema: SettingsSchema,
        onSubmit: (values) => {
            if (!user) return;
            realm.write(() => {
                user.name = values.name;
                user.lang = values.lang;
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

    const timeout = useRef<any>(null);
    const handleChange = useCallback(
        (field: keyof typeof formik.values) => (value: any) => {
            formik.setFieldValue(field, value);
            timeout.current = setTimeout(formik.submitForm, 300);
        },
        [formik]
    );

    const maxEDD = useMemo(() => {
        const maxEdd = new Date();
        maxEdd.setDate(now.getDate() + 280);
        return maxEdd;
    }, [now]);

    if (!user) return null;

    return (
        <>
            <List>
                <Input
                    value={formik.values.name}
                    onChangeText={handleChange("name")}
                    onBlur={formik.handleBlur("name")}
                    placeholder={t("User Name")}
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
                        title={t("Date of birth") }
                        extra={formik.values.dob instanceof Date ? formik.values.dob?.toLocaleDateString() : ""}
                        arrow
                    />
                </DatePicker>
                <List.Item
                    onPress={() => {
                        state.lang = true
                    }}
                    title={t("Language") }
                    extra={formik.values.lang || 'en'}
                    arrow
                />
                <DatePicker
                    value={formik.values.eddate || undefined}
                    precision="day"
                    minDate={new Date()}
                    maxDate={maxEDD}
                    onChange={handleChange("eddate")}
                    format="YYYY-MM-DD"
                >
                    <List.Item
                        title={t("EDD")}
                        extra={formik.values.eddate instanceof Date ? formik.values.eddate?.toLocaleDateString() : ""}
                        arrow
                    />
                </DatePicker>
                <BackupComponent />
                <Report />
            </List>
            <KicksInformation />
            <MedicationStatistic />
            <Picker
                visible={state.lang}
                data={[
                    {
                        label: 'English',
                        value: 'en'
                    },
                    {
                        label: 'Русский',
                        value: 'ru'
                    }
                ]}
                numberOfLines={1}
                onPickerChange={(value, index) => {
                    state.langValue = (value[index] as string) || 'en';
                }}
                onOk={() => {
                    handleChange("lang")(state.langValue);
                }}
                onClose={() => {
                    state.langValue = user.lang || 'en';
                    state.lang = false;
                }}
            />
        </>
    );
};
