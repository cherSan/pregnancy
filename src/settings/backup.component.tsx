import React, {useCallback, useState} from "react";
import {useRealm} from "@realm/react";
import Share from "react-native-share";
import RNBlobUtil from "react-native-blob-util";
import {Button} from "../components/form/Button.component.tsx";
import {pick} from "@react-native-documents/picker";
import {Alert} from "react-native";
import { useT } from "../i18n";

export const BackupComponent = () => {
    const t = useT();
    const [loading, setLoading] = useState(false);

    const realm = useRealm();

    const exportAll = useCallback(async () => {
        setLoading(true);
        try {
            const srcPath = realm.path;
            const destPath = `${RNBlobUtil.fs.dirs.CacheDir}/backup_${new Date().getTime()}.zip`;
            await RNBlobUtil.fs.cp(srcPath, destPath);
            await Share.open({
                url: `content://${destPath}`,
                type: "application/octet-stream",
                saveToFiles: true,
            });

            Alert.alert(t("Success"), t("Backup is ready for export"));
        } catch (err) {
            Alert.alert(t("Error"), t("Failed to export the database"));
        } finally {
            setLoading(false);
        }
    }, [realm.path, t]);

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

            Alert.alert(t("Success"), t("Database successfully restored. Please restart the app."));
        } catch (err) {
            Alert.alert(t("Error"), t("Failed to import the database"));
        } finally {
            setLoading(false);
        }
    }, [realm, t]);

    return (
        <>
            <Button onPress={exportAll} disabled={loading} loading={loading} type="primary">
                {t("Export Data")}
            </Button>
            <Button onPress={importAll} disabled={loading} loading={loading} type="warning">
                {t("Import Data")}
            </Button>
        </>
    );
}