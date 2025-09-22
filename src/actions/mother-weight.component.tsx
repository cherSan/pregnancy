import {useQuery, useRealm} from "@realm/react";
import {useCallback} from "react";
import {BSON} from "realm";
import {Button} from "@ant-design/react-native";
import {useFormik} from "formik";
import * as Yup from "yup";
import {Page} from "../components/page.component";
import {MotherWeight as MW} from "../realms/mother-weight.ts";
import {List} from "../components/list.component.tsx";
import {Input} from "../components/form/Input.component.tsx";

const WeightSchema = Yup.object().shape({
    weight: Yup.number()
        .typeError("Введите число")
        .min(30, "Слишком маленький вес")
        .max(400, "Слишком большой вес")
        .required("Обязательное поле"),
});

export const MotherWeight = ({ props }: any) => {
    const realm = useRealm();
    const weights = useQuery(MW).sorted("datetime", true);

    const saveWeight = useCallback(
        (values: { weight: string }) => {
            const value = parseFloat(values.weight);
            if (isNaN(value)) return;

            realm.write(() => {
                realm.create<MW>(MW, {
                    _id: new BSON.ObjectId(),
                    value,
                    datetime: new Date(),
                });
            });
        },
        [realm]
    );

    const formik = useFormik({
        initialValues: { weight: "" },
        validationSchema: WeightSchema,
        onSubmit: (values, { resetForm }) => {
            saveWeight(values);
            resetForm();
        },
    });

    return (
        <Page title={"Вес мамы"} weight={true} {...props}>
            <List>
                <Input
                    placeholder="Вес *"
                    keyboardType="numeric"
                    value={formik.values.weight}
                    onChangeText={formik.handleChange("weight")}
                    onBlur={formik.handleBlur("weight")}
                    error={formik.touched.weight ? formik.errors.weight : undefined}
                />
                <Button onPress={formik.handleSubmit} type="primary">
                    Сохранить
                </Button>
            </List>

            {weights.length > 0 && (
                <List>
                    {weights.map((w, i) => (
                        <List.Item
                            key={w._id.toHexString()}
                            title={w.datetime.toLocaleString()}
                            extra={
                            `${w.value.toFixed(1)} (${(w.value - (weights[i + 1]?.value || 0)).toFixed(1)})`
                            }
                        />
                    ))}
                </List>
            )}
        </Page>
    );
};
