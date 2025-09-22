import {StyleSheet} from "react-native";
import {Button, DatePicker, Text} from "@ant-design/react-native";
import {useCallback} from "react";
import {BSON} from "realm";
import {useRealm} from "@realm/react";
import {useNavigation} from "@react-navigation/core";
import {useFormik} from "formik";
import * as Yup from "yup";
import {Hospital} from "../realms/hospital.ts";
import {List} from "../components/list.component.tsx";
import {Input} from "../components/form/Input.component.tsx";

const AppointmentSchema = Yup.object().shape({
    datetime: Yup.date().required("Выберите дату и время"),
    doctor: Yup.string().max(100, "Максимум 100 символов").required("Введите имя врача"),
    hospital: Yup.string().max(100, "Максимум 100 символов").required("Введите название больницы"),
    visitType: Yup.string().max(100, "Максимум 100 символов"),
});

export const AddAppointment = () => {
    const realm = useRealm();
    const navigation = useNavigation();

    const saveAppointment = useCallback(
        (values: { datetime: Date; doctor: string; hospital: string; visitType: string }) => {
            realm.write(() => {
                realm.create<Hospital>(Hospital, {
                    _id: new BSON.ObjectId(),
                    datetime: values.datetime,
                    doctor: values.doctor,
                    hospital: values.hospital,
                    visitType: values.visitType,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    attachments: [],
                    tags: [],
                    questions: [],
                });
            });
            navigation.goBack();
        },
        [realm, navigation]
    );

    const formik = useFormik({
        initialValues: {
            datetime: new Date(),
            doctor: "",
            hospital: "",
            visitType: "",
        },
        validationSchema: AppointmentSchema,
        onSubmit: saveAppointment,
    });

    return (
        <List>
            <DatePicker
                value={formik.values.datetime}
                precision="minute"
                minDate={new Date(2010, 11, 3)}
                maxDate={new Date(2100, 11, 3)}
                onChange={(val) => formik.setFieldValue("datetime", val)}
            >
                <List.Item title="Дата *" />
            </DatePicker>

            <Input
                placeholder="Врач *"
                value={formik.values.doctor}
                onChangeText={formik.handleChange("doctor")}
                onBlur={formik.handleBlur("doctor")}
                error={formik.touched.doctor ? formik.errors.doctor : undefined}
            />
            <Input
                placeholder="Больница *"
                value={formik.values.hospital}
                onChangeText={formik.handleChange("hospital")}
                onBlur={formik.handleBlur("hospital")}
                error={formik.touched.hospital ? formik.errors.hospital : undefined}
            />
            <Input
                placeholder="Тип визита"
                value={formik.values.visitType}
                onChangeText={formik.handleChange("visitType")}
                onBlur={formik.handleBlur("visitType")}
                error={formik.touched.visitType ? formik.errors.visitType : undefined}
            />

            <Button type="primary" onPress={formik.handleSubmit as any} style={styles.aButton}>
                <Text>Запланировать</Text>
            </Button>
        </List>
    );
};

const styles = StyleSheet.create({
    aButton: {
        flex: 1,
    },
    error: {
        color: "red",
        marginLeft: 15,
        marginBottom: 10,
    },
    headerActions: {
        flexDirection: "row",
        gap: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    headerActionsB: {
        flexDirection: "row",
        gap: 12,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
});
