import React, { useState } from 'react';
import {
  Platform,
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import {
  RetailSDK,
  TicketsSdkModal,
  useIgnite,
} from 'react-native-ticketmaster-ignite';
import Config from 'react-native-config';
import ChevronRight from '../assets/svg/ChevronRight';

const Home = () => {
  const [showTicketsSdk, setShowTicketsSdk] = useState(false);

  const {
    login,
    logout,
    getToken,
    refreshToken,
    getMemberInfo,
    getIsLoggedIn,
    isLoggingIn,
  } = useIgnite();

  const DATA = [
    {
      header: 'Accounts SDK',
      data: [
        {
          title: 'Login',
          platforms: ['ios', 'android'],
          onPress: () => onLogin(),
          first: true,
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
          last: true,
        },
      ],
    },
    {
      header: 'Retail SDK',
      data: [
        {
          title: 'Show Retail PrePurchase Venue',
          platforms: ['android', 'ios'],
          onPress: () => onShowPrePurchaseVenue(),
          first: true,
        },
        {
          title: 'Show Retail PrePurchase Attraction',
          platforms: ['android', 'ios'],
          onPress: () => onShowPrePurchaseAttraction(),
        },
        {
          title: 'Show Retail Purchase',
          platforms: ['android', 'ios'],
          onPress: () => onShowPurchase(),
          last: true,
        },
      ],
    },
    {
      header: 'Tickets SDK',
      data: [
        {
          title: 'Tickets SDK (Modal)',
          platforms: ['ios'],
          onPress: () => onShowTicketsSDK(),
          first: true,
          last: true,
        },
      ],
    },
  ];

  const onShowPurchase = async () => {
    try {
      await RetailSDK.presentPurchase(Config.DEMO_EVENT_ID);
    } catch (e) {
      console.log('error when showing Purchase', (e as Error).message);
    }
  };

  const onShowPrePurchaseVenue = async () => {
    try {
      const onEDPSelectionStarted = () => {
        console.log('do stuff here');
      };
      const onMenuItemSelected = () => {
        console.log('do stuff here');
      };
      const openURLNotSupported = () => {
        console.log('do stuff here');
      };
      await RetailSDK.setupUserAnalytics(
        onEDPSelectionStarted,
        onMenuItemSelected,
        openURLNotSupported
      );
      await RetailSDK.presentPrePurchaseVenue(Config.DEMO_VENUE_ID);
    } catch (e) {
      console.log('error when showing PrePurchase venue', (e as Error).message);
    }
  };

  const onShowPrePurchaseAttraction = async () => {
    try {
      await RetailSDK.presentPrePurchaseAttraction(Config.DEMO_ATTRACTION_ID);
    } catch (e) {
      console.log(
        'error when showing PrePurchase attraction',
        (e as Error).message
      );
    }
  };

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

  const onShowTicketsSDK = () => {
    setShowTicketsSdk(true);
  };

  return (
    <>
      {!!isLoggingIn && (
        <View style={styles.activityIndicator}>
          <ActivityIndicator color={'blue'} size={'small'} />
        </View>
      )}
      <SectionList
        // @ts-ignore
        sections={DATA}
        stickySectionHeadersEnabled={false}
        keyExtractor={(item, index) => item.title + index}
        renderItem={({ item }) => (
          <>
            {item.platforms.includes(Platform.OS) && (
              <>
                <Pressable
                  onPress={() => item.onPress && item.onPress()}
                  style={({ pressed }) => [
                    styles.item,
                    item.first && styles.topItem,
                    item.last && styles.bottomItem,
                    {
                      backgroundColor: pressed ? '#00000008' : 'white',
                    },
                  ]}
                >
                  <Text style={styles.title}>{item.title}</Text>
                  <View>
                    <ChevronRight />
                  </View>
                </Pressable>

                {!item.last && <View style={styles.horizontalLine} />}
              </>
            )}
          </>
        )}
        renderSectionHeader={({ section: { header, data } }) => (
          <>
            {data.some((item) => item.platforms.includes(Platform.OS)) && (
              <View style={styles.headerWrapper}>
                <Text style={styles.header}>{header}</Text>
              </View>
            )}
          </>
        )}
        contentContainerStyle={styles.listPadding}
      />
      <TicketsSdkModal
        showTicketsModal={showTicketsSdk}
        setShowTicketsModal={setShowTicketsSdk}
      />
    </>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 12,
    marginHorizontal: 12,
  },
  topItem: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  bottomItem: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  header: {
    color: '#808080',
    fontSize: 20,
  },
  headerWrapper: {
    marginLeft: 20,
    marginTop: 14,
    marginBottom: 8,
  },
  listPadding: {
    paddingBottom: 60,
  },
  title: {
    fontSize: 16,
    color: 'black',
  },
  horizontalLine: {
    height: 2,
  },
  activityIndicator: {
    paddingTop: 12,
  },
});

export default Home;
