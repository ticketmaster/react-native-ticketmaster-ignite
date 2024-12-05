import React, { useEffect, useRef, useState } from 'react';
import {
  PixelRatio,
  UIManager,
  findNodeHandle,
  LayoutChangeEvent,
  requireNativeComponent,
  useWindowDimensions,
  View,
  ViewStyle,
  StyleSheet,
  ViewProps,
} from 'react-native';

interface SecureEntryNativeProps extends ViewProps {
  token: string;
  style: { width: number; height: number };
}

interface SecureEntryAndroidProps {
  token: string;
  style?: ViewStyle;
}

const createFragment = (viewId: number | null) =>
  UIManager.dispatchViewManagerCommand(
    viewId,
    (UIManager as any).SecureEntryViewManager.Commands.create.toString(),
    [viewId]
  );

const SecureEntryViewManager = requireNativeComponent<SecureEntryNativeProps>(
  'SecureEntryViewManager'
);

export const SecureEntryAndroid = ({
  token,
  style,
}: SecureEntryAndroidProps) => {
  const ref = useRef(null);
  const intialWidth = useWindowDimensions().width;
  const initialHeight = useWindowDimensions().height;
  const [mounted, setMounted] = useState(false);
  const [layout, setLayout] = useState({
    width: PixelRatio.getPixelSizeForLayoutSize(intialWidth),
    height: PixelRatio.getPixelSizeForLayoutSize(initialHeight),
  });

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setLayout({
      width: PixelRatio.getPixelSizeForLayoutSize(width),
      height: PixelRatio.getPixelSizeForLayoutSize(height),
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
      <SecureEntryViewManager
        token={token}
        style={{ ...layout }}
        ref={ref}
        testID={'SecureEntryAndroid'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});
