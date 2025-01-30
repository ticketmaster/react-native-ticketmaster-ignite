import React, { useEffect, useRef, useState } from 'react';
import {
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
  offsetTop?: number;
}

type SecureEntryAndroidProps = {
  token: string;
  style?: ViewStyle;
  offsetTopProp?: number;
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
  offsetTopProp,
}: SecureEntryAndroidProps) => {
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
        <SecureEntryViewManager
          token={token}
          style={layout}
          offsetTop={offsetTop}
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
