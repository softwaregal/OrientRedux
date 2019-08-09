/**
 * @component   : AboutUs
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Tuesday Jan 15, 2019 13:07:58 IST
 * @description : AboutUs
 */

import React, {Component}  from 'react'
import PropTypes from 'prop-types'
import { View, Text } from 'react-native';
import { Card } from 'native-base';
import { headingStyles, regularTextStyles } from '../../res/Styles';
import { connect } from 'react-redux';

import PrimaryButton from '../../components/PrimaryButton';
import TextInput from '../../components/TextInput';

import { getUserProfile, getUserPrivilegeMap } from '../../selectors/UserSelector';
import { showErrorMessage } from '../../actions/MessageActions';
import { removeUser } from '../../actions/UserActions';
import { changePassword } from '../../actions/AuthorizationActions';
import ScreenName from '../../ScreenName';
import { ModuleName } from '../../constants';
import { getNotificationsCount } from '../../selectors/NotificationSelector';

class ChangePassword extends Component {
  static propTypes = {
  }

  static defaultProps = {
  }

  constructor (props) {
    super(props);
    this.state = {
      oldPassword: '',
      newPassword: '',
      newConfirmPassword: '',
      waitingForResponse: false,
    };
    this.props.navigation.setParams({
      showNotification: this.props.privilegeMap ? this.props.privilegeMap[ModuleName.NOTIFICATION] : false,
    });

    this.didBlur = false;
      this.didBlurSubscription = this.props.navigation.addListener(
      'didBlur',
      payload => {
        this.didBlur = true;
        }
      );

      this.didFocusSubscription = this.props.navigation.addListener(
        'didFocus',
        payload => {
          this.didBlur = false;
          this.props.navigation.setParams({'notificationCount' : this.props.notificationCount})
        }
      );
  }

  _changePassword = () => {
    const { oldPassword, newPassword, newConfirmPassword } = this.state;

    if (!oldPassword) {
      this.props.showErrorMessage('Please enter your old password');
      return;
    }
    if (!newPassword) {
      this.props.showErrorMessage('Please enter new password');
      return;
    }
    if (newPassword === oldPassword) {
      this.props.showErrorMessage('Old and new password cannot be same');
      return;
    }
    if (newPassword !== newConfirmPassword) {
      this.props.showErrorMessage('New password and confirm password do not match');
      return;
    }

    this.props.changePassword(this.props.profile.RegisteredMobileNo, oldPassword, newPassword);
    this.setState({ waitingForResponse: true });
  }

  componentWillUnmount() {
    this.setState({ oldPassword: '', newPassword: '', newConfirmPassword: '' });
    this.didFocusSubscription.remove();
    this.didBlurSubscription.remove();
  }
  componentDidUpdate(prevProps) {
    if (this.props.profile !== prevProps.profile) {
      this.setState({ waitingForResponse: false });
      if (!this.props.profile) {
        this.props.navigation.navigate(ScreenName.Navigator.AUTH);
      }
    }
    if (this.props.privilegeMap !== prevProps.privilegeMap) {
      this.props.navigation.setParams({
        showNotification: this.props.privilegeMap ? this.props.privilegeMap[ModuleName.NOTIFICATION] : false,
      });
    }
  }

  render() {
    if (!this.props.profile) {
      return null;
    }
    return (
      <View style={{ flex: 1, padding: 8 }}>
        <Card>
          <View style={{ margin: 8 }}>
            <View style={{ alignItems: 'center', padding: 16 }}>
              <Text style={{...headingStyles.small, textAlign: 'center' }}>
                Changing password regularly helps, secure your account!
              </Text>
            </View>
            <TextInput
              placeholder='Old Password'
              secureTextEntry
              value={this.state.oldPassword}
              onChangeText={text => this.setState({ oldPassword: text })}
            />
            <TextInput
              placeholder='New Password'
              secureTextEntry
              value={this.state.newPassword}
              onChangeText={text => this.setState({ newPassword: text })}
            />
            <TextInput
              placeholder='Confirm Password'
              secureTextEntry
              value={this.state.newConfirmPassword}
              onChangeText={text => this.setState({ newConfirmPassword: text })}
            />
            <PrimaryButton title='Change Password' onPress={this._changePassword} />
          </View>
        </Card>
      </View>
      )
}
}

const mapStateToProps = state => {
  const profile = getUserProfile(state);
  const privilegeMap = getUserPrivilegeMap(state);
  const notificationCount = getNotificationsCount(state);
  return { profile, privilegeMap, notificationCount };
}

const mapDispatchToProps = { showErrorMessage, changePassword };

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
