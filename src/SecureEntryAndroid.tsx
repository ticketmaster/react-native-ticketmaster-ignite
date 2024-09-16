import React, { useEffect, useRef } from 'react';
import { requireNativeComponent, useWindowDimensions } from 'react-native';
import { PixelRatio, UIManager, findNodeHandle } from 'react-native';

interface SecureEntryNativeProps {
  token: string;
  style: {};
}

interface SecureEntryViewProps {
  token: string;
}

const createFragment = (viewId: number | null) =>
  UIManager.dispatchViewManagerCommand(
    viewId,
    // we are calling the 'create' command
    (UIManager as any).SecureEntryViewManager.Commands.create.toString(),
    [viewId]
  );

const SecureEntryViewManager = requireNativeComponent<SecureEntryNativeProps>(
  'SecureEntryViewManager'
);

export const SecureEntryAndroid: React.FC<SecureEntryViewProps> = (props) => {
  const ref = useRef(null);
  const height = useWindowDimensions().height;
  const width = useWindowDimensions().width;
  const token = props.token.toString();

  useEffect(() => {
    const viewId = findNodeHandle(ref.current);
    createFragment(viewId);
  }, []);

  return (
    <SecureEntryViewManager
      token={token}
      style={{
        // converts dpi to px, provide desired height
        height: PixelRatio.getPixelSizeForLayoutSize(height),
        // converts dpi to px, provide desired width
        width: PixelRatio.getPixelSizeForLayoutSize(width),
      }}
      ref={ref}
    />
  );
};
