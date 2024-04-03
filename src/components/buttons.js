import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import React from 'react';
import Colors from '../constants/Colors';
interface buttonProps extends TouchableOpacityProps {
  title: string | React.ReactNode;
  labelStyle?: TextStyle;
  loading?: boolean;
}
export const PrimaryButton = (props: buttonProps) => {
  return (
    <TouchableOpacity
      {...props}
      disabled={props?.disabled || props?.loading}
      style={{
        backgroundColor: Colors.primary,
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        ...props?.style,
      }}>
      {props?.loading ? (
        <ActivityIndicator size={22} color={'white'} />
      ) : typeof props?.title == 'string' ? (
        <Text
          style={{
            textAlign: 'center',
            fontSize: 16,
            color: '#fff',
            ...props?.labelStyle,
          }}>
          {props?.title}
        </Text>
      ) : (
        props?.title || props?.children
      )}
    </TouchableOpacity>
  );
};

export const SecondaryButton = (props: buttonProps) => {
  return (
    <TouchableOpacity
      {...props}
      disabled={props?.disabled || props?.loading}
      style={{
        flex: 1,
        backgroundColor: Colors.secondary,
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        ...props?.style,
      }}>
      {props?.loading ? (
        <ActivityIndicator size={22} color={'white'} />
      ) : typeof props?.title == 'string' ? (
        <Text
          style={{
            textAlign: 'center',
            fontSize: 16,
            color: '#fff',
            ...props?.labelStyle,
          }}>
          {props?.title}
        </Text>
      ) : (
        props?.title
      )}
    </TouchableOpacity>
  );
};
