import React, { useState } from 'react';
import { AppContext } from '@shared/contexts/AppContext';

interface AppProviderProps {
  children: React.ReactNode;
}

export { AppContext };

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [primaryColor, setPrimaryColor] = useState<string>(
    `#${process.env.EXPO_PUBLIC_PRIMARY_COLOR}` || ''
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
