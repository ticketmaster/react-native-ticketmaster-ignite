import React, { useEffect, useRef, useState } from 'react';
import {
  LayoutChangeEvent,
  PixelRatio,
  StyleSheet,
  UIManager,
  View,
  ViewProps,
  ViewStyle,
  findNodeHandle,
  requireNativeComponent,
} from 'react-native';

interface TicketsViewManagerProps extends ViewProps {
  style: {
    width: number;
    height: number;
  };
  offsetTop?: number;
}

type TicketsSdkEmbeddedAndroidProps = {
  style?: ViewStyle;
  offsetTopProp?: number;
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
  offsetTopProp,
}: TicketsSdkEmbeddedAndroidProps) => {
  const ref = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [layout, setLayout] = useState({ width: 0, height: 0 });
  const [offsetTop, setOffsetTop] = useState<number>(0);

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setLayout({
      width: PixelRatio.getPixelSizeForLayoutSize(width),
      height: PixelRatio.getPixelSizeForLayoutSize(height),
    });
    offsetTopProp &&
      setOffsetTop(PixelRatio.getPixelSizeForLayoutSize(offsetTopProp));
    setMounted(true);
  };

  useEffect(() => {
    if (!mounted) return;
    const viewId = findNodeHandle(ref.current);
    if (viewId) {
      createFragment(viewId);
    }
  }, [mounted]);

  return (
    <View onLayout={onLayout} style={style || styles.container}>
      {mounted && (
        <TicketsViewManager style={layout} offsetTop={offsetTop} ref={ref} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});
