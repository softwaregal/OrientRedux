/**
 * @component   : ContactUs
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Tuesday Jan 15, 2019 10:25:53 IST
 * @description : ContactUs
 */

import React, {Component}  from 'react'
import PropTypes from 'prop-types'
import { View, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { Card } from 'native-base';
import { connect } from 'react-redux';

import PrimaryButton from '../../../components/PrimaryButton';

import { getContactUsHtml } from '../../../selectors/helpSelector';
import { fetchContactUs } from '../../../actions/helpActions';
import { showMessage } from '../../../actions/MessageActions';
import ScreenName from './ScreenName';
import { getUserProfile, getUserPrivilegeMap } from '../../../selectors/UserSelector';
import { ModuleName } from '../../../constants';
import { getNotificationsCount } from '../../../selectors/NotificationSelector';
class ContactUs extends Component {
  static propTypes = {
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.props.navigation.setParams({
      showNotification: this.props.privilegeMap ? this.props.privilegeMap[ModuleName.NOTIFICATION] : false,
    });

    
      this.didFocusSubscription = this.props.navigation.addListener(
        'didFocus',
        payload => {
          this.props.navigation.setParams({'notificationCount' : this.props.notificationCount})
        }
      );
  }

   componentWillUnmount () {
    this.didFocusSubscription.remove();
  }


  componentDidMount() {
    this.props.fetchContactUs();
  }

  componentDidUpdate(prevProps) {
    if (this.props.privilegeMap !== prevProps.privilegeMap) {
      this.props.navigation.setParams({
        showNotification: this.props.privilegeMap ? this.props.privilegeMap[ModuleName.NOTIFICATION] : false,
      });
    }
  }

  render() {
    return (
      <View style={{ flex: 1, padding: 16  }}>
        <View style={{ flexGrow: 1, overflow: 'hidden' }}>
          { this.props.contactUsHtml && <WebView source={{ html: this.props.contactUsHtml }} /> }
        </View>
        <PrimaryButton
          title='Query / Suggestions'
          onPress={() => this.props.navigation.push(this.props.navigation.getParam('complaintScreen'))}
        />
      </View>
    )
  }
}

const mapStateToProps = state => {
  const contactUsHtml = getContactUsHtml(state);
  const profile = getUserProfile(state);
  const privilegeMap = getUserPrivilegeMap(state);
  const notificationCount = getNotificationsCount(state);
  return { contactUsHtml, profile, privilegeMap, notificationCount };
}

const mapDispatchToProps = { fetchContactUs, showMessage }

export default connect(mapStateToProps, mapDispatchToProps)(ContactUs);
