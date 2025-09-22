import {useCallback} from "react";
import {BSON} from "realm";
import {useRealm} from "@realm/react";
import {Button, Text} from "@ant-design/react-native";
import {StyleSheet} from "react-native";
import {useNavigation} from "@react-navigation/core";
import {useFormik} from "formik";
import * as Yup from "yup";
import {Notes} from "../realms/notes.ts";
import {List} from "../components/list.component.tsx";
import {Input} from "../components/form/Input.component.tsx";
import {Textarea} from "../components/form/Textarea.component.tsx";

// ✅ схема валидации
const NoteSchema = Yup.object().shape({
    title: Yup.string()
        .max(50, "Максимум 50 символов")
        .required("Введите заголовок"),
    comment: Yup.string()
        .max(5000, "Максимум 5000 символов")
        .required("Введите сообщение"),
    important: Yup.string()
        .max(5000, "Максимум 5000 символов"),
});

export const AddNote = () => {
    const realm = useRealm();
    const navigation = useNavigation();

    const saveNote = useCallback(
        (values: { title: string; comment: string; important: string }) => {
            realm.write(() => {
                realm.create<Notes>(Notes, {
                    _id: new BSON.ObjectId(),
                    datetime: new Date(),
                    ...values,
                });
            });
            navigation.goBack();
        },
        [realm, navigation]
    );

    const formik = useFormik({
        initialValues: { title: "", comment: "", important: "" },
        validationSchema: NoteSchema,
        onSubmit: saveNote,
    });

    return (
        <List>
            <Input
                placeholder="Заголовок *"
                value={formik.values.title}
                onChangeText={formik.handleChange("title")}
                onBlur={formik.handleBlur("title")}
                error={formik.touched.title ? formik.errors.title : undefined}
            />
            <Textarea
                minRows={4}
                maxLength={5000}
                showCount
                placeholder="Сообщение *"
                value={formik.values.comment}
                onChangeText={formik.handleChange("comment")}
                onBlur={formik.handleBlur("comment")}
                error={formik.touched.comment ? formik.errors.comment : undefined}
            />
            <Textarea
                minRows={4}
                maxLength={5000}
                showCount
                placeholder="Важно"
                value={formik.values.important}
                onChangeText={formik.handleChange("important")}
                onBlur={formik.handleBlur("important")}
                error={formik.touched.important ? formik.errors.important : undefined}
            />
            <Button type="primary" onPress={formik.handleSubmit as any} style={styles.aButton}>
                <Text>Добавить</Text>
            </Button>
        </List>
    );
};

const styles = StyleSheet.create({
    aButton: {
        flex: 1,
    },
    headerActionsB: {
        flexDirection: "row",
        gap: 12,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
});
