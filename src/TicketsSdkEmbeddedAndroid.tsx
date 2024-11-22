import React, { useEffect, useRef, useState } from 'react';
import {
  LayoutChangeEvent,
  PixelRatio,
  UIManager,
  View,
  ViewProps,
  ViewStyle,
  findNodeHandle,
  requireNativeComponent,
} from 'react-native';

interface TicketsViewManagerProps extends ViewProps {
  textProps: {
    width: number;
    height: number;
  };
}

type TicketsSdkEmbeddedAndroidProps = {
  style?: ViewStyle;
};

const TicketsViewManager =
  requireNativeComponent<TicketsViewManagerProps>('TicketsViewManager');

const createFragment = (viewId: number) => {
  const viewManagerConfig =
    UIManager.getViewManagerConfig('TicketsViewManager');
  const commandId = viewManagerConfig?.Commands?.create;

  if (commandId != null) {
    UIManager.dispatchViewManagerCommand(viewId, commandId, [viewId]);
  }
};

export const TicketsSdkEmbeddedAndroid = ({
  style,
}: TicketsSdkEmbeddedAndroidProps) => {
  const ref = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [layout, setLayout] = useState({ width: 0, height: 0 });

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setLayout({
      // converts dpi to px, provide desired height
      width: PixelRatio.getPixelSizeForLayoutSize(width),
      height: PixelRatio.getPixelSizeForLayoutSize(height),
    });
    setMounted(true);
  };

  const textProps = {
    ...layout,
  };

  useEffect(() => {
    if (!mounted) return;
    const viewId = findNodeHandle(ref.current);
    if (viewId) {
      createFragment(viewId);
    }
  }, [mounted]);

  return (
    <View onLayout={onLayout} style={style || { flex: 1 }}>
      {mounted && <TicketsViewManager textProps={textProps} ref={ref} />}
    </View>
  );
};
