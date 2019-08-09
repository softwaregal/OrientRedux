/**
 * @component   : Dashboard
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Wednesday Jan 16, 2019 10:04:46 IST
 * @description : Dashboard
 */

import React, {Component}  from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';

import Home from './Home';
import BankDetailComponent from '../bank/BankDetailComponent';
import ScreenName from './ScreenName';
import { isSalesExecutive } from '../../../utils';
import { getUserProfile, getUserPrivilegeMap } from '../../../selectors/UserSelector';
import { ModuleName } from '../../../constants';

class Dashboard extends Component {
  static propTypes = {
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.props.navigation.setParams({
      title: `Hi ${this.props.profile.RetailerName}`,
      showNotification: this.props.privilegeMap ? this.props.privilegeMap[ModuleName.NOTIFICATION] : false,
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.privilegeMap !== prevProps.privilegeMap) {
      this.props.navigation.setParams({
        showNotification: this.props.privilegeMap ? this.props.privilegeMap[ModuleName.NOTIFICATION] : false,
      });
    }
  }

  render() {
    const { profile } = this.props;
    if (!profile) {
      return null;
    }

    if (isSalesExecutive(profile)) {
      return <Home navigation={this.props.navigation} salesExecutiveHome={true} />
    } else {
      return <Home navigation={this.props.navigation} />
    }
  }
}

const mapStateToProps = (state) => {
  const profile = getUserProfile(state);
  const privilegeMap = getUserPrivilegeMap(state);
  return { profile, privilegeMap };
}

export default connect(mapStateToProps)(Dashboard);
