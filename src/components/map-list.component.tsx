import { StyleProp, View, ViewStyle } from 'react-native'
import React, {ReactElement, useCallback} from 'react'

type Props = {
    data: any[];
    renderItem: (item: any, index: number) => ReactElement;
    style?: StyleProp<ViewStyle>;
    fragment?: boolean;
};

export const MapList = ({
    data,
    renderItem,
    style,
    fragment = false
}: Props) => {
    const MappedView = useCallback(() => (
        <>
            {data?.map((item, index) => renderItem(item, index))}
        </>
    ), [data, renderItem]);
    if (data.length === 0 && !renderItem) return null;
    if (fragment) {
        return <MappedView />
    }
    return (
        <View style={style}>
            <MappedView />
        </View>
    );
};

MapList.defaultProps = {
    fragment: false,
}