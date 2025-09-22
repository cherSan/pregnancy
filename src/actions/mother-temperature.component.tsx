import {useQuery, useRealm} from "@realm/react";
import {useCallback} from "react";
import {BSON} from "realm";
import {useFormik} from "formik";
import * as Yup from "yup";
import {Page} from "../components/page.component";
import {MotherTemperature as MT} from "../realms/mother-temperature.ts";
import {List} from "../components/list.component.tsx";
import {Input} from "../components/form/Input.component.tsx";
import {Button} from "../components/form/Button.component.tsx";

const TemperatureSchema = Yup.object().shape({
    value: Yup.number()
        .typeError("Введите число")
        .min(30, "Температура не может быть ниже 30°C")
        .max(50, "Температура не может быть выше 50°C")
        .required("Обязательное поле"),
});

export const MotherTemperature = ({ props }: any) => {
    const realm = useRealm();
    const data = useQuery(MT).sorted("datetime", true);

    const saveTemperature = useCallback(
        (values: { value: string }) => {
            const value = parseFloat(values.value);
            if (isNaN(value)) return;

            realm.write(() => {
                realm.create<MT>(MT, {
                    _id: new BSON.ObjectId(),
                    value,
                    datetime: new Date(),
                });
            });
        },
        [realm]
    );

    const formik = useFormik({
        initialValues: { value: "" },
        validationSchema: TemperatureSchema,
        onSubmit: (values, { resetForm }) => {
            saveTemperature(values);
            resetForm();
        },
    });

    return (
        <Page title={"Температура мамы"} temperature={true} {...props}>
            <List>
                <Input
                    placeholder="Температура *"
                    keyboardType="numeric"
                    value={formik.values.value}
                    onChangeText={formik.handleChange("value")}
                    onBlur={formik.handleBlur("value")}
                    error={formik.touched.value ? formik.errors.value : undefined}
                />
                <Button onPress={formik.handleSubmit} type="primary">
                    Сохранить
                </Button>
            </List>

            {data.length > 0 && (
                <List>
                    {data.map((w) => (
                        <List.Item
                            key={w._id.toHexString()}
                            title={w.datetime.toLocaleString()}
                            extra={w.value.toFixed(1)}
                        />
                    ))}
                </List>
            )}
        </Page>
    );
};
