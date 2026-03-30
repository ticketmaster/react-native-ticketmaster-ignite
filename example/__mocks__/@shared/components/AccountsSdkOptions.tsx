import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useIgnite } from 'react-native-ticketmaster-ignite';

const AccountsSdkOptions = () => {
  const {
    login,
    logout,
    getToken,
    refreshToken,
    getMemberInfo,
    getIsLoggedIn,
    authState,
  } = useIgnite();

  return (
    <View>
      <Pressable onPress={() => login()}>
        <Text>Login</Text>
      </Pressable>
      <Pressable onPress={() => logout()}>
        <Text>Logout</Text>
      </Pressable>
      <Pressable onPress={() => getToken()}>
        <Text>Get Token</Text>
      </Pressable>
      <Pressable onPress={() => refreshToken()}>
        <Text>Refresh Token</Text>
      </Pressable>
      <Pressable onPress={() => getMemberInfo()}>
        <Text>Get Member Info</Text>
      </Pressable>
      <Pressable onPress={() => getIsLoggedIn()}>
        <Text>Get isLoggedIn: {String(authState?.isLoggedIn ?? false)}</Text>
      </Pressable>
    </View>
  );
};

export default AccountsSdkOptions;
