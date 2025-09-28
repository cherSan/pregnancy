import {Switch} from "@ant-design/react-native";
import {useCallback, useMemo} from "react";
import {BSON} from "realm";
import {useRealm} from "@realm/react";
import {useFormik} from "formik";
import * as Yup from "yup";
import {MedicationConfiguration as MCC} from "../realms/medication-configuration.ts";
import {List} from "../components/list.component.tsx";
import {Input} from "../components/form/Input.component.tsx";
import {Button} from "../components/form/Button.component.tsx";
import { useT } from "../i18n";

export const AddMedication = () => {
    const t = useT();
    const realm = useRealm();

    const MedicationSchema = useMemo(() => Yup.object().shape({
        name: Yup.string()
            .max(50, t("Maximum 50 characters"))
            .required(t("Enter the medicine name")),
        time: Yup.string()
            .matches(/^\d{1,2}\.\d{2}$/, t("Format: HH.MM (e.g., 08.30)"))
            .test("valid-time", t("Invalid time"), (val) => {
                if (!val) return false;
                const [h, m] = val.split(".").map(Number);
                return Number.isInteger(h) && Number.isInteger(m) && h >= 0 && h <= 23 && m >= 0 && m <= 59;
            })
            .required(t("Enter time")),
        hasComment: Yup.boolean(),
    }), [t]);

    const saveMedication = useCallback(
        (values: { name: string; time: string; hasComment: boolean }) => {
            const [planingTimeHours, planingTimeMinutes] = values.time.split(".").map(Number);

            realm.write(() => {
                realm.create<MCC>(MCC, {
                    _id: new BSON.ObjectId(),
                    name: values.name,
                    planingTimeHours,
                    planingTimeMinutes,
                    hasComment: values.hasComment,
                });
            });
        },
        [realm]
    );

    const formik = useFormik({
        initialValues: {
            name: "",
            time: "",
            hasComment: false,
        },
        validationSchema: MedicationSchema,
        onSubmit: (values, { resetForm }) => {
            saveMedication(values);
            resetForm();
        },
    });

    return (
        <List>
            <Input
                placeholder={t("Additional medicine *")}
                value={formik.values.name}
                onChangeText={formik.handleChange("name")}
                onBlur={formik.handleBlur("name")}
                error={formik.touched.name ? formik.errors.name : undefined}
            />
            <Input
                placeholder={t("Time HH.MM (e.g., 08.02) *")}
                value={formik.values.time}
                keyboardType="numeric"
                onChangeText={formik.handleChange("time")}
                onBlur={formik.handleBlur("time")}
                error={formik.touched.time ? formik.errors.time : undefined}
            />
            <List.Item
                title={t("Comments available")}
                extra={
                    <Switch
                        checked={formik.values.hasComment}
                        onChange={(val) => {
                            formik.setFieldValue("hasComment", val)
                        }}
                    />
                }
            />
            <Button
                type="primary"
                onPress={() => {
                    formik.handleSubmit();
                }}
            >
                {t("Schedule")}
            </Button>
        </List>
    );
};