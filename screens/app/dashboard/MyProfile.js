/**
 * @component   : MyProfile
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Thursday Jan 17, 2019 16:59:35 IST
 * @description : MyProfile
 */

import React, {Component}  from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { Text } from 'react-native';

import ProfileDetail from '../../auth/UserRegistration';

import { getUserProfile, getProfileDetail, getUserPrivilegeMap } from '../../../selectors/UserSelector';
import { fetchProfileDetail } from '../../../actions/AuthorizationActions';
import { ModuleName } from '../../../constants';
import { getNotificationsCount } from '../../../selectors/NotificationSelector';

class MyProfile extends Component {
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
    if (!this.props.profile) {
      return;
    }
    this.props.fetchProfileDetail(this.props.profile.RegisteredMobileNo);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.profile !== this.props.profile) {
      if (this.props.profile) {
        this.props.fetchProfileDetail(this.props.profile.RegisteredMobileNo);
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
      <ProfileDetail
        profileDetail={this.props.profileDetail}
        disabled
        RegisteredMobileNo={this.props.profile.RegisteredMobileNo}
      />
      )
  }
}

const mapStateToProps = state => {
  const profile = getUserProfile(state);
  const profileDetail = getProfileDetail(state);
  const privilegeMap = getUserPrivilegeMap(state);
  const notificationCount = getNotificationsCount(state);
  return { profile, profileDetail, privilegeMap, notificationCount };
}

const mapDispatchToProps = { fetchProfileDetail };

export default connect(mapStateToProps, mapDispatchToProps)(MyProfile);
