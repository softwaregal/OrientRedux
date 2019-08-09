/**
 * @component   : Home
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Monday Dec 31, 2018 16:28:31 IST
 * @description : TermsAndCondition
 */

import React, {Component}  from 'react'
import { StyleSheet, Text, View, Image, ScrollView, FlatList } from 'react-native';
import { Card, Container } from 'native-base';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { WebView } from 'react-native-webview';

import PrimaryButton from '../../components/PrimaryButton';
import ScreenName from '../../ScreenName';
import { getUserProfile } from '../../selectors/UserSelector';
import { isTruthy } from '../../utils';
import { getTermsAndConditions } from '../../selectors/SignUpSelector';
import {
  fetchTermsAndConditions,
  acceptTNC,
} from '../../actions/AuthorizationActions';
import {
  removeUser,
} from '../../actions/UserActions';

class TermsAndCondition extends Component {
  static propTypes = {
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);

    this.state = {
      termsAndConditionsAccepted: false,
    };
  }

  componentDidMount () {
    this.props.fetchTermsAndConditions();
  }

  componentDidUpdate(prevProps) {
    if (this.props.profile && this.props.profile !== prevProps.profile) {
      if (isTruthy(this.props.profile.IsTNCAccept)) {
        this.props.navigation.navigate(ScreenName.Navigator.APP);
      }
    }
  }

  componentWillUnmount() {
    if (this.props.profile && !isTruthy(this.props.profile.IsTNCAccept)) {
      this.props.removeUser();
    }
  }

  _acceptTNC = () => {
    const { profile } = this.props;
    if (!profile) {
      return;
    }
    this.props.acceptTNC(profile.RegisteredMobileNo);
  }
  _declineTNC = () => {
    this.props.navigation.pop();
  }

  render() {
    const { profile } = this.props;
    if (!profile || isTruthy(profile.IsTNCAccept)) {
      return null;
    }
    return (
      <View style={{ flex: 1, padding: 16  }}>
        <View style={{ flexGrow: 1, overflow: 'hidden' }}>
          
        <WebView source={{ html: this.props.termsAndConditionsHtml }} />
          
        </View>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1}} >
            <PrimaryButton
              title='DECLINE'
              basic
              onPress={this._declineTNC}
            />
          </View>
          <View style={{ flex: 1}} >
            <PrimaryButton
              basic
              title='ACCEPT'
              onPress={this._acceptTNC}
            />
          </View>
        </View>
      </View>
      )
  }
}

const mapStateToProps = (state) => {
  const profile = getUserProfile(state);
  const termsAndConditionsHtml = getTermsAndConditions(state);
  return { profile, termsAndConditionsHtml };
};

const mapDispatchToProps = { fetchTermsAndConditions, acceptTNC, removeUser };

export default connect(mapStateToProps, mapDispatchToProps)(TermsAndCondition);
