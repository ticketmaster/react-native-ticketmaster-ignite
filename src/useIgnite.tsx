import { useContext } from 'react';
import { IgniteContext } from './IgniteProvider';

export const useIgnite = () => {
  return useContext(IgniteContext);
};
