import { createContext } from 'react';
import { Log } from '../types/sharedTypes';

export type AppContextType = {
  primaryColor: string;
  setPrimaryColor: (arg0: string) => void;
  logs: Log[];
  addLog: (arg0: any) => void;
  ticketDeepLinkId: string | undefined;
  setTicketDeepLinkId: (arg0: string | undefined) => void;
};

export const AppContext = createContext<AppContextType>({
  primaryColor: 'black',
  setPrimaryColor: () => {},
  logs: [],
  addLog: () => {},
  ticketDeepLinkId: undefined,
  setTicketDeepLinkId: () => {},
});
