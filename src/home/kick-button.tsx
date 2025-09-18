import React, {useCallback, useEffect, useRef} from "react";
import {BSON} from "realm";
import {useRealm} from "@realm/react";
import LinearGradient from "react-native-linear-gradient";
import {useReactive} from "ahooks";
import {Animated, StyleSheet, TouchableOpacity} from "react-native";
import {Input, Text, View, WhiteSpace} from "@ant-design/react-native";
import {Kick} from "../realms/kick.ts";

type Props = {
    title?: string;
};

export const KickButton: React.FC<Props> = ({ title = "Толчок" }) => {
    const realm = useRealm();
    const [buttonWidth, setButtonWidth] = React.useState(0);
    const data = useReactive({
        comment: ''
    })
    const shimmerAnim = useRef(new Animated.Value(-1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(shimmerAnim, {
                toValue: 1,
                duration: 3500,
                useNativeDriver: true,
            })
        ).start();
    }, [shimmerAnim]);

    const translateX = shimmerAnim.interpolate({
        inputRange: [-1, 1],
        outputRange: [-buttonWidth-100, buttonWidth+100],
    });
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
                multiline={true}
                numberOfLines={4}
                value={data.comment}
                placeholder={'Комментарий'}
                onChange={e => {
                    data.comment = (e.target as any).value
                }}
            />
            <WhiteSpace />
            <TouchableOpacity
                onPress={registerKick}
                activeOpacity={0.8}
                onLayout={e => setButtonWidth(e.nativeEvent.layout.width)}
            >
                <View style={styles.button}>
                    <Text style={styles.text}>{title}</Text>
                    <Animated.View
                        style={[
                            styles.shimmerOverlay,
                            { transform: [{ translateX }] }
                        ]}
                    >
                        <LinearGradient
                            colors={['transparent', 'rgba(255,255,255,0.4)', 'transparent']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.lg}
                        />
                    </Animated.View>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        width: '100%',
        height: 100,
        backgroundColor: '#5d88d6',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#4a6fc1',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 6,
    },
    text: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        zIndex: 1,
    },
    shimmerOverlay: {
        ...StyleSheet.absoluteFillObject,
    },
    lg: {
        flex: 1
    }
});

