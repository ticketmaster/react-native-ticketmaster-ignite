import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

const ChevronLeft = (props: SvgProps) => {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" {...props}>
      <Path
        fill={props.color}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.7394 20.5303L16.8 19.4697L9.33035 12L16.8 4.53033L15.7394 3.46967L7.20909 12L15.7394 20.5303Z"
      />
    </Svg>
  );
};
export default ChevronLeft;
