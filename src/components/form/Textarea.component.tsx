import React, { FC, useState } from "react";
import { StyleSheet, TextInput, View, Text, TextInputProps, NativeSyntheticEvent, TextInputContentSizeChangeEventData } from "react-native";
import { Colors } from "../../constants/colors.ts";

type Props = TextInputProps & {
    minRows?: number;
    showCount?: boolean;
    lineHeight?: number;
    error?: string;
};

export const Textarea: FC<Props> = ({
    minRows = 3,
    showCount = true,
    maxLength,
    style,
    lineHeight = 20,
    error,
    ...props
}) => {
    const [value, setValue] = useState(props.value || "");
    const [inputHeight, setInputHeight] = useState(lineHeight * minRows);

    const handleContentSizeChange = (event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
        const height = event.nativeEvent.contentSize.height;
        setInputHeight(Math.max(height, lineHeight * minRows));
    };

    return (
        <View style={styles.wrapper}>
            <TextInput
                {...props}
                multiline
                style={[styles.input, style, { height: inputHeight }]}
                placeholderTextColor={Colors.neutral[400]}
                onChangeText={(text) => {
                    if (maxLength) text = text.slice(0, maxLength);
                    setValue(text);
                    props.onChangeText?.(text);
                }}
                onContentSizeChange={handleContentSizeChange}
                value={value}
                textAlignVertical="top"
            />
            {showCount && maxLength ? (
                <Text style={styles.count}>
                    {value.length} / {maxLength}
                </Text>
            ) : null}
            <View style={styles.errorContainer}>
                <Text style={styles.error}>{error || ''}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        position: "relative",
        paddingHorizontal: 4,
        display: "flex",
        flexDirection: 'column'
    },
    input: {
        fontWeight: "bold",
        color: Colors.secondary.default,
        backgroundColor: "transparent",
        paddingHorizontal: 4,
        paddingBottom: 34,
    },
    count: {
        position: "absolute",
        bottom: 16,
        right: 0,
        display: 'flex',
        fontSize: 10,
        paddingBottom: 4,
        boxSizing: 'border-box',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        flexWrap: 'nowrap'
    },
    errorContainer: {
        position: "absolute",
        bottom: 0,
        right: 0,
        display: 'flex',
        fontSize: 12,
        paddingBottom: 4,
        boxSizing: 'border-box',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        flexWrap: 'nowrap'
    },
    error: {
        color: Colors.accent.error,
        fontSize: 10,
        lineHeight: 10,
    },
});
