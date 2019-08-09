/**
 * @component   : QRCodeHistoryDatewise
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Monday Jan 14, 2019 13:00:25 IST
 * @description : QRCodeHistoryDatewise
 */

import React, {Component}  from 'react'
import PropTypes from 'prop-types'
import { View } from 'react-native';
import { connect } from 'react-redux';

import QRCodeHistoryList from '../../../components/QRCodeHistoryList';

import { getQRCodeDatewiseStatus } from '../../../selectors/QRCodeSelector';
import { getUserProfile } from '../../../selectors/UserSelector';
import {
  clearScannedQRCode,
  fetchQRCodeTimewiseStatus,
  QRCodeActionsType
} from '../../../actions/QRCodeActions';
import ScreenName from './ScreenName';

class QRCodeHistoryDatewise extends Component {
  static propTypes = {
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
  }

  componentWillUnmount() {
    this.props.clearScannedQRCode(QRCodeActionsType.GET_SCANNED_QR_CODE_DATEWISE_STATUS);
  }

  onItemPress = (data) => {
    this.props.fetchQRCodeTimewiseStatus(this.props.profile.RegisteredMobileNo, data.Time);
    this.props.navigation.push(ScreenName.DASHBOARD_QRCODE_HISTORY_TIMEWISE);
  }

  render() {
    let filtered = { };
    if (this.props.history) {
      this.props.history.forEach(obj => {
        const val = typeof obj.TotalCouponCode === 'string' ? parseInt(obj.TotalCouponCode) : obj.TotalCouponCode;
        if (filtered[obj.Time]) {
          filtered[obj.Time] = filtered[obj.Time] + val;
        } else {
          filtered[obj.Time] = val;
        }
      });
    }

    filtered = Object.keys(filtered).map(date => ({ Time: date, TotalCouponCode: filtered[date] }));

    return (
      <View
      style={ {margin:12} }
      >
      <QRCodeHistoryList data={filtered} mode='time' onItemPress={this.onItemPress} />
      </View>
    )
  }
}

const mapStateToProps = state => {
  const profile = getUserProfile(state);
  const history = getQRCodeDatewiseStatus(state);
  return { profile, history };
}

const mapDispatchToProps = { fetchQRCodeTimewiseStatus, clearScannedQRCode };

export default connect(mapStateToProps, mapDispatchToProps)(QRCodeHistoryDatewise);
