import React, {useCallback} from "react";
import {BSON} from "realm";
import {useRealm} from "@realm/react";
import {useReactive} from "ahooks";
import {StyleSheet, TouchableOpacity} from "react-native";
import {Input, Text, View} from "@ant-design/react-native";
import {Kick} from "../realms/kick.ts";

type Props = {
    title?: string;
};

export const KickButton: React.FC<Props> = ({ title = "Толчок" }) => {
    const realm = useRealm();
    const data = useReactive({
        comment: ''
    })
    const registerKick = useCallback(() => {
        realm.write(() => {
            realm.create<Kick>(
                Kick,
                {
                    _id: new BSON.ObjectId(),
                    datetime: new Date(),
                    comment: data.comment,
                }
            );
        });
        data.comment = '';
    }, [data, realm])

    return (
        <View>
            <Input
                value={data.comment}
                placeholder={'Комментарий'}
                onChange={e => {
                    data.comment = (e.target as any).value
                }}
            />
            <TouchableOpacity style={styles.button} onPress={registerKick} activeOpacity={0.7}>
                <Text style={styles.text}>{title}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#e74c3c",
        borderColor: "#c0392b",
        borderWidth: 3,
        borderRadius: 12,
        paddingVertical: 20,
        paddingHorizontal: 40,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    text: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "700",
    },
});

