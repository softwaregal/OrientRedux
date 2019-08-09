/**
 * @component   : QRCodeHistory
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Friday Jan 11, 2019 17:21:05 IST
 * @description : QRCodeHistory
 */

import React, {Component}  from 'react'
import PropTypes from 'prop-types'
import { View, Button, Text } from 'react-native';
import { connect } from 'react-redux';

import QRCodeHistoryList from '../../../components/QRCodeHistoryList';
import PrimaryButton from '../../../components/PrimaryButton';
import DatePicker from '../../../components/DatePicker';
import { StatusSummaryType } from './StatusSummary';
import Colors from '../../../res/Colors';

import { getQRCodeStatus } from '../../../selectors/QRCodeSelector';
import { getUserProfile } from '../../../selectors/UserSelector';
import {
  fetchQRCodeStatus,
  clearScannedQRCode,
  fetchQRCodeDatewiseStatus,
  fetchQRCodeStatusForBU,
  QRCodeActionsType
} from '../../../actions/QRCodeActions';
import { toDateString } from '../../../utils';
import { showMessage, showErrorMessage } from '../../../actions/MessageActions';
import ScreenName from './ScreenName';
import {Fonts} from '../../../res/Fonts';

class QRCodeHistory extends Component {
  static propTypes = {
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);

    this.state = {
      fromDate: null,
      toDate: null,
    };
  }

  componentWillUnmount() {
    this.props.clearScannedQRCode(QRCodeActionsType.GET_SCANNED_QR_CODE_STATUS);
  }

  onItemPress = (data) => {
    const showDate = this.props.navigation.getParam('BUName') ? false : true;
    if (showDate) {
      this.props.fetchQRCodeDatewiseStatus(this.props.profile.RegisteredMobileNo, data.DATE);
      this.props.navigation.push(ScreenName.DASHBOARD_QRCODE_HISTORY_DATEWISE);
    } else {
      this.props.fetchQRCodeStatusForBU(this.props.profile.RegisteredMobileNo, this.props.navigation.getParam('BUName'), [data.DATE]);
      this.props.navigation.push(ScreenName.DASHBOARD_QRCODE_HISTORY_TIMEWISE, {'BUName' : this.props.navigation.getParam('BUName'), 'showPoints' : this.props.navigation.getParam('showPoints'), 'title' : this.props.navigation.getParam('title')});      
    }
  }

  onCheckStatus = () => {
    if (!this.state.fromDate || !this.state.toDate) {
      this.props.showErrorMessage('Please select date range');
      return;
    }
    if (this.state.fromDate > this.state.toDate) {
      this.props.showErrorMessage('To date can not be earlier than from date');
      return;
    }
    this.props.fetchQRCodeStatus(
      this.props.profile.RegisteredMobileNo,
      toDateString(this.state.fromDate),
      toDateString(this.state.toDate)
    );
  }

  render() {
    const showDate = this.props.navigation.getParam('BUName') ? false : true;
    const statusSummaryType = this.props.navigation.getParam('statusSummaryType');
    let valueFieldName = 'TotalCouponCode';
    let valueFieldLabel = 'TOTAL SCAN';
    let title = `Total ${this.props.navigation.getParam('BUName')} scanned`;

    if (statusSummaryType === StatusSummaryType.TOTAL_POINTS) {
      valueFieldName = 'TotalPoints';
      valueFieldLabel = 'TOTAL POINT';      
      title = `Total ${this.props.navigation.getParam('BUName')} points`;
    }

    let filtered = { };
    if (showDate && this.props.history) {
      this.props.history.forEach(obj => {
        const val = typeof obj.TotalCouponCode === 'string' ? parseInt(obj.TotalCouponCode) : obj.TotalCouponCode;
        if (filtered[obj.DATE]) {
          filtered[obj.DATE] = filtered[obj.DATE] + val;
        } else {
          filtered[obj.DATE] = val;
        }
      });
    }
    if (showDate) {
      filtered = Object.keys(filtered).map(date => ({ DATE: date, TotalCouponCode: filtered[date] }));
    } else {
      filtered = this.props.history;
    }

    return (
      <View style={{ flex: 1, padding: 8 }}>
      {
        showDate && (
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1, alignItems: 'center', textAlignVertical: 'top' }}>
            <DatePicker
              defaultDate={this.state.fromDate}
              placeHolderText='From*'
              onDateChange={ date => this.setState({ fromDate: date }) }
              maximumDate={new Date()}
            />
          </View>
          <View style={{ marginLeft: 8, flex: 1, alignItems: 'center', textAlignVertical: 'top'}}>
            <DatePicker
              defaultDate={this.state.toDate}
              placeHolderText='To*'
              onDateChange={ date => this.setState({ toDate: date }) }
              maximumDate={new Date()}
            />
          </View>
        </View>
        )}
      {
        showDate && (
        <PrimaryButton
         title='Check Status' onPress={this.onCheckStatus} />
      )}
        {
          !showDate &&
          (
            <View style={{ flexDirection: 'row',marginLeft:12, marginRight:12, marginBottom:12, justifyContent: 'center', padding: 20, backgroundColor: Colors.COLORPRIMARY }}>
              <Text style={{ fontSize: 16, textAlign: 'center', color: 'white', fontFamily: Fonts.OPENSANS_SEMIBOLD}}>
                {`${title} : ${this.props.navigation.getParam('totalCount')}`}
              </Text>
            </View>
          )
        }
        <QRCodeHistoryList
        style={ {marginLeft:12, marginRight:12, marginBottom:12} }
          data={filtered}
          mode='date'
          valueFieldLabel={valueFieldLabel}
          valueFieldName={valueFieldName}
          emptyListPlaceholder='No status data to show'
          onItemPress={this.onItemPress} />
      </View>
    )
  }
}

const mapStateToProps = state => {
  const profile = getUserProfile(state);
  const history = getQRCodeStatus(state);
  return { profile, history };
}

const mapDispatchToProps = {
  fetchQRCodeStatus,
  clearScannedQRCode,
  fetchQRCodeDatewiseStatus,
  fetchQRCodeStatusForBU,
  showErrorMessage
};

export default connect(mapStateToProps, mapDispatchToProps)(QRCodeHistory);
