import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  circle: {
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center'
  },
  loader: {
    position: 'absolute',
    top: 0
  }
});

function CircleProgress({ percent, color, bgcolor, radius }) {
  let degree = `${percent * 3.6}deg`;
  let color2 = color;
  if (percent >= 50) {
    color2 = bgcolor;
    degree = `${(percent - 50) * 3.6}deg`;
  }
  return (
    <View
      style={[styles.circle, {
        width: radius * 2,
        height: radius * 2,
        borderRadius: radius,
        backgroundColor: bgcolor
      }]}
    >
      <View
        style={[styles.loader, {
          left: 0,
          width: radius,
          height: radius * 2,
          backgroundColor: color,
          borderTopLeftRadius: radius,
          borderBottomLeftRadius: radius
        }]}
      />
      <View
        style={[styles.loader, {
          left: radius,
          width: radius,
          height: radius * 2,
          backgroundColor: color2,
          borderTopRightRadius: radius,
          borderBottomRightRadius: radius,
          transform: [{
            translateX: -radius / 2
          }, {
            rotate: degree
          }, {
            translateX: radius / 2
          }]
        }]}
      />
    </View>
  );
}
CircleProgress.propTypes = {
  color: PropTypes.string,
  bgcolor: PropTypes.string,
  radius: PropTypes.number.isRequired,
  percent: PropTypes.number.isRequired
};
CircleProgress.defaultProps = {
  color: '#3c80f7',
  bgcolor: '#e3e3e3'
};

export default CircleProgress;
