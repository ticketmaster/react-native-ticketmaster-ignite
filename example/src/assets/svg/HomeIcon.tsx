import * as React from 'react'
import Svg, {SvgProps, Path} from 'react-native-svg'

const HomeIcon = (props: SvgProps) => (
  <Svg width={25} height={24} fill="none" {...props}>
    <Path
      fill={props.fill}
      fillRule="evenodd"
      d="m11.466 1.891-8.608 8.563a1.97 1.97 0 0 0-.04 2.755c.368.387.86.585 1.354.591v7.607a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V13.8a1.89 1.89 0 0 0 1.186-.439l.145-.135.018-.019a1.972 1.972 0 0 0-.04-2.752L12.877 1.89a1 1 0 0 0-1.41 0Zm-7.903 9.272L12.172 2.6l8.603 8.564a.972.972 0 0 1 .02 1.357l-.017.017a.896.896 0 0 1-1.268 0l-6.985-6.985a.5.5 0 0 0-.707 0l-7 7a.902.902 0 0 1-1.274-.033.971.971 0 0 1 .019-1.357Zm10.14 10.244H10.74v-6h2.964v6Zm5.469 0h-4.469v-6c0-.553-.632-1-1-1H10.74c-.369 0-.98.447-.98 1v6H5.172v-7.775l7-6.821 7 6.82v7.776Z"
      clipRule="evenodd"
    />
  </Svg>
)
export default HomeIcon
