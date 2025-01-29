import React, { useEffect, useRef, useState } from 'react';
import {
  LayoutRectangle,
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
  layout?: LayoutRectangle;
}

type TicketsSdkEmbeddedAndroidProps = {
  style?: ViewStyle;
  layoutProp?: LayoutRectangle;
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
  layoutProp,
}: TicketsSdkEmbeddedAndroidProps) => {
  const ref = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [layout, setLayout] = useState({ width: 0, height: 0 });
  const [fullLayout, setFullLayout] = useState<LayoutRectangle>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setLayout({
      width: PixelRatio.getPixelSizeForLayoutSize(width),
      height: PixelRatio.getPixelSizeForLayoutSize(height),
    });
    layoutProp &&
      setFullLayout({
        x: PixelRatio.getPixelSizeForLayoutSize(layoutProp.x),
        y: PixelRatio.getPixelSizeForLayoutSize(layoutProp.y),
        width: PixelRatio.getPixelSizeForLayoutSize(layoutProp.width || width),
        height: PixelRatio.getPixelSizeForLayoutSize(
          layoutProp.height || height
        ),
      });
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
        <TicketsViewManager style={layout} layout={fullLayout} ref={ref} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});
