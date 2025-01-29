import React, { useEffect, useRef, useState } from 'react';
import {
  LayoutRectangle,
  PixelRatio,
  UIManager,
  findNodeHandle,
  LayoutChangeEvent,
  requireNativeComponent,
  View,
  ViewStyle,
  StyleSheet,
  ViewProps,
} from 'react-native';

interface SecureEntryNativeProps extends ViewProps {
  token: string;
  style: { width: number; height: number };
  layout?: LayoutRectangle;
}

type SecureEntryAndroidProps = {
  token: string;
  style?: ViewStyle;
  layoutProp?: LayoutRectangle;
};

const SecureEntryViewManager = requireNativeComponent<SecureEntryNativeProps>(
  'SecureEntryViewManager'
);

const createFragment = (viewId: number) => {
  const viewManagerConfig = UIManager.getViewManagerConfig(
    'SecureEntryViewManager'
  );
  const commandId = viewManagerConfig?.Commands?.create;

  if (commandId != null) {
    UIManager.dispatchViewManagerCommand(viewId, commandId, [viewId]);
  }
};

export const SecureEntryAndroid = ({
  token,
  style,
  layoutProp,
}: SecureEntryAndroidProps) => {
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
        <SecureEntryViewManager
          token={token}
          style={layout}
          layout={fullLayout}
          ref={ref}
          testID={'SecureEntryAndroid'}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});
