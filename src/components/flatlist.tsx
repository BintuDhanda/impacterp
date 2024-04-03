import React from 'react';
import {
  FlatList as DefaultFlatList,
  FlatListProps as DefaultFlatListProps,
  View,
  Text,
  ActivityIndicator,
  Dimensions,
} from 'react-native';

interface FlatListProps<T> extends DefaultFlatListProps<any> {
  loading?: boolean;
  emptyMessageColor?: string;
  emptyMessageText?: string;
  listEmptyHeight?: string | number;
}
const {height} = Dimensions.get('window');
export const FlatList = (props: FlatListProps<any>) => {
  const dataLength = props?.data?.length || 0;
  let listEmptyHeight = height - 200;
  if (props?.ListHeaderComponent) {
    listEmptyHeight = height - 250;
  }
  return (
    <DefaultFlatList
      refreshing={false}
      contentContainerStyle={{
        paddingBottom: 10,
      }}
      onEndReachedThreshold={0.1}
      keyExtractor={(_, index) => index.toString()}
      ListFooterComponent={() =>
        dataLength > 0 &&
        props?.loading && (
          <View style={{}}>
            <ActivityIndicator animating size="large" />
          </View>
        )
      }
      ListEmptyComponent={() => (
        <View
          style={{
            height: props?.listEmptyHeight || listEmptyHeight,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: props?.emptyMessageColor || 'gray',
              fontSize: 18,
            }}>
            {props.emptyMessageText || 'No item'}
          </Text>
        </View>
      )}
      {...props}
    />
  );
};
