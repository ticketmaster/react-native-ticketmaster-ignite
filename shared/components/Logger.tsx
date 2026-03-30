import React, { useCallback, useContext, useEffect, useState } from 'react';
import { AppContext } from '../contexts/AppContext';
import { useIgnite } from 'react-native-ticketmaster-ignite';

const Logger = (): React.ReactElement => {
  const {
    authState: { isConfigured },
  } = useIgnite();
  const { addLog } = useContext(AppContext);
  const [recentLogs, setRecentLogs] = useState<Record<string, any>[]>([]);
  const [updateLogs, setUpdateLogs] = useState(false);

  useEffect(() => {
    if (updateLogs) {
      addLog((prevData: []) => [...prevData, ...recentLogs]);
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
    console.log = function (...args: any[]) {
      // Stringify objects for consistent display across RN versions
      const stringifiedArgs = args.map((arg) =>
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      );
      const message = stringifiedArgs.join(' ');

      if (isConfigured) {
        // Defer state update to avoid "Cannot update a component while rendering
        // a different component" error when console.log is called during render
        queueMicrotask(() => {
          setRecentLogs((prevData) => [
            ...prevData,
            {
              type: 'log',
              message,
              timestamp: new Date(Date.now()).toLocaleTimeString(),
            },
          ]);
        });
      }
      // Pass stringified args to console for consistent debugger output
      originalConsoleLog.apply(console, stringifiedArgs);
    };
  }, [isConfigured]);

  useEffect(() => {
    setupLogger();
  }, [setupLogger]);

  return <></>;
};

export default Logger;
