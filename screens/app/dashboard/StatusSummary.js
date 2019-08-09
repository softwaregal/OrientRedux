/**
 * @component   : StatusSummary
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Wednesday May 22, 2019 17:21:05 IST
 * @description : StatusSummary
 */

import React, {Component}  from 'react'
import PropTypes from 'prop-types'
import { View, Button, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Table, TableWrapper, Row, Rows } from 'react-native-table-component';

import {
 getQRCodeStatus,
 getQRCodeStatement,
 getQRCodePreScanDetails,
} from '../../../selectors/QRCodeSelector';
import { getUserProfile } from '../../../selectors/UserSelector';
import {
  fetchQRCodeStatus,
  clearScannedQRCode,
  fetchQRCodeDatewiseStatus,
  fetchQRCodeStatusForBU,
  fetchQRCodeStatement,
  fetchRetailerPreScanDetail,
  QRCodeActionsType
} from '../../../actions/QRCodeActions';
import { toDateString, getShortMonthName, getYear } from '../../../utils';
import { showMessage, showErrorMessage } from '../../../actions/MessageActions';
import TouchableItem from '../../../components/TouchableItem';
import PrimaryButton from '../../../components/PrimaryButton';
import ScreenName from './ScreenName';

import Colors from '../../../res/Colors';
import {Fonts} from '../../../res/Fonts';

export const StatusSummaryType = {
  TOTAL_COUPON_CODES: 'TOTAL_COUPON_CODES',
  TOTAL_POINTS: 'TOTAL_POINTS',
  TOTAL_REWARDS: 'TOTAL_REWARDS',
  TOTAL_PRE_SCAN: 'TOTAL_PRE_SCAN',
};

class StatusSummary extends Component {
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
          if (this.didBlur) {
            this.didBlur = false;
            this.fetchSummaryData();
          }
        }
      );
  }

  fetchSummaryData = () => {
    const statusSummaryType = this.props.navigation.getParam('statusSummaryType');
    if (statusSummaryType === StatusSummaryType.TOTAL_REWARDS) {
      this.props.fetchQRCodeStatement(
        this.props.profile.RegisteredMobileNo,
        '01-Jan-2000', toDateString(new Date()),
      );
    } else if (statusSummaryType === StatusSummaryType.TOTAL_PRE_SCAN) {
      this.props.fetchRetailerPreScanDetail(this.props.profile.RegisteredMobileNo);
    } else {
      this.props.fetchQRCodeStatus(this.props.profile.RegisteredMobileNo, '01-Jan-2000', toDateString(new Date()));
    }
  }

  componentDidMount() {
    this.fetchSummaryData();
  } 
  componentWillUnmount() {
    this.props.clearScannedQRCode(QRCodeActionsType.GET_SCANNED_QR_CODE_STATUS);
    if (this.didBlurSubscription) {
      this.didBlurSubscription.remove();
    }
    if (this.didFocusSubscription) {
      this.didFocusSubscription.remove();
    }
  }

  onItemPress = (BUName, totalCount) => {
    this.props.clearScannedQRCode(QRCodeActionsType.GET_SCANNED_QR_CODE_STATUS);
    this.props.fetchQRCodeStatus(this.props.profile.RegisteredMobileNo, '01-Jan-2000', toDateString(new Date()), BUName);
    const statusSummaryType = this.props.navigation.getParam('statusSummaryType');

    if (statusSummaryType === StatusSummaryType.TOTAL_REWARDS) {
      this.props.navigation.push(ScreenName.DASHBOARD_QRCODE_STATEMENT, {
        BUName,
        title: this.props.navigation.getParam('title'),
        statusSummaryType,
        totalCount,
      });
    } else if (statusSummaryType === StatusSummaryType.TOTAL_PRE_SCAN) {
      this.props.navigation.push(ScreenName.DASHBOARD_QRCODE_PRE_SCAN_SUMMARY, {
        BUName,
        title: BUName,
      });
    } else {
      this.props.navigation.push(ScreenName.DASHBOARD_QRCODE_HISTORY, {
        BUName,
        title: this.props.navigation.getParam('title'),
        statusSummaryType,
        totalCount,
        showPoints: this.props.navigation.getParam('showPoints')
      });
    }
  }

  render() {
    const statusSummaryType = this.props.navigation.getParam('statusSummaryType');
    if (statusSummaryType === StatusSummaryType.TOTAL_REWARDS && !this.props.qrCodeStatement) {
      return null;
    } else if ((statusSummaryType === StatusSummaryType.TOTAL_COUPON_CODES
      || statusSummaryType === StatusSummaryType.TOTAL_POINTS) && !this.props.qrCodeStatus) {
      return null;
    } else if (statusSummaryType === StatusSummaryType.TOTAL_PRE_SCAN && !this.props.qrPreScanDetails){
      return null;
    }

    const CellItem = (props) => {
      const { onPress, value } = props;
      return (
        <TouchableItem onPress={onPress} >
          <Text style={styles.text}>{value}</Text>
        </TouchableItem>
        );
    };
    const tableData = [];
    const tableHead = ['Product', this.props.navigation.getParam('title')];
    const totalCount = {};

    let fetchValue = '';
    let data = null;
    if (statusSummaryType === StatusSummaryType.TOTAL_COUPON_CODES) {
      fetchValue = data => data.TotalCouponCode;
      data = this.props.qrCodeStatus;
    } else if (statusSummaryType === StatusSummaryType.TOTAL_POINTS) {
      fetchValue = data => data.TotalPoints;
      data = this.props.qrCodeStatus;
    } else if (statusSummaryType === StatusSummaryType.TOTAL_REWARDS) {
      fetchValue = data => data.RewardTransferred;
      data = this.props.qrCodeStatement;
    } else if (statusSummaryType == StatusSummaryType.TOTAL_PRE_SCAN) {
      fetchValue = () => 1;
      data = this.props.qrPreScanDetails
    }

    if (data) {
      data.forEach(status => {
        let value = fetchValue(status);
        if(typeof value === 'string')
        {
            value = parseInt(value);
        }
        if (totalCount[status.BUName]) {
          totalCount[status.BUName] = totalCount[status.BUName] + value;
        } else {
          totalCount[status.BUName] = value;
        }
      });
    }

    Object.keys(totalCount).forEach(key => {
      tableData.push([
        <CellItem value={key} onPress={() => this.onItemPress(key, totalCount[key])} />,
        <CellItem value={totalCount[key]} onPress={() => this.onItemPress(key, totalCount[key])} />
        ]);
    });
    return (
      <View style={{ flex: 1, padding: 8 }}>
        <Table borderStyle={{borderColor: '#727272'}}>
          <Row data={tableHead}  style={styles.head} textStyle={styles.headertext}/>
          <Rows data={tableData} 
          textStyle={styles.text}
          />
        </Table>
      </View>
    )
  }
}




const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#F26522' },
  headertext: { margin: 6, textAlign: 'center' , color: Colors.WHITE, fontWeight: '100', fontFamily: Fonts.OPENSANS_SEMIBOLD },
  text: { margin: 6, textAlign: 'center' , fontWeight: '100', fontFamily: Fonts.OPENSANS_SEMIBOLD },
  row: { flexDirection: "row", flex: 1, backgroundColor: '#E7E6E1' }
});

const mapStateToProps = state => {
  const profile = getUserProfile(state);
  const qrCodeStatus = getQRCodeStatus(state);
  const qrCodeStatement = getQRCodeStatement(state);
  const qrPreScanDetails = getQRCodePreScanDetails(state);
  return { profile, qrCodeStatus, qrCodeStatement, qrPreScanDetails };
}

const mapDispatchToProps = {
  fetchQRCodeStatus,
  fetchQRCodeStatusForBU,
  clearScannedQRCode,
  fetchQRCodeStatement,
  fetchRetailerPreScanDetail,
  showErrorMessage
};

export default connect(mapStateToProps, mapDispatchToProps)(StatusSummary);
