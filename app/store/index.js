import yax from 'yax';
import { AsyncStorage } from 'react-native';
import { persistStore, persistReducer } from 'redux-persist';
import totp from './totp';

const config = {
  key: 'root',
  storage: AsyncStorage
};
const persistEnhancer = createStore => (reducer, preloadedState, enhancer) => {
  const appReducer = persistReducer(config, reducer);
  return createStore(appReducer, preloadedState, enhancer);
};
const store = yax({
  modules: {
    totp
  }
}, persistEnhancer);

persistStore(store);

export default store;
