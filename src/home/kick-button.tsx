import React, {useCallback, useEffect, useRef} from "react";
import {BSON} from "realm";
import {useRealm} from "@realm/react";
import LinearGradient from "react-native-linear-gradient";
import {useReactive} from "ahooks";
import {Animated, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Input, WhiteSpace} from "@ant-design/react-native";
import {Kick} from "../realms/kick.ts";
import {Colors} from "../constants/colors.ts";
import {Card} from "../components/card.component.tsx";

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
                <Card style={styles.button}>
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
                </Card>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        flex: 1,
        height: 80,
        width: '100%',
        backgroundColor: Colors.background.gradient[0],
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: Colors.primary.active,
        overflow: 'hidden',
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

