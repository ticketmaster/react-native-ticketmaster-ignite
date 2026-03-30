import { NavigatorScreenParams } from '@react-navigation/native';

export type Log = {
  timestamp: string;
  message: string | object;
  type: string;
};

export type BottomTabsParamList = {
  Home: { venueId: string; attractionId: string; eventId: string };
  TicketsSdkEmbedded: undefined;
  SecureEntry: undefined;
};

export type RootStackParamList = {
  BottomTabs: NavigatorScreenParams<BottomTabsParamList>;
  Configuration: undefined;
  Analytics: undefined;
};
