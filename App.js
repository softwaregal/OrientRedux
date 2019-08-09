import React from 'react';
import { StyleSheet, Text, View, Alert, ProgressBarAndroid, ProgressViewIOS, Platform, Keyboard, AppState } from 'react-native';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import Dialog from "react-native-dialog";
import thunk from 'redux-thunk';
import Modal from 'react-native-modal';
import { Spinner } from 'native-base';
import Snackbar from 'react-native-snackbar';

import ScreenName from './ScreenName';
import AuthNavigator from './screens/auth/AuthNavigator';
import AppNavigator from './screens/app/AppNavigator';
import SplashScreen from './screens/SplashScreen';
import rootStore from './stores';
import { loadUser } from './actions/UserActions';
import { clearUserMessage, showMessage } from './actions/MessageActions';
import { getUserMessage, isRequestPending, getTaskInProgress } from './selectors/ApiSelector';
import { fetchNotificationCount } from './actions/NotificationActions';
import { getNotificationsCount } from './selectors/NotificationSelector';
import { Colors } from './res';

const screens = {};
screens[ScreenName.Navigator.AUTH] = { screen: AuthNavigator };
screens[ScreenName.Navigator.APP] = { screen: AppNavigator };
screens[ScreenName.Navigator.SPLASH] = { screen: SplashScreen };

const navigators = createSwitchNavigator(screens, {
  initialRouteName: ScreenName.Navigator.SPLASH,
});

const AppContainer = createAppContainer(navigators);

const store = createStore(
  rootStore,
  applyMiddleware(thunk)
);

store.dispatch(loadUser());

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userMessage: null,
      busy: false,
      task: null,
      messageVisible: false,
      appState: AppState.currentState,
    };
    store.subscribe(() => {
      const state = store.getState();
      const busy = isRequestPending(state);
      this.setState({ busy, task: getTaskInProgress(state) });
      const newMessage = getUserMessage(state);
      const { userMessage } = this.state;
      
      if (newMessage && !busy) {
        setTimeout(() => {
          Keyboard.dismiss();
          Snackbar.show({
            title: newMessage.message,
            duration: Snackbar.LENGTH_LONG,
          });
          store.dispatch(clearUserMessage());
        }, 1200);
      }
    });
  }


  /*componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }
  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }*/

  
   _handleAppStateChange = (nextAppState) => {
    if (this.state.appState !== nextAppState &&
      nextAppState === 'active') {
      store.dispatch(fetchNotificationCount());
    }
    store.dispatch(showMessage(`${this.state.appState} ${nextAppState}`));
    this.setState({appState: nextAppState});
  }



  render() {
    return (
      <Provider store={store}>
        <AppContainer />
        <Modal isVisible={this.state.busy} animationIn='fadeIn' animationOut='fadeOut'>
          <View style={{ justifyContent: 'center', padding: 30 }}>
            <Spinner color={Colors.COLORPRIMARY} />
          </View>
        </Modal>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
