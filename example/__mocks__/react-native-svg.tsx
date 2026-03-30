import React from 'react';
import { View } from 'react-native';

const Svg = ({ children, ...props }: any) => <View {...props}>{children}</View>;
const Path = (props: any) => <View {...props} />;
const Circle = (props: any) => <View {...props} />;
const Rect = (props: any) => <View {...props} />;
const G = ({ children, ...props }: any) => <View {...props}>{children}</View>;

export { Svg as default, Path, Circle, Rect, G };
export type SvgProps = any;
