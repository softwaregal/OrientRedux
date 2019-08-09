/**
 * @component   : SplashScreen
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Monday Jan 07, 2019 12:34:41 IST
 * @description : SplashScreen
 */

import React, {Component}  from 'react'
import PropTypes from 'prop-types'
import { StyleSheet,
  Text,
  View,
  Image,
  PixelRatio,
  FlatList,
  TouchableHighlight,
  Platform,
  Linking, Dimensions
} from 'react-native';
import { connect } from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import Dialog from "react-native-dialog";

import PrimaryButton from '../components/PrimaryButton';
import { Colors, Fonts, FontSize } from '../res';
import { showErrorMessage } from '../actions/MessageActions';
import { headingStyles, regularTextStyles } from '../res/Styles';
import ImageButton from '../components/ImageButton';
import { isUsersLoading, getUserProfile } from '../selectors/UserSelector';
import { removeUser } from '../actions/UserActions';
import { fetchAppVersion, resetAppVersion } from '../actions/helpActions';
import { getAppVersion } from '../selectors/helpSelector';
import NotifService from '../screens/app/notification/NotifService'
import { AsyncStorage, BackHandler } from "react-native"
import ScreenName from '../ScreenName';
import { isTruthy } from '../utils';
import Toast from 'react-native-simple-toast';
import { fetchNotificationCount } from '../actions/NotificationActions';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').width;
const USER_NOTIFICATION_TOKEN = '@OrientConnect:USER_NOTIFICATION_TOKEN';

class SplashScreen extends Component {
  static propTypes = {
  }

  static defaultProps = {
  }


  constructor(props) {
    super(props);

    this.state = {
      promptVisible: false,
      pushToken: null,
    };
    this.link= "https://play.google.com/store/apps/details?id=com.orient.orientconnect";
    this.iOSLink = "https://itunes.apple.com/in/app/orient-connect/id1359015910?mt=8";
    this.enableVersionCheck = true;

    AsyncStorage.getItem(USER_NOTIFICATION_TOKEN)
    .then(token => {
      if(token){
        let parsedToken = JSON.parse(token);

        if(parsedToken.token){
          return;
        }
      }

       new NotifService(
        // (optional) Called when Token is generated (iOS and Android)
        async (token) => {
            this.setState({promptVisible: false, pushToken : token});
            await AsyncStorage.setItem(USER_NOTIFICATION_TOKEN, JSON.stringify(token));
            console.log(JSON.stringify(token));

        },

        // (required) Called when a remote or local notification is opened or received
        (notification) => {

            // required on iOS only (see fetchCompletionHandler docs: https://facebook.github.io/react-native/docs/pushnotificationios.html)
            if(Platform.OS === 'ios')
            {
              console.log('In IOS ======================== 2222222222');
              notification.finish(PushNotificationIOS.FetchResult);
            }
        }
       );
    })

  }

  componentDidMount()
  {
    if (this.enableVersionCheck)
    {
      this.props.fetchAppVersion();
    } else
    {
      AsyncStorage.getItem(USER_NOTIFICATION_TOKEN)
    .then(token =>
      {
        if(token)
        {
          let parsedToken = JSON.parse(token);
          if(parsedToken.token)
          {
             this._switchToApp();
          }
        }
      })
    }

    this.props.fetchNotificationCount();
  }

  _switchToApp = () => {
    setTimeout(() => {
      if (this.props.isLoading === false) {
        if (this.props.profile && isTruthy(this.props.profile.IsTNCAccept)) {
          this.props.navigation.navigate(ScreenName.Navigator.APP);
        } else {
          this.props.removeUser();
          this.props.navigation.navigate(ScreenName.Navigator.AUTH);
        }
      }
    }, 3000);
  }

  componentDidUpdate(prevProps, previousState) {
    if (this.props.version !== prevProps.version) {
      if (this.props.version) {
        if(this.props.version !== DeviceInfo.getVersion()) {
          this.setState({ promptVisible: true });
        } else {
          this._switchToApp();
        }
      }
    }

    if (this.state.pushToken !== previousState.pushToken) {
      if (this.state.pushToken) {
        this._switchToApp();
      }
    }
  }

  handleClick(link) {
    if(Platform.OS === 'android'){
      Linking.canOpenURL(link).then(supported => {
        supported && Linking.openURL(link);
      }, (err) => console.log(err));
    }
    else{
      Linking.canOpenURL("itms://play.google.com/store/apps/details?id=com.orient.orientconnect").then(supported => {
        supported && Linking.openURL("itms://play.google.com/store/apps/details?id=com.orient.orientconnect");
      }, (err) => console.log(err));
    }
  }



  render() {
    const message = 'New Update of the application is available. You can only proceed if you update the app. Please press go to update the app.';

    return (
      <View style={{ flex: 1}}>
        <Dialog.Container visible={this.state.promptVisible}>
          <Dialog.Title>Update Required</Dialog.Title>
          <Dialog.Description>{ message }</Dialog.Description>


          <View style={{ flexDirection: 'row' }}>
          <View style={{flex: 1}}>
                <PrimaryButton
            basic
                  title="CANCEL"
                  color={Colors.PRIMARY_TEXT}
            textStyle={{ color: Colors.SECONDARY_TEXT }}
                  onPress={() => {this.setState({ promptVisible: false}); BackHandler.exitApp(); this.props.resetAppVersion()}}
                />
          </View>
          <View style={{flex: 1}}>
                <PrimaryButton
            basic
                  title="Go"
                  color={Colors.COLORPRIMARY}
                  onPress={() => {
                  this.handleClick(this.link)
                  this.setState({promptVisible: false }) ; BackHandler.exitApp() ; this.props.resetAppVersion()
                  }}
                />
          </View>
          </View>

        </Dialog.Container>

         <Image source={{uri: 'splash'}} style={{flex: 1, width: Dimensions.get('window').width, height: Dimensions.get('window').height, resizeMode: 'stretch'}} />
      </View>
      )
  }
}



const mapStateToProps = (state) => {
  const profile = getUserProfile(state);
  const isLoading = isUsersLoading(state);
  const version = getAppVersion(state);
  return { profile, isLoading, version };
};

const mapDispatchToProps = { removeUser, fetchAppVersion, fetchNotificationCount,resetAppVersion };

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);
