import {useQuery, useRealm} from "@realm/react";
import {useCallback} from "react";
import {BSON} from "realm";
import {useFormik} from "formik";
import * as Yup from "yup";
import { Page } from "../components/page.component";
import {MotherPressure as MP} from "../realms/mother-pressure.ts";
import {List} from "../components/list.component.tsx";
import {Input} from "../components/form/Input.component.tsx";
import {Button} from "../components/form/Button.component.tsx";

const PressureSchema = Yup.object().shape({
    valueTop: Yup.number()
        .typeError("Введите число")
        .integer("Должно быть целое")
        .max(300, 'Меньше 300')
        .min(40, 'Больше 40')
        .required("Обязательное поле"),
    valueBottom: Yup.number()
        .typeError("Введите число")
        .integer("Должно быть целое")
        .max(300, 'Меньше 300')
        .min(40, 'Больше 40')
        .required("Обязательное поле"),
    pulse: Yup.number()
        .typeError("Введите число")
        .max(300, 'Меньше 300')
        .min(40, 'Больше 40')
        .integer("Должно быть целое"),
});

export const MotherPressure = ({ props }: any) => {
    const realm = useRealm();
    const data = useQuery(MP).sorted('datetime', true);

    const savePressure = useCallback(
        (values: { valueTop: string; valueBottom: string; pulse: string }) => {
            const v1 = parseInt(values.valueTop, 10);
            const v2 = parseInt(values.valueBottom, 10);
            const v3 = parseInt(values.pulse, 10);

            realm.write(() => {
                realm.create<MP>(MP, {
                    _id: new BSON.ObjectId(),
                    valueTop: v1,
                    valueBottom: v2,
                    pulse: v3,
                    datetime: new Date(),
                });
            });
        },
        [realm]
    );

    const formik = useFormik({
        initialValues: { valueTop: '', valueBottom: '', pulse: '' },
        validationSchema: PressureSchema,
        onSubmit: (values, { resetForm }) => {
            savePressure(values);
            resetForm();
        },
    });

    return (
        <Page title={'Давление и пульс мамы'} pressure={true} {...props}>
            <List>
                <Input
                    placeholder="Систолическое давление *"
                    keyboardType="numeric"
                    value={formik.values.valueTop}
                    onChangeText={formik.handleChange('valueTop')}
                    onBlur={formik.handleBlur('valueTop')}
                    error={formik.touched.valueTop ? formik.errors.valueTop : undefined}
                />
                <Input
                    placeholder="Диастолическое давление *"
                    keyboardType="numeric"
                    value={formik.values.valueBottom}
                    onChangeText={formik.handleChange('valueBottom')}
                    onBlur={formik.handleBlur('valueBottom')}
                    error={formik.touched.valueBottom ? formik.errors.valueBottom : undefined}
                />
                <Input
                    placeholder="Пульс"
                    keyboardType="numeric"
                    value={formik.values.pulse}
                    onChangeText={formik.handleChange('pulse')}
                    onBlur={formik.handleBlur('pulse')}
                    error={formik.touched.pulse ? formik.errors.pulse : undefined}
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
                            extra={`${w.valueTop}-${w.valueBottom} / ${w.pulse || '-'}`}
                        />
                    ))}
                </List>
            )}
        </Page>
    );
};
