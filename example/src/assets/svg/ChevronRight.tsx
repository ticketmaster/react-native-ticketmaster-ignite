import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

const ChevronRight = (props: SvgProps) => (
  <Svg width={28} height={28} fill="#C6C6C6" viewBox="0 0 20 20" {...props}>
    <Path
      fill="#C6C6C6"
      fillRule="nonzero"
      d="M12.22 6.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06L16.19 10l-3.97-3.97Z"
    />
  </Svg>
);
export default ChevronRight;
