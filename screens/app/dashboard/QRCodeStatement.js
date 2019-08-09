/**
 * @component   : QRCodeStatement
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Friday Jan 11, 2019 17:21:05 IST
 * @description : QRCodeStatement
 */

import React, {Component}  from 'react'
import PropTypes from 'prop-types'
import { View, Button, Text, FlatList, StyleSheet, ScrollView } from 'react-native';
import { Card } from 'native-base';
import { headingStyles, regularTextStyles } from '../../../res/Styles';
import Colors from '../../../res/Colors';
import {Fonts} from '../../../res/Fonts';
import { connect } from 'react-redux';

import QRCodeHistoryList from '../../../components/QRCodeHistoryList';
import PrimaryButton from '../../../components/PrimaryButton';
import DatePicker from '../../../components/DatePicker';

import { getQRCodeStatement } from '../../../selectors/QRCodeSelector';
import { getUserProfile } from '../../../selectors/UserSelector';
import { getAction } from '../../../selectors/ApiSelector';
import { Table, TableWrapper, Row } from 'react-native-table-component';

import {
  fetchQRCodeStatement,
  clearScannedQRCode,
  QRCodeActionsType
} from '../../../actions/QRCodeActions';

import { getShortMonthName, getYear, toDateString } from '../../../utils';

import { showErrorMessage } from '../../../actions/MessageActions';

import ScreenName from './ScreenName';


class QRCodeStatement extends Component {
  static propTypes = {
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);

    this.state = {
      fromDate: null,
      toDate: null,
      tableHead: ['Year', 'Month' ,'Product Deals In', 'Valid Codes', 'Earned Points', 'Settled  Points', 'Rewards Transferred', 'Remarks'],
      widthArr: [100, 100, 100, 100, 100, 100, 100, 100]
    };
  }

  componentWillUnmount() {
    this.props.clearScannedQRCode(QRCodeActionsType.GET_SCANNED_QR_CODE_STATEMENT);
  }

  onViewStatement = () => {
    if (!this.state.fromDate || !this.state.toDate) {
      this.props.showErrorMessage('Please select date range');
      return;
    }
    if (this.state.fromDate > this.state.toDate) {
      this.props.showErrorMessage('To date can not be earlier than from date');
      return;
    }
    this.props.fetchQRCodeStatement(
      this.props.profile.RegisteredMobileNo,toDateString(this.state.fromDate),
      toDateString(this.state.toDate)
    );
  }

  render() {

const state = this.state;
    let stateData = this.props.statement;
    
    const tableData = [];
    if(stateData)
    {
      for (let i = 0; i < stateData.length; i++) {
        if(this.props.navigation.getParam("BUName") && stateData[i].BUName != this.props.navigation.getParam("BUName"))
        {
          continue;
        }
        const rowData = [];
        rowData.push(stateData[i].Year);
        rowData.push(stateData[i].Month);
        rowData.push(stateData[i].BUName);
        rowData.push(stateData[i].ValidCodes);
        rowData.push(stateData[i].EarnedPoints);
        rowData.push(stateData[i].SettledPoints);
        rowData.push(stateData[i].RewardTransferred);
        rowData.push(stateData[i].Remarks);
        console.log("row data is : " + stateData[i].Remarks);
        tableData.push(rowData);
      }  
    }
    
    const showDate = this.props.navigation.getParam('BUName') ? false : true;

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
            )

        }

        {
          showDate && (
              <PrimaryButton title='View Statement' onPress={this.onViewStatement} />
            )
        }
          
          

          { 
            (this.props.statement && this.props.statement.length > 0) ?
            (

              <View style={styles.container}>
        <ScrollView horizontal={true}>
          <View>
            <Table borderStyle={{borderColor: '#727272'}}>
              <Row data={state.tableHead} widthArr={state.widthArr} style={styles.header} textStyle={styles.text}/>
            </Table>
            <ScrollView style={styles.dataWrapper}>
              <Table borderStyle={{borderColor: '#727272'}}>
                {
                  tableData.map((rowData, index) => (
                    <Row
                      key={index}
                      data={rowData}
                      widthArr={state.widthArr}
                      style={[styles.row, index%2 && {backgroundColor: '#F7F6E7'}]}
                      textStyle={styles.text}
                    />
                  ))
                }
              </Table>
            </ScrollView>
          </View>
        </ScrollView>
      </View>

            ) :

            (<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={regularTextStyles.medium}>No statement data to show</Text>
            </View>)
          }

        </View>

      )
 }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  header: { height: 50, backgroundColor: '#C1C0B9' },
  text: { flexDirection: "column", flex: 1, textAlign: 'center', fontWeight: '100', fontFamily: Fonts.OPENSANS_SEMIBOLD },
  dataWrapper: { marginTop: -1 },
  row: { flexDirection: "row", flex: 1, backgroundColor: '#E7E6E1' }
});

const mapStateToProps = state => {
  const profile = getUserProfile(state);
  const statement = getQRCodeStatement(state);
  const action = getAction(state);
  return { profile, statement, action };
}

const mapDispatchToProps = {
  fetchQRCodeStatement,
  clearScannedQRCode,
  showErrorMessage
};

export default connect(mapStateToProps, mapDispatchToProps)(QRCodeStatement);

