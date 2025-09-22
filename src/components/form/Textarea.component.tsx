import React, { FC, useState } from "react";
import { StyleSheet, TextInput, View, Text, TextInputProps, NativeSyntheticEvent, TextInputContentSizeChangeEventData } from "react-native";
import { Colors } from "../../constants/colors.ts";

type Props = TextInputProps & {
    minRows?: number;
    showCount?: boolean;
    lineHeight?: number;
};

export const Textarea: FC<Props> = ({
    minRows = 3,
    showCount = true,
    maxLength,
    style,
    lineHeight = 20,
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
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        paddingHorizontal: 4,
    },
    input: {
        fontWeight: "bold",
        color: Colors.secondary.default,
        backgroundColor: "transparent",
        paddingVertical: 4,
        paddingHorizontal: 4,
    },
    count: {
        color: Colors.neutral[600],
        fontSize: 12,
        marginTop: 4,
        textAlign: "right",
    },
});
