import React, { createContext } from 'react';
import Config from 'react-native-config';
import { useState } from 'react';
import { Log } from '../types/sharedTypes';

type AppContextType = {
  primaryColor: string;
  setPrimaryColor: (arg0: string) => void;
  logs: Log[];
  addLog: (arg0: any) => void;
};

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppContext = createContext<AppContextType>({
  primaryColor: '',
  setPrimaryColor: () => {},
  logs: [],
  addLog: () => {},
});

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [primaryColor, setPrimaryColor] = useState<string>(
    Config.PRIMARY_COLOR || ''
  );
  const [logs, addLog] = useState([]);

  return (
    <AppContext.Provider
      value={{
        primaryColor,
        logs,
        setPrimaryColor,
        addLog,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
