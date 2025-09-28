import { FC, useCallback, useMemo } from "react";
import { Text } from "@ant-design/react-native";
import { useQuery, useRealm } from "@realm/react";
import { BSON } from "realm";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useT } from "../i18n";

import { Medication as MP } from "../realms/medication.ts";
import { Medication } from "../components/medication.component.tsx";
import { MedicationStackParamList } from "./navigation.component.tsx";
import { List } from "../components/list.component.tsx";
import { Input } from "../components/form/Input.component.tsx";
import { useDate } from "../hooks/useDate.ts";
import {Button} from "../components/form/Button.component.tsx";

type Props = NativeStackScreenProps<
    MedicationStackParamList,
    "MedicationsInformation"
>;


export const Medications: FC<Props> = () => {
    const t = useT();
    const { startOfTheDay, endOfTheDay } = useDate();
    const realm = useRealm();

    const ExtraMedicationSchema = useMemo(() => Yup.object().shape({
        name: Yup.string().max(100, t("Maximum 100 characters")).required(t("Enter the medicine name")),
        comment: Yup.string().max(250, t("Maximum 250 characters")),
    }), [t]);

    const medications = useQuery(MP)
        .filtered("planingTime >= $0 AND planingTime < $1", startOfTheDay, endOfTheDay)
        .sorted("planingTime", false);

    const addExtraMedication = useCallback(
        (values: { name: string; comment: string }) => {
            realm.write(() => {
                realm.create<MP>(MP, {
                    _id: new BSON.ObjectId(),
                    name: values.name,
                    comment: values.comment,
                    hasComment: !!values.comment,
                    planingTime: new Date(),
                    realTime: new Date(),
                });
            });
        },
        [realm]
    );

    const formik = useFormik({
        initialValues: { name: "", comment: "" },
        validationSchema: ExtraMedicationSchema,
        onSubmit: (values, { resetForm }) => {
            addExtraMedication(values);
            resetForm();
        },
    });

    return (
        <>
            <List>
                {medications.length > 0 ? (
                    medications.map((med) => (
                        <Medication key={med._id.toString()} medication={med} />
                    ))
                ) : (
                    <List.Item>
                        <Text>{t("No medications")}</Text>
                    </List.Item>
                )}
            </List>

            <List>
                <Input
                    placeholder={t("Additional medicine *") }
                    value={formik.values.name}
                    onChangeText={formik.handleChange("name")}
                    onBlur={formik.handleBlur("name")}
                    error={formik.touched.name ? formik.errors.name : undefined}
                />
                <Input
                    placeholder={t("Comment")}
                    value={formik.values.comment}
                    onChangeText={formik.handleChange("comment")}
                    onBlur={formik.handleBlur("comment")}
                    error={formik.touched.comment ? formik.errors.comment : undefined}
                />

                <Button type="primary" onPress={formik.handleSubmit as any}>
                    {t("Accept")}
                </Button>
            </List>
        </>
    );
};
