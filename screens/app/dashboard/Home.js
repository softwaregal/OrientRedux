/**
 * @component   : Home
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Monday Dec 31, 2018 16:28:31 IST
 * @description : Home
 */

import React, {Component}  from 'react'
import { StyleSheet, Text, View, Image, ScrollView, FlatList, AppState, ImageBackground } from 'react-native';
import { Card, Container } from 'native-base';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { withNavigationFocus } from 'react-navigation';
import Dialog from "react-native-dialog";

import DashboardMenuButton from '../../../components/DashboardMenuButton';
import TouchableItem from '../../../components/TouchableItem';
import { StatusSummaryType } from './StatusSummary';
import ScreenName from './ScreenName';
import GiftingScreenName from '../gifting/ScreenName';
import { getUserProfile, getUserPrivilegeMap } from '../../../selectors/UserSelector';
import { isTruthy, isRetailer, isSalesExecutive } from '../../../utils';
import { ModuleName } from '../../../constants';
import Colors from '../../../res/Colors';
import { getNotificationsCount } from '../../../selectors/NotificationSelector';
import { fetchNotificationCount } from '../../../actions/NotificationActions';
import { clearUserMessage, showMessage } from '../../../actions/MessageActions';
import { getBankDetailStatus, getUserDashData } from '../../../selectors/SignUpSelector';
import { fetchBankDetailStatus, fetchUseDashData } from "../../../actions/AuthorizationActions";

import { headingStyles, regularTextStyles } from '../../../res/Styles';
import { Fonts } from '../../../res/Fonts';

import PrimaryButton from '../../../components/PrimaryButton';

class Home extends Component {
  static propTypes = {

  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);

    this.state = {
      options: [],
      isRetailerOrSales: false,
      isSales: false,
      retailerDemoHome: this.props.navigation.getParam('retailerDemoHome') ? true : false,
      appState: AppState.currentState,
      promptVisible: true,
    };


      this.didFocusSubscription = this.props.navigation.addListener(
        'didFocus',
        payload => {
          this.props.fetchNotificationCount();
          this.props.fetchUseDashData(this.props.profile.RegisteredMobileNo);
          this.props.navigation.setParams({'notificationCount' : this.props.notificationCount})
        }
      );
  }

  componentWillUnmount () {
    this.didFocusSubscription.remove();
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

_handleAppStateChange = (nextAppState) => {
    if (this.state.appState !== nextAppState &&
      nextAppState === 'active') {
      this.forceUpdate();
      this.props.fetchNotificationCount();

    }

    this.setState({appState: nextAppState});
  }

  optionsToDisplay = () => {
    if (!this.props.profile) {
      return [];
    }

    const filteredOptions = this.state.options.filter(option => (
      option.isVisible === null
      || option.isVisible === undefined
      || option.isVisible() == true)
    );

    if ((filteredOptions.length % 2) === 1) {
      filteredOptions.push({});
    }

    return filteredOptions;
  }

  _prepareMenu = () => {

    const { profile, privilegeMap } = this.props;
    if (!profile || !privilegeMap) {
      this.setState({ options: [] });
      return;
    }
    const showQrCode = () => isTruthy(this.props.profile.QRCode)
    const showBarCode = () => isTruthy(this.props.profile.BarCode)

    const options = [];
    const _addLabel = (icon, label, onPress, isVisible) => ({ icon, label, onPress, isVisible });

    if (this.props.salesExecutiveHome) {
      options.push(_addLabel(
        'demo',
        'Demo',
        () => this.props.navigation.navigate(ScreenName.DASHBOARD_RETAILER_DEMO_HOME),
        () => privilegeMap[ModuleName.DEMO]
      ));
      options.push(_addLabel(
        'sign',
        'Retailer Sign Up',
        () => this.props.navigation.navigate(ScreenName.DASHBOARD_RETAILER_SIGNUP),
        () => privilegeMap[ModuleName.RETAILER_SIGNUP]
      ));

    const giftingScreenName = isRetailer(this.props.profile) ?
      GiftingScreenName.GIFTING_HOME_RETAILER :
      GiftingScreenName.GIFTING_HOME;
    options.push(_addLabel(
      'gift',
      'Switchgear Gifting',
      () => this.props.navigation.navigate(giftingScreenName),
      () => privilegeMap[ModuleName.GIFTING_PAGE]
    ));
    }

    if (!this.props.salesExecutiveHome || this.state.retailerDemoHome) {
      options.push(_addLabel(
        'qrcode',
        'Scan QR Code',
        () => this.props.navigation.navigate(ScreenName.DASHBOARD_SCAN_QRCODE, { title : 'Scan QR Code', scanType: 'qrcode' }),
        () => showQrCode() && privilegeMap[ModuleName.SCAN_CODE]
      ));
      options.push(_addLabel(
        'status_qrcode',
        'Scan History',
        () => this.props.navigation.navigate(ScreenName.DASHBOARD_QRCODE_HISTORY, { title: 'Scan History', scanType: 'qrcode' }),
        () => showQrCode() && privilegeMap[ModuleName.SCAN_HISTORY]
      ));
      options.push(_addLabel(
        'statement_qrcode',
        'My Rewards Statement',
        () => this.props.navigation.navigate(ScreenName.DASHBOARD_QRCODE_STATEMENT, { title: 'My Rewards Statement', scanType: 'qrcode' }),
        () => showQrCode() && privilegeMap[ModuleName.ACCOUNT_STATEMENT]
      ));

      options.push(_addLabel(
        'barcode',
        'Scan Bar Code',
        () => this.props.navigation.navigate(ScreenName.DASHBOARD_SCAN_QRCODE, { title : 'Scan Bar Code', scanType: 'barcode' }),
        () => showBarCode() && privilegeMap[ModuleName.SCAN_CODE]
      ));
      options.push(_addLabel(
        'status_barcode',
        'Scan History',
        () => this.props.navigation.navigate(ScreenName.DASHBOARD_QRCODE_HISTORY, { title: 'Scan History', scanType: 'barcode' }),
        () => showBarCode() && privilegeMap[ModuleName.SCAN_HISTORY]
      ));
      options.push(_addLabel(
        'statement_barcode',
        'My Rewards Statement',
        () => this.props.navigation.navigate(ScreenName.DASHBOARD_QRCODE_STATEMENT, { title: 'My Rewards Statement', scanType: 'barcode' }),
        () => showBarCode() && privilegeMap[ModuleName.ACCOUNT_STATEMENT]
      ));

      options.push(_addLabel(
        'my_account',
        'My Profile',
        () => this.props.navigation.navigate(ScreenName.DASHBOARD_MY_PROFILE),
        () => privilegeMap[ModuleName.MY_PROFILE]
      ));
      options.push(_addLabel(
        'contact',
        'Contact Us',
        () => this.props.navigation.navigate(ScreenName.DASHBOARD_CONTACTUS),
        () => privilegeMap[ModuleName.CONTACT_US]
      ));
      options.push(_addLabel(
        'about',
        'About Us',
        () => this.props.navigation.navigate(ScreenName.DASHBOARD_ABOUTUS),
        () => privilegeMap[ModuleName.ABOUT_US]
      ));
  if(!this.state.retailerDemoHome){
    const giftingScreenName = isRetailer(this.props.profile) ?
      GiftingScreenName.GIFTING_HOME_RETAILER :
      GiftingScreenName.GIFTING_HOME;
    options.push(_addLabel(
      'gift',
      'Switchgear Gifting',
      () => this.props.navigation.navigate(giftingScreenName, {'isRetailer' : isRetailer(this.props.profile)}),
      () => privilegeMap[ModuleName.GIFTING_PAGE]
    ));
}

      const sweepstakeLabel = _addLabel(
        'sum',
        '',
        () => this.props.navigation.navigate(ScreenName.DASHBOARD_FREEDOM_FORTUNE),
        () => privilegeMap[ModuleName.SWEEPSTAKE_PAGE]
      );
      sweepstakeLabel.sweepstake = true;
      options.push(sweepstakeLabel);
    }


    this.setState({ options });
  }
  async componentDidMount () {
    this._prepareMenu();
    AppState.addEventListener('change', this._handleAppStateChange);
    if (isRetailer(this.props.profile) /*privilegeMap[ModuleName.BANK]*/) {
      /*this.props.fetchBankDetailStatus(this.props.profile.RegisteredMobileNo);*/
      this.props.fetchUseDashData(this.props.profile.RegisteredMobileNo);
    }

    if (isSalesExecutive(this.props.profile)) {
      this.props.fetchUseDashData(this.props.profile.RegisteredMobileNo);
    }


  }

  componentDidUpdate(prevProps) {
    if (this.props.profile === prevProps.profile
      && this.props.privilegeMap === prevProps.privilegeMap) {
      return;
    }
    this._prepareMenu();
  }

updateBankDetails = () => {
  this.setState({ promptVisible: false});
  this.props.navigation.navigate(ScreenName.DASHBOARD_BANK);
}

switchToTotalCouponCodeSummary = () => {
  this.props.navigation.push(ScreenName.DASHBOARD_STATUS_SUMMARY, {
    statusSummaryType: StatusSummaryType.TOTAL_COUPON_CODES,
    title: 'Total Scans'
  });
}

switchToTotalPointsSummary = () => {
  this.props.navigation.push(ScreenName.DASHBOARD_STATUS_SUMMARY, {
   statusSummaryType: StatusSummaryType.TOTAL_POINTS,
   title: 'Total Points', showPoints: true 
  });
}
switchToRewardSummary = () => {
  this.props.navigation.push(ScreenName.DASHBOARD_STATUS_SUMMARY, {
   statusSummaryType: StatusSummaryType.TOTAL_REWARDS,
   title: 'Settled Payout'
  });
}

switchToPreScanCodeSummary = () => {
  this.props.navigation.push(ScreenName.DASHBOARD_STATUS_SUMMARY, {
    statusSummaryType: StatusSummaryType.TOTAL_PRE_SCAN,
    title: 'Pre Scanned Code'
  });
}

  render() {
    const { profile, privilegeMap } = this.props;
    if (!profile || !privilegeMap) {
      return null;
    }
    return (
      <View style={{ flex: 1 }}>
        <Dialog.Container visible={!this.props.bankDetailStatus.status && this.state.promptVisible}>
          <Dialog.Title>Bank Detail</Dialog.Title>
          <Dialog.Description>{ this.props.bankDetailStatus.message }</Dialog.Description>

          <View style={{ flexDirection: 'row' }}>
            <View style={{flex: 1}}>
              <PrimaryButton
                basic
                title="CANCEL"
                color={Colors.PRIMARY_TEXT}
                textStyle={{ color: Colors.SECONDARY_TEXT }}
                onPress={() => this.setState({ promptVisible: false}) }
              />
            </View>
            <View style={{flex: 1}}>
              <PrimaryButton
                basic
                title="OK"
                color={Colors.COLORPRIMARY}
                onPress={this.updateBankDetails}
              />
            </View>
          </View>

        </Dialog.Container>

        {
          isRetailer(this.props.profile) && 

          (
              <View>

                <View style={{  borderRadius: 25, borderWidth : 2, borderColor: '#F26522',justifyContent: 'center', backgroundColor: Colors.COLORPRIMARYDARK, height : 50, marginTop : 10, marginLeft:10, marginRight:10}}>
              
              <TouchableItem onPress={this.switchToRewardSummary}>
              <View style={{ flexDirection: 'row',  alignItems: 'center'}}>
          
              
                <View style={{ flex: 1, alignItems: 'center'}}>
                  <Text style={{ ...headingStyles.medium, fontFamily: Fonts.OPENSANS_SEMIBOLD, fontSize: 16, color: Colors.WHITE  }}>Settled Payout</Text>
                </View>
             
          
                <View style={{ marginLeft: 8, flex: 1, alignItems: 'center'}}>
                  <Text style={{ ...headingStyles.medium, fontFamily: Fonts.OPENSANS_SEMIBOLD, fontSize: 18, color: Colors.WHITE }}>{this.props.getUserDashboardData.TotalPayout}</Text>
                </View>
          
              </View>
               </TouchableItem>
        
          </View>

        
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            
            <View style={{  borderRadius: 25, borderWidth : 2, borderColor: '#F26522', backgroundColor: Colors.COLORPRIMARYDARK, flex: 1, justifyContent: 'center', height : 50, marginTop : 10, marginLeft:10, marginRight:10}}>
                 
                 
                  <TouchableItem onPress={this.switchToTotalCouponCodeSummary}>
                 

                  <View style={{ flexDirection: 'column'}}>
                 
                      
                        <View style={{ alignItems: 'center'}}>
                          <Text style={{ ...headingStyles.medium, fontFamily: Fonts.OPENSANS_SEMIBOLD, fontSize: 16, color: Colors.WHITE  }}>Total Scan</Text>
                        </View>
                     
                
                      <View style={{ marginLeft: 8,  alignItems: 'center'}}>
                        <Text style={{ ...headingStyles.medium, fontFamily: Fonts.OPENSANS_SEMIBOLD, fontSize: 18, color: Colors.WHITE }}>{this.props.getUserDashboardData.TotalScannedCoupon}</Text>
                      </View>
                
                    </View>
                 
                  </TouchableItem>
                    
              </View>

              <View style={{ borderRadius: 25, borderWidth : 2, borderColor: '#F26522', backgroundColor: Colors.COLORPRIMARYDARK,flex: 1, justifyContent: 'center', height : 50, margin : 10}}>
              
                <TouchableItem onPress={this.switchToTotalPointsSummary}>
                    <View style={{ flexDirection: 'column' }}>
                
                      
                        <View style={{ alignItems: 'center'}}>
                          <Text style={{ ...headingStyles.medium, fontFamily: Fonts.OPENSANS_SEMIBOLD, fontSize: 16, color: Colors.WHITE  }}>Total Points</Text>
                        </View>
                      
                
                      <View style={{ marginLeft: 8,  alignItems: 'center'}}>
                        <Text style={{ ...headingStyles.medium, fontFamily: Fonts.OPENSANS_SEMIBOLD, fontSize: 18, color: Colors.WHITE }}>{this.props.getUserDashboardData.TotalEarnedPoints}</Text>
                      </View>
                
                    </View>
                  </TouchableItem>

              </View>

        </View>


         <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            
            <View style={{  borderRadius: 25, borderWidth : 2, borderColor: '#F26522', backgroundColor: Colors.COLORPRIMARYDARK,flex: 1, justifyContent: 'center', height : 50, marginLeft:10, marginRight:10}}>
           
             <TouchableItem onPress={this.switchToPreScanCodeSummary}>
            <View style={{ flexDirection: 'column'  }}>
          
               
                  <View style={{ alignItems: 'center'}}>
                    <Text style={{ ...headingStyles.medium, fontFamily: Fonts.OPENSANS_SEMIBOLD, fontSize: 16, color: Colors.WHITE   }}>Pre Scanned</Text>
                  </View>
                
          
                <View style={{ marginLeft: 8,  alignItems: 'center'}}>
                  <Text style={{ ...headingStyles.medium, fontFamily: Fonts.OPENSANS_SEMIBOLD, fontSize: 18, color: Colors.WHITE  }}>{this.props.getUserDashboardData.MissedScans}</Text>
                </View>
          
              </View>
            </TouchableItem>
           
              </View>

              <View style={{ borderRadius: 25, borderWidth : 2, borderColor: '#F26522', backgroundColor: Colors.COLORPRIMARYDARK,flex: 1, justifyContent: 'center', height : 50, marginLeft:10, marginRight:10}}>
              
              <View style={{ flexDirection: 'column'}}>
          
                <View style={{ alignItems: 'center'}}>
                  <Text style={{ ...headingStyles.medium, fontFamily: Fonts.OPENSANS_SEMIBOLD, fontSize: 16, color: Colors.WHITE, marginLeft:10, marginRight:10  }}>Last Scan Date</Text>
                </View>
          
                <View style={{ alignItems: 'center'}}>
                  <Text style={{ ...headingStyles.medium, fontFamily: Fonts.OPENSANS_SEMIBOLD, fontSize: 18, color: Colors.WHITE, marginLeft:10, marginRight:10 }}>{this.props.getUserDashboardData.LastScanDate}</Text>
                </View>
          
              </View>
              
              </View>

        </View>
  </View>

          )
        }

        {
          (this.state.retailerDemoHome)  && 
          (
              <View>

                <View style={{  backgroundColor: Colors.COLORPRIMARYDARK, borderRadius: 25, borderWidth: 2, borderColor: '#F26522', height : 50, marginTop : 10, marginLeft:10, marginRight:10}}>
        <TouchableItem onPress={this.switchToRewardSummary}>
              <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center'}}>
          
              
                <View style={{ flex: 1, alignItems: 'center'}}>
                  <Text style={{ ...headingStyles.medium, fontFamily: Fonts.OPENSANS_SEMIBOLD, fontSize: 16, color: Colors.WHITE  }}>Settled Payout</Text>
                </View>
             
          
                <View style={{ marginLeft: 8, flex: 1, alignItems: 'center'}}>
                  <Text style={{ ...headingStyles.medium, fontFamily: Fonts.OPENSANS_SEMIBOLD, fontSize: 18, color: Colors.WHITE }}>26 (June-2019)</Text>
                </View>
          
              </View>
         </TouchableItem>
          </View>

        
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            
            <View style={{  flex: 1, justifyContent: 'center', backgroundColor: Colors.COLORPRIMARYDARK, borderRadius: 25, borderWidth: 2, borderColor: '#F26522', height : 50, marginTop : 10, marginLeft:10, marginRight:10}}>
            <TouchableItem onPress={this.switchToTotalCouponCodeSummary}>
            <View style={{ flexDirection: 'column' }}>
          
                
                  <View style={{ alignItems: 'center'}}>
                    <Text style={{ ...headingStyles.medium, fontFamily: Fonts.OPENSANS_SEMIBOLD, fontSize: 16, color: Colors.WHITE  }}>Total Scan</Text>
                  </View>
                
          
                <View style={{ marginLeft: 8,  alignItems: 'center'}}>
                  <Text style={{ ...headingStyles.medium, fontFamily: Fonts.OPENSANS_SEMIBOLD, fontSize: 18, color: Colors.WHITE }}>30</Text>
                </View>
          
              </View>
              </TouchableItem>
              </View>

              <View style={{ flex: 1, justifyContent: 'center', backgroundColor: Colors.COLORPRIMARYDARK, borderRadius: 25, borderWidth: 2, borderColor: '#F26522', height : 50, margin : 10}}>
              
              <TouchableItem onPress={this.switchToTotalPointsSummary}>
              <View style={{ flexDirection: 'column' }}>
          
                
                  <View style={{ alignItems: 'center'}}>
                    <Text style={{ ...headingStyles.medium, fontFamily: Fonts.OPENSANS_SEMIBOLD, fontSize: 16, color: Colors.WHITE  }}>Total Points</Text>
                  </View>
                
          
                <View style={{ marginLeft: 8,  alignItems: 'center'}}>
                  <Text style={{ ...headingStyles.medium, fontFamily: Fonts.OPENSANS_SEMIBOLD, fontSize: 18, color: Colors.WHITE }}>30</Text>
                </View>
          
              </View>
              </TouchableItem>

              </View>

        </View>


         <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            
            <View style={{  flex: 1, justifyContent: 'center', backgroundColor: Colors.COLORPRIMARYDARK, borderRadius: 25, borderWidth: 2, borderColor: '#F26522', height : 50, marginLeft:10, marginRight:10}}>
            
<TouchableItem onPress={this.switchToPreScanCodeSummary}>
            <View style={{ flexDirection: 'column' }}>
          
                
                  <View style={{ alignItems: 'center'}}>
                    <Text style={{ ...headingStyles.medium, fontFamily: Fonts.OPENSANS_SEMIBOLD, fontSize: 16, color: Colors.WHITE  }}>Pre Scanned</Text>
                  </View>
                
          
                <View style={{ marginLeft: 8,  alignItems: 'center'}}>
                  <Text style={{ ...headingStyles.medium, fontFamily: Fonts.OPENSANS_SEMIBOLD, fontSize: 18, color: Colors.WHITE }}>10</Text>
                </View>
          
              </View>
              </TouchableItem>
              
              </View>

              <View style={{ flex: 1, justifyContent: 'center', backgroundColor: Colors.COLORPRIMARYDARK, borderRadius: 25, borderWidth: 2, borderColor: '#F26522', height : 50, marginLeft:10, marginRight:10}}>
              <View style={{ flexDirection: 'column' }}>
          
                <View style={{ alignItems: 'center'}}>
                  <Text style={{ ...headingStyles.medium, fontFamily: Fonts.OPENSANS_SEMIBOLD, fontSize: 16, color: Colors.WHITE, marginLeft:10, marginRight:10  }}>Last Scan Date</Text>
                </View>
          
                <View style={{ alignItems: 'center'}}>
                  <Text style={{ ...headingStyles.medium, fontFamily: Fonts.OPENSANS_SEMIBOLD, fontSize: 18, color: Colors.WHITE, marginLeft:10, marginRight:10 }}>15-June-2019</Text>
                </View>
          
              </View>
              </View>

        </View>
  </View>
          )
        }

        

        <FlatList
          data={this.optionsToDisplay()}
          numColumns={2}
          keyExtractor={(code, index) => `${index}`}
          renderItem={({ item }) => (
          <DashboardMenuButton
            source={{ uri: item.icon }}
            label={item.label}
            onPress={item.onPress}
            circular={!item.sweepstake}
            tintColor={!item.sweepstake ? Colors.WHITE : null}
            padding={item.sweepstake ? 0 : 24}
          />
          )}
        />
      </View>
      )
  }
}

const styles = StyleSheet.create
({

  container: 
  {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  
  border:
  {
    flex: 1,
    margin: 10,
    padding: 8,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#F26522',
  },

  row: 
  {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },

  box: {
    flex: 1,
  },
  box2: {
  },
  box3: {
  },
  two: {
    flex: 2
  }

});

const mapStateToProps = (state) => {
  const profile = getUserProfile(state);
  const privilegeMap = getUserPrivilegeMap(state);
  const notificationCount = getNotificationsCount(state);
  const bankDetailStatus = getBankDetailStatus(state);
  const getUserDashboardData = getUserDashData(state);
  console.log('User Dashboard Data ::::; ' , getUserDashboardData);
  return { profile, privilegeMap, notificationCount, bankDetailStatus, getUserDashboardData};
};

const mapDispatchToProps = {
  fetchNotificationCount,
  showMessage,
  fetchBankDetailStatus,
  fetchUseDashData
};

export default connect(mapStateToProps, mapDispatchToProps)(withNavigationFocus(Home));