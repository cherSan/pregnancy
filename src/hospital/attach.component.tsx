import {FC, useCallback} from "react";
import {launchCamera} from "react-native-image-picker";
import {BSON} from "realm";
import {useObject, useRealm} from "@realm/react";
import {Button} from "../components/form/Button.component.tsx";
import {Hospital} from "../realms/hospital.ts";
import {Image} from "../realms/image.ts";

type Props = {
    id: string;
}

export const Attach: FC<Props> = ({ id }) => {
    const realm = useRealm();
    const appointment = useObject(Hospital, new BSON.ObjectId(id));
    const attach = useCallback(async () => {
        if (!appointment) return;
        const result = await launchCamera({mediaType: "photo", includeBase64: true});
        if (!result.assets || result.assets.length === 0) return;
        const asset = result.assets[0];
        realm.write(() => {
            if (asset.base64) {
                const data = realm.create(
                    Image,
                    {
                        _id: new BSON.ObjectId(),
                        base64: asset.base64,
                        fileName: asset.fileName,
                        fileSize: asset.fileSize,
                        height: asset.height,
                        width: asset.width,
                        originalPath: asset.originalPath,
                        type: asset.type,
                        uri: asset.uri,
                        createdAt: new Date(),
                    }
                )
                appointment.attachments.push(data);
            }
        });
    }, [appointment, realm]);

    return (
        <Button type={'primary'} onPress={attach}>
            Добавить вложение
        </Button>
    )
}