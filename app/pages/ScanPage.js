import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { RNCamera } from 'react-native-camera';
import parse from 'url-parse';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row'
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  rectWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  rect: {
    height: 250,
    width: 250,
    borderWidth: 0.5,
    borderColor: '#2db7f5',
    backgroundColor: 'transparent'
  },
  corner: {
    width: 20,
    height: 20,
    position: 'absolute',
    borderColor: '#2db7f5',
    backgroundColor: 'transparent'
  },
  lt: {
    left: 0,
    top: 0,
    borderLeftWidth: 3,
    borderTopWidth: 3
  },
  rt: {
    right: 0,
    top: 0,
    borderRightWidth: 3,
    borderTopWidth: 3
  },
  lb: {
    left: 0,
    bottom: 0,
    borderLeftWidth: 3,
    borderBottomWidth: 3
  },
  rb: {
    right: 0,
    bottom: 0,
    borderRightWidth: 3,
    borderBottomWidth: 3
  }
});

class ScanPage extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    navigation: PropTypes.any.isRequired
  };
  barCodeRead = ({ data }) => {
    if (!this.flag) return;
    this.flag = false;

    const { dispatch, navigation } = this.props;
    const { protocol, host, pathname, query } = parse(data, true);
    const { secret } = query;

    if (protocol === 'otpauth:' && host === 'totp' && secret) {
      const name = pathname.replace(/^\//, '');
      dispatch({
        type: 'totp/add',
        payload: { name, secret }
      });
      navigation.goBack();
    } else {
      this.flag = true;
    }
  };
  render() {
    this.flag = true;
    return (
      <View style={styles.container}>
        <RNCamera
          style={styles.camera}
          onBarCodeRead={this.barCodeRead}
          captureAudio={false}
        >
          <View style={styles.rectWrap}>
            <View style={styles.rect}>
              <View style={[styles.corner, styles.lt]} />
              <View style={[styles.corner, styles.rt]} />
              <View style={[styles.corner, styles.lb]} />
              <View style={[styles.corner, styles.rb]} />
            </View>
          </View>
        </RNCamera>
      </View>
    );
  }
}

export default connect()(ScanPage);
