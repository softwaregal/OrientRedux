/**
 * @component   : AuthHome
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Wednesday Jan 02, 2019 10:13:56 IST
 * @description : AuthHome
 */

import React, {Component}  from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, Text, View, Image, PixelRatio, FlatList, TouchableHighlight, Platform, PermissionsAndroid } from 'react-native';
import { H1, H2, List, ListItem, Left, Body, Card } from 'native-base';
import { connect } from 'react-redux';

import PrimaryButton from '../../components/PrimaryButton';
import ScreenName from '../../ScreenName';
import { Colors, Fonts, FontSize } from '../../res';
import { headingStyles, regularTextStyles } from '../../res/Styles';
import OrientLogo from '../../components/OrientLogo';
import { getUserProfile } from '../../selectors/UserSelector';
import { isRequestPending, getAction } from '../../selectors/ApiSelector';
import { getContactUsList } from '../../selectors/helpSelector';
import { fetchContactUs } from '../../actions/helpActions';
import { IconSize } from '../../res/Dimens';
import TouchableItem from '../../components/TouchableItem';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';

const Contact = (props) => {
  return (
    <TouchableItem
      onPress={props.onPress}
    >
      <View style={{ flex: 1, flexDirection: 'row', margin: 4, padding: 8, alignItems: 'center'}}>
        <Image source={{ uri: 'phone' }} style={{ width: IconSize.SMALL, height: IconSize.SMALL, marginRight: 16 }} />
        <Text style={{ ...regularTextStyles.small, fontWeight: 'bold' }}>{props.contactNumber}</Text>
      </View>
    </TouchableItem>
    );
}

class AuthHome extends Component {
  static propTypes = {
  }

  static defaultProps = {
  }

  static navigationOptions = ({ navigation }) => ({
    headerLeft: null,
  })

  componentDidMount() {
    console.log("Fetch Contact List1");
    this.props.fetchContactUs();
    console.log("Fetch Contact List2");
  }

componentWillUnmount(){
  
}

  async requestCallPermission(number) {
    var phoneNumber = number.replace("+91", '');
    if (Platform.OS === 'ios' || (Platform.OS === 'android' && Platform.Version < 23)) {
      RNImmediatePhoneCall.immediatePhoneCall(phoneNumber);
    }else{
      const status = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CALL_PHONE);
      if (status === PermissionsAndroid.RESULTS.GRANTED){
        RNImmediatePhoneCall.immediatePhoneCall(phoneNumber);
      }
    }
}

  render() {
    return (
      <View style={{ flex: 1 , padding: 8}}>
        <Card>
        <View style={{ margin: 8 }}>
          <OrientLogo size='large' />

          <PrimaryButton
            title='Existing Member Login'
            onPress={() => this.props.navigation.push(ScreenName.Auth.AUTH_LOGIN)} />
          <PrimaryButton
            title='New Member Sign Up'
            onPress={() => this.props.navigation.push(ScreenName.Auth.AUTH_INSTRUCTION)}
          />
          </View>
        </Card>

        <View style={{ flex: 1, alignSelf: 'center', margin: 8 }}>
          <Text style={{ ...headingStyles.large, alignSelf: 'center' }}>Contact Us</Text>
          
          <FlatList
            style={{ marginTop: 8 }}
            data={this.props.contactUsList}
            keyExtractor={(item, index) => `${index}`}
            renderItem={({ item }) => (<Contact contactNumber={item} 
            onPress={() => this.requestCallPermission(item)}
            />)}
          />

        </View>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  console.log("Fetch Contact List3");
  const contactUsList = getContactUsList(state);
  console.log("Fetch Contact List4 " + JSON.stringify(contactUsList));
  const action = getAction(state);
  return { contactUsList, action };
}

const mapDispatchToProps = { fetchContactUs };

export default connect(mapStateToProps, mapDispatchToProps)(AuthHome);
