import React from 'react';
import { useIgnite } from 'react-native-ticketmaster-ignite';
import { View, Platform } from 'react-native';
import SDKButton from './SDKButton';
import SectionHeader from './SectionHeader';

const AccountsSDKOptions = () => {
  const {
    login,
    logout,
    getToken,
    refreshToken,
    getMemberInfo,
    getIsLoggedIn,
  } = useIgnite();

  const onLogin = async () => {
    try {
      await login();
    } catch (e) {
      console.log('Accounts SDK login error:', (e as Error).message);
    }
  };

  const onLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.log('Accounts SDK logout error:', (e as Error).message);
    }
  };

  const onGetIsLoggedIn = async () => {
    try {
      await getIsLoggedIn();
    } catch (e) {
      console.log('Accounts SDK getIsLoggedIn error:', (e as Error).message);
    }
  };

  const onRefreshToken = async () => {
    try {
      await refreshToken();
    } catch (e) {
      console.log('Account SDK refreshToken error:', (e as Error).message);
    }
  };

  const onGetMemberInfo = async () => {
    try {
      await getMemberInfo();
    } catch (e) {
      console.log('Account SDK getMemberInfo error: ', (e as Error).message);
    }
  };

  const onGetToken = async () => {
    try {
      await getToken();
    } catch (e) {
      console.log('Account SDK getToken error:', (e as Error).message);
    }
  };

  const DATA = [
    {
      title: 'Login',
      platforms: ['ios', 'android'],
      onPress: () => onLogin(),
    },
    {
      title: 'Logout',
      platforms: ['ios', 'android'],
      onPress: () => onLogout(),
    },
    {
      title: 'IsLoggedIn',
      platforms: ['ios', 'android'],
      onPress: () => onGetIsLoggedIn(),
    },
    {
      title: 'Refresh Token',
      platforms: ['ios', 'android'],
      onPress: () => onRefreshToken(),
    },
    {
      title: 'Get Member',
      platforms: ['ios', 'android'],
      onPress: () => onGetMemberInfo(),
    },
    {
      title: 'Get Token',
      platforms: ['ios', 'android'],
      onPress: () => onGetToken(),
    },
  ];

  return (
    <View>
      <SectionHeader title="Accounts SDK" />
      {DATA.map(item => {
        return (
          item.platforms.includes(Platform.OS) && (
            <SDKButton item={item} key={item.title} />
          )
        );
      })}
    </View>
  );
};

export default AccountsSDKOptions;
