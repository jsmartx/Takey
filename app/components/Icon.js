import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';

const FONT_FAMILY = 'iconfont';
const fontsMap = {
  scan: 0xE638,
  nodata: 0xE985,
  trash: 0xE6B4
};
const IconNamePropType = PropTypes.oneOf(Object.keys(fontsMap));

export default class Icon extends PureComponent {
  static propTypes = {
    allowFontScaling: PropTypes.bool,
    name: IconNamePropType.isRequired,
    size: PropTypes.number,
    color: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    children: PropTypes.node,
    style: PropTypes.any
  };

  static defaultProps = {
    color: '#333',
    size: 12,
    allowFontScaling: false,
    children: null,
    style: null
  };

  render() {
    const { name, size, color, style, children, ...props } = this.props;

    let char = name ? fontsMap[name] || '?' : '';
    if (typeof char === 'number') {
      char = String.fromCharCode(char);
    }

    const styleDefaults = {
      fontSize: size,
      color,
    };
    const styleOverrides = {
      fontFamily: FONT_FAMILY,
      fontWeight: 'normal',
      fontStyle: 'normal',
    };

    props.style = [styleDefaults, style, styleOverrides];

    return (
      <Text {...props}>
        {char}
        {children}
      </Text>
    );
  }
}
