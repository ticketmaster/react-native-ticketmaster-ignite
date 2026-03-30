import React, { useState } from 'react';
import Config from 'react-native-config';
import { AppContext } from '@shared/contexts/AppContext';

interface AppProviderProps {
  children: React.ReactNode;
}

export { AppContext };

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
