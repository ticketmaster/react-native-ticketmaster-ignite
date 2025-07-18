import React, { useCallback, useContext, useEffect, useState } from 'react';
import { AppContext } from '../contexts/AppProvider';
import { useIgnite } from 'react-native-ticketmaster-ignite';

const Logger = () => {
  const {
    authState: { isConfigured },
  } = useIgnite();
  const { addLog } = useContext(AppContext);
  const [recentLogs, setRecentLogs] = useState<Record<string, any>[]>([]);
  const [updateLogs, setUpdateLogs] = useState(false);

  useEffect(() => {
    if (updateLogs) {
      setTimeout(() => {
        addLog((prevData: []) => [...prevData, ...recentLogs]);
      }, 1000);
      setRecentLogs([]);
      setUpdateLogs(false);
    }
  }, [addLog, recentLogs, updateLogs]);

  useEffect(() => {
    if (!updateLogs) {
      setTimeout(() => setUpdateLogs(true), 1000);
    }
  }, [updateLogs]);

  const setupLogger = useCallback(() => {
    const originalConsoleLog = console.log;
    console.log = function (message) {
      isConfigured &&
        setRecentLogs((prevData) => [
          ...prevData,
          {
            type: 'log',
            message: JSON.stringify(message),
            timestamp: new Date(Date.now()).toLocaleTimeString(),
          },
        ]);
      // @ts-ignore
      originalConsoleLog.apply(console, arguments);
    };
  }, [isConfigured]);

  useEffect(() => {
    setupLogger();
  }, [setupLogger]);

  return <></>;
};

export default Logger;
