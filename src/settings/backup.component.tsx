import React, {useCallback, useState} from "react";
import {useRealm} from "@realm/react";
import Share from "react-native-share";
import RNBlobUtil from "react-native-blob-util";
import {Button} from "../components/form/Button.component.tsx";
import {pick} from "@react-native-documents/picker";
import {Alert} from "react-native";

export const BackupComponent = () => {
    const [loading, setLoading] = useState(false);

    const realm = useRealm();

    const exportAll = useCallback(async () => {
        setLoading(true);
        try {
            const srcPath = realm.path;
            const destPath = RNBlobUtil.fs.dirs.LegacyDownloadDir + "/backup.zip";
            await RNBlobUtil.fs.cp(srcPath, destPath);
            await Share.open({
                url: `file://${destPath}`,
                type: "application/octet-stream",
                saveToFiles: true,
            });

            Alert.alert("Успех", "Бэкап готов для экспорта");
        } catch (err) {
            console.error("Ошибка при экспорте Realm:", err);
            Alert.alert("Ошибка", "Не удалось экспортировать базу");
        } finally {
            setLoading(false);
        }
    }, [realm]);

    const importAll = useCallback(async () => {
        setLoading(true);
        try {
            const [result] = await pick({
                mode: 'open',
                allowMultiSelection: false,
            });
            const realmPath = realm.path;

            if (!realm.isClosed) realm.close();

            let filePath = result.uri;
            if (filePath.startsWith("file://")) {
                const stat = await RNBlobUtil.fs.stat(filePath);
                filePath = stat.path;
            }

            await RNBlobUtil.fs.unlink(realmPath);
            await RNBlobUtil.fs.cp(filePath, realmPath);

            Alert.alert("Успех", "База успешно восстановлена. Перезапустите приложение.");
        } catch (err) {
            console.error(err);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }, [realm]);

    return (
        <>
            <Button onPress={exportAll} disabled={loading} type="primary">
                Экспорт Данных
            </Button>
            <Button onPress={importAll} disabled={loading} type="warning">
                Импорт Данных
            </Button>
        </>
    );
}