import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  AppState,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Clipboard
} from 'react-native';
import { connect } from 'react-redux';
import Swipeout from 'react-native-swipeout';
import Icon from '../components/Icon';
import CircleProgress from '../components/CircleProgress';

const styles = StyleSheet.create({
  headerBtn: {
    marginRight: 16
  },
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  containerItem: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fcfcfc',
    padding: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1
  },
  itemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: {
    color: '#3c80f7',
    fontSize: 40
  },
  user: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    marginLeft: 5
  },
  time: {
    color: '#666',
    fontSize: 14,
    marginTop: 5
  },
  icon: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  noData: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100,
    backgroundColor: '#eeeeec'
  },
  scanBtn: {
    backgroundColor: '#007fff',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 4,
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center'
  },
  scanText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 16,
    marginLeft: 8
  },
  listView: {
    backgroundColor: '#eeeeec'
  }
});

const second = () => (new Date()).getUTCSeconds() % 30;
class HomePage extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerRight: (
      <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.push('Scan')}>
        <Icon name="scan" size={24} color="#fff" />
      </TouchableOpacity>
    )
  });
  static propTypes = {
    navigation: PropTypes.any.isRequired,
    dispatch: PropTypes.func.isRequired,
    list: PropTypes.array
  };
  static defaultProps = {
    list: []
  };
  appStateChange = (status) => {
    if (status === 'active') {
      this.updateOTP();
    }
  };
  gotoScan = () => {
    const { navigation } = this.props;
    navigation.push('Scan');
  };
  constructor(props) {
    super(props);
    this.state = {
      time: second()
    };
  }
  updateOTP() {
    this.props.dispatch({
      type: 'totp/update'
    });
  }
  componentDidMount() {
    this.timer = setInterval(() => {
      const time = second();
      this.setState((prev) => {
        if (prev.time > time) {
          this.updateOTP();
        }
        return { time };
      });
    }, 500);
    // init update otp list
    this.updateOTP();
    AppState.addEventListener('change', this.appStateChange);
  }
  componentWillUnmount() {
    AppState.removeEventListener('change', this.appStateChange);
    clearInterval(this.timer);
  }
  deleteItem(item) {
    this.props.dispatch({
      type: 'totp/delete',
      payload: item
    });
  }
  render() {
    const { time } = this.state;
    const { list } = this.props;
    const copy = (text) => {
      Clipboard.setString(text);
      Alert.alert('Tips', `Have copied to clipboard: ${text}`);
    };
    const TrashIcon = () => (
      <View style={styles.icon}>
        <Icon name="trash" size={30} color="#fff" />
      </View>
    );
    const renderItem = ({ item }) => {
      const btns = [{
        component: <TrashIcon />,
        backgroundColor: 'red',
        onPress: () => this.deleteItem(item)
      }];
      return (
        <Swipeout right={btns} autoClose backgroundColor="transparent">
          <TouchableOpacity onPress={() => copy(item.otp)}>
            <View style={styles.containerItem}>
              <Text style={styles.title}>{item.otp}</Text>
              <View style={styles.itemContent}>
                <Text style={styles.user}>{item.name}</Text>
                <CircleProgress radius={8} percent={time / 30 * 100} />
              </View>
            </View>
          </TouchableOpacity>
        </Swipeout>
      );
    };
    const content = () => {
      if (!list.length) {
        return (
          <View style={styles.noData}>
            <Icon name="nodata" size={100} color="#999" />
            <Text style={{ fontSize: 18, color: '#999' }}>
              No authentication codes
            </Text>
            <TouchableOpacity
              onPress={this.gotoScan}
              style={styles.scanBtn}
            >
              <Icon name="scan" size={20} color="#fff" />
              <Text style={styles.scanText}>
                Scan Barcode
              </Text>
            </TouchableOpacity>
          </View>
        );
      }
      return (
        <FlatList
          data={list}
          extraData={time}
          renderItem={renderItem}
          style={styles.listView}
          keyExtractor={item => item.secret}
        />
      );
    };
    return (
      <View style={styles.container}>
        {content()}
      </View>
    );
  }
}

const mapState = ({ totp }) => ({
  list: totp.list
});
export default connect(mapState)(HomePage);
