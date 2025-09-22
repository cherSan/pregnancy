import {Button, Switch, Text} from "@ant-design/react-native";
import {useCallback} from "react";
import {BSON} from "realm";
import {useRealm} from "@realm/react";
import {useFormik} from "formik";
import * as Yup from "yup";
import {MedicationConfiguration as MCC} from "../realms/medication-configuration.ts";
import {List} from "../components/list.component.tsx";
import {Input} from "../components/form/Input.component.tsx";

const MedicationSchema = Yup.object().shape({
    name: Yup.string()
        .max(50, "Максимум 50 символов")
        .required("Введите название лекарства"),
    time: Yup.string()
        .matches(/^\d{1,2}\.\d{2}$/, "Формат: ЧЧ.ММ (например, 08.30)")
        .test("valid-time", "Некорректное время", (val) => {
            if (!val) return false;
            const [h, m] = val.split(".").map(Number);
            return Number.isInteger(h) && Number.isInteger(m) && h >= 0 && h <= 23 && m >= 0 && m <= 59;
        })
        .required("Введите время"),
    hasComment: Yup.boolean(),
});

export const AddMedication = () => {
    const realm = useRealm();

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
                placeholder="Лекарство *"
                value={formik.values.name}
                onChangeText={formik.handleChange("name")}
                onBlur={formik.handleBlur("name")}
                error={formik.touched.name ? formik.errors.name : undefined}
            />
            <Input
                placeholder="Время ЧЧ.ММ (например, 08.02) *"
                value={formik.values.time}
                keyboardType="numeric"
                onChangeText={formik.handleChange("time")}
                onBlur={formik.handleBlur("time")}
                error={formik.touched.time ? formik.errors.time : undefined}
            />
            <List.Item
                title="Доступны комментарии"
                extra={
                    <Switch
                        checked={formik.values.hasComment}
                        onChange={(val) => {
                            formik.setFieldValue("hasComment", val)
                        }}
                    />
                }
            />
            <Button type="primary" onPress={formik.handleSubmit}>
                Запланировать
            </Button>
        </List>
    );
};