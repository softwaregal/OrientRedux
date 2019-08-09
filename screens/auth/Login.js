/**
 * @component   : Login
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Monday Jan 07, 2019 16:31:07 IST
 * @description : Login
 */

import React, {Component}  from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text, TouchableHighlight, Platform, Button } from 'react-native';
import { connect } from 'react-redux';
import Dialog from "react-native-dialog";
import { Card, Row, Col } from 'native-base';
import { KeyboardAvoidingView, ScrollView } from 'react-native';

import TextInput from '../../components/TextInput';
import OrientLogo from '../../components/OrientLogo';
import PrimaryButton from '../../components/PrimaryButton';
import Modal from '../../components/Modal';
import { headingStyles, linkStyles } from '../../res/Styles';
import Colors from '../../res/Colors';

import ScreenName from '../../ScreenName';
import { getUserProfile } from '../../selectors/UserSelector';
import { login, forgotPassword } from '../../actions/AuthorizationActions';
import { isTruthy } from '../../utils';
import { showErrorMessage } from '../../actions/MessageActions';
import { AsyncStorage } from "react-native";

const USER_NOTIFICATION_TOKEN = '@OrientConnect:USER_NOTIFICATION_TOKEN';

class Login extends Component {
  static propTypes = {
  }

  static defaultProps = {
  }

  constructor (props) {
    super(props);

    // 8375805690
    // 930018
    this.state = {
      mobileno: '',
      password: '',
      forgotPasswordVisible: false,
    };
  }

  _login = () => {
    console.log("Login 1");
    if (!this.state.mobileno
     || !this.state.mobileno.trim().length
     || !this.state.password
     || !this.state.password.trim().length) {
      this.props.showErrorMessage('Please enter mobile number and password');
      return;
    }
console.log("Login 2");
    AsyncStorage.getItem(USER_NOTIFICATION_TOKEN)
    .then(token => {
      console.log("Login 3 " + token);
      if(token){
        let parsedToken = JSON.parse(token);
console.log("Login 3 " + parsedToken.token);
        if(parsedToken.token){
this.props.login({ mobileno: this.state.mobileno, password: this.state.password, deviceId: parsedToken.token, osType: Platform.OS.toUpperCase() });
        }
        else
        {
          console.log("Nothing Happended");
        }
      }
    })
  }

  render() {
    const { mobileno, password } = this.state;
    const { profile } = this.props;
    if (profile) {
      if (isTruthy(profile.IsTNCAccept)) {
        this.props.navigation.navigate(ScreenName.Navigator.APP);
      } else {
        this.props.navigation.push(ScreenName.Auth.AUTH_TNC);
      }
      return null;
    }
    return (
      <ScrollView style={{ flex: 1 , padding: 8}}>
          <KeyboardAvoidingView behavior="padding" enabled>
        <Card>
          <View style={{ marginRight: 8, marginLeft: 8}}>

          <View style={ {alignItems: 'center', margin: 8 } }>
            <OrientLogo size='large' />
            <Text style={headingStyles.large}>Welcome to Orient Connect</Text>
            <Text style={headingStyles.small}>Please provide details to get you started</Text>
          </View>

            <TextInput
              keyboardType='numeric'
              style={{ marginTop: 8, marginRight: 8, marginLeft: 8}}
              mode='outlined'
              label='Enter Mobile No.'
              value={mobileno}
              onChangeText={text => this.setState({ mobileno: text })}
            />

            <TextInput
             style={{ marginTop: 8, marginBottom: 16, marginRight: 8, marginLeft: 8}}
              mode='outlined'
              secureTextEntry
              label='Enter Password'
              value={password}
              onChangeText={text => this.setState({ password: text })}
            />

          <PrimaryButton
            title='Login'
            onPress={this._login}
          />

        <View style={{ flex: 1, alignItems: 'center' }}>
          <TouchableHighlight onPress={() => this.setState({ forgotPasswordVisible: true })}>
            <Text style={{...linkStyles.link, alignSelf: 'center', marginTop: 20, marginBottom: 16 }}>Forgot Password?</Text>
          </TouchableHighlight>
        </View>

        </View>

        </Card>
          </KeyboardAvoidingView>

        <Dialog.Container visible={this.state.forgotPasswordVisible}>
          <Dialog.Title>Forgot password?</Dialog.Title>
          <TextInput
            placeholder='Enter Mobile No.'
            value={this.state.mobileno}
            onChangeText={text => this.setState({ mobileno: text })}
          />
	  <View style={{ flexDirection: 'row' }}>
	  <View style={{flex: 1}}>
          <PrimaryButton
	    basic
            title="CANCEL"
            color={Colors.PRIMARY_TEXT}
	    textStyle={{ color: Colors.SECONDARY_TEXT }}
            onPress={() => this.setState({ forgotPasswordVisible: false })}
          />
	  </View>
	  <View style={{flex: 1}}>
          <PrimaryButton
	    basic
            title="SUBMIT"
            color={Colors.COLORPRIMARY}
            onPress={() => {
            this.props.forgotPassword(this.state.mobileno);
            this.setState({ mobileno: '', forgotPasswordVisible: false, password: '' })
            }}
            disabled={!this.state.mobileno}
          />
	  </View>
	  </View>
        </Dialog.Container>
      </ScrollView>
    );
  }
}

const mapStateToProps = (state) => {
  const profile = getUserProfile(state);
  return { profile };
}

const mapDispatchToProps = {
  login,
  forgotPassword,
  showErrorMessage
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
