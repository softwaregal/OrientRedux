/**
 * @component   : GiftingStatus
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Friday Jan 25, 2019 13:11:52 IST
 * @description : GiftingStatus
 */

import React, {Component}  from 'react'
import PropTypes from 'prop-types'

import { View, FlatList, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import Dialog from "react-native-dialog";

import GiftingStatusItem from './GiftingStatusItem';
import PrimaryButton from '../../../components/PrimaryButton';
import TextInput from '../../../components/TextInput';
import { regularTextStyles } from '../../../res/Styles';
import Colors from '../../../res/Colors';

import { getGiftingDetails } from '../../../selectors/GiftingSelector';
import { getUserProfile } from '../../../selectors/UserSelector';
import { isRequestPending } from '../../../selectors/ApiSelector';
import { showMessage, showErrorMessage } from '../../../actions/MessageActions';
import { getPointGiftDetail, updateGiftingStatus, clearGiftingData, GiftingActionTypes, updateReceivedGiftStatus } from '../../../actions/GiftingActions';
import ScreenName from './ScreenName';
import CheckBox from '../../../components/CheckBox';
import { isSalesExecutive, isDistributor, elevation } from '../../../utils';
import { GiftingStatus as GiftingStatusFlag, SCHEME_ID_ALL_SCHEMES } from '../../../constants';

class GiftingStatus extends Component {
  static propTypes = {
  }

  static defaultProps = {
  }


  static navigationOptions = ({ navigation }) => ({
    headerRight: navigation.getParam('showSelectAll') ? (<CheckBox
              color= '#000000'
              tickColor = '#000000'
              checked={navigation.getParam('selectAll')}
              onPress={navigation.getParam('handleCheckBox')} 
              />) : null
  })

  handleCheckBox = () => {
    let checkValue = !this.props.navigation.getParam('selectAll');
        this.props.navigation.setParams({ selectAll: checkValue })
         const someThing = checkValue ? this.props.giftingDetails.reduce((all, current) => {
            all[current.GiftingId] = true;
            return all;
         }, {}) :
         ({});

         this.setState({selectedGifts: someThing})
      };

  constructor (props) {
    super(props);
    this.props.navigation.setParams({ handleCheckBox: this.handleCheckBox })
    this.state = {
      selectedGifts: {},
      showRemarksDialog: false,
      remarks: null,
    }
    this.waitingForResponse = false;

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
          if(this.didBlur){
            this._fetchGiftingDetails();
            this.didBlur = false;
          }
        }
      );

      if (this.props.profile &&
         (isDistributor(this.props.profile) || isSalesExecutive(this.props.profile)) &&
	 this.props.navigation.getParam('status') === GiftingStatusFlag.PENDING) {
        this.props.navigation.setParams({ showSelectAll: true });
      } else {
        this.props.navigation.setParams({ showSelectAll: false });        
      }
  }

  componentDidMount() {
    this._fetchGiftingDetails();
  }

  componentDidUpdate(prevProps) {
    if (this.props.busy !== prevProps.busy) {
      if (!this.props.busy && this.waitingForResponse) {
        this._fetchGiftingDetails();
        this.waitingForResponse = false;
      }
    }
    if (this.props.giftingDetails !== prevProps.giftingDetails) {
      if (this.props.giftingDetails) {
        let selectedGifts = this.state.selectedGifts;
        this.props.giftingDetails.forEach(detail => {
          const val = selectedGifts[detail.GiftingId];
          if (val !== true && val !== false) {
            delete selectedGifts[detail.GiftingId];
          }
        });
        this.setState({ selectedGifts: Object.assign({}, selectedGifts) });
      }
    }
    if (this.props.profile !== prevProps.profile) {
      if (this.props.profile &&
         isDistributor(this.props.profile) &&
	 this.props.navigation.getParam('status') === GiftingStatusFlag.PENDING) {
        this.props.navigation.setParams({ showSelectAll: true });
      } else {
        this.props.navigation.setParams({ showSelectAll: false });        
      }
    }
  }

  componentWillUnmount () {
    this.props.clearGiftingData(GiftingActionTypes.GET_POINT_GIFT_DETAIL);
    this.didFocusSubscription.remove();
    this.didBlurSubscription.remove();
  }


  _fetchGiftingDetails = () => {
    if (!this.props.profile) {
      return;
    }
    const schemeId = this.props.navigation.getParam('schemeId');
    const status = this.props.navigation.getParam('status');

    this.props.getPointGiftDetail({
      userid: this.props.profile.RegisteredMobileNo,
      schemeid: schemeId ? schemeId : SCHEME_ID_ALL_SCHEMES,
      status: status ? status : GiftingStatusFlag.ALL,
    });
  }

  _onPress = giftDetail => {
    this.props.navigation.push(ScreenName.GIFT_DELIVERY, { giftDetail });
  }

  _toggleSelection = giftDetail => {
    const { selectedGifts } = this.state;
    selectedGifts[giftDetail.GiftingId] = !selectedGifts[giftDetail.GiftingId];
    this.setState({ selectedGifts: Object.assign({}, selectedGifts) });
  }

  _showDeliveryStatus = giftDetail => {
    this.props.navigation.push(ScreenName.GIFT_DELIVERY_STATUS, { giftDetail });
  }

  _showRemarksDialog = (callback) => {
    this.acceptRemarksCallback = callback;
    this.setState({ remarks: '', showRemarksDialog: true });
  }

  _acceptRemarks = () => {
    this.setState({ showRemarksDialog: false });

    if (this.acceptRemarksCallback) {
      this.acceptRemarksCallback(this.state.remarks);
      this.acceptRemarksCallback = null;
    }
  }

  _renderDistributorView = ({ item }) => {
    const status = this.props.navigation.getParam('status');
    if (status !== GiftingStatusFlag.PENDING) {
      return <GiftingStatusItem
        detail={item}
        onPress={item.Status === GiftingStatusFlag.DELIVERED ? this._showDeliveryStatus : null}
        profile={this.props.profile}
      />
    }
    return <GiftingStatusItem
      detail={item}
      checkable
      checked={this.state.selectedGifts[item.GiftingId]}
      onToggle={() => this._toggleSelection(item)}
      showStatus={false}
profile={this.props.profile}
    />
  }

  _renderSalesExecutiveView = ({ item }) => {
    const status = item.Status;
    let callback = null;
    if (status === GiftingStatusFlag.DISPATCHED) {
      callback = this._onPress;
    } else if (status === GiftingStatusFlag.DELIVERED) {
      callback = this._showDeliveryStatus;
    }
    else if(status === GiftingStatusFlag.PENDING){
      return <GiftingStatusItem
        detail={item}
        checkable
        checked={this.state.selectedGifts[item.GiftingId]}
        onToggle={() => this._toggleSelection(item)}
        showStatus={false}
        profile={this.props.profile}
        />
    }
    return <GiftingStatusItem
      detail={item}
      onPress={callback}
profile={this.props.profile}
    />
  }
  _renderOtherUsersView = ({ item }) => {
    return <GiftingStatusItem
profile={this.props.profile}
      detail={item}
    />
  }

  _listRenderer = () => {
    // return this._renderDistributorView;
    if (isSalesExecutive(this.props.profile)) {
      return this._renderSalesExecutiveView;
    }
    if (isDistributor(this.props.profile)) {
      return this._renderDistributorView;
    }

    return this._renderOtherUsersView;
  }

  getSelectedGifts = () => {
    return Object.keys(this.state.selectedGifts).filter(id => this.state.selectedGifts[id]);
  }
  _approveSelectedGifts = () => {
    if (this.getSelectedGifts().length === 0) {
      this.props.showErrorMessage('Please select gifts to approve');
      return;
    }
    this._updateGiftStatus(GiftingStatusFlag.APPROVED);
  }

  _rejectSelectedGifts = () => {
    if (this.getSelectedGifts().length === 0) {
      this.props.showErrorMessage('Please select gifts to reject');
      return;
    }
    this._updateGiftStatus(GiftingStatusFlag.REJECTED);
  }

  _giftInWarehouse = () => {
    // Update Received Gifts by Sales Executive Only.
    if (this.getSelectedGifts().length === 0) {
      this.props.showErrorMessage('Please select received gifts to continue');
      return;
    }
    this._updateReceivedGiftStatus(GiftingStatusFlag.DISPATCHED);
  }

  _updateReceivedGiftStatus = status => {
    // Update Received Gift Status
    const { profile } = this.props;
      this.props.updateReceivedGiftStatus(
        profile.RegisteredMobileNo,
        this.getSelectedGifts(),
        status
      );

      this.waitingForResponse = true;
  }

  _updateGiftStatus = status => {
    this._showRemarksDialog(remarks => {
      const { profile } = this.props;
      this.props.updateGiftingStatus(
        profile.RegisteredMobileNo,
        this.getSelectedGifts(),
        status,
        remarks
      );
    });
    this.waitingForResponse = true;
  }

  _renderFooter = () => {
    const status = this.props.navigation.getParam('status');
    if ((!isDistributor(this.props.profile) && !isSalesExecutive(this.props.profile))
      || status !== GiftingStatusFlag.PENDING) {
      return null;
    }

    if(isSalesExecutive(this.props.profile)){
      return (
          <View style={styles.footer}>
            <View style={{ flexDirection: 'row' }}>
            <View style={styles.button}>
              <PrimaryButton
                title='Gift Received'
                onPress={this._giftInWarehouse}
              />
              </View>
      </View>
      </View>
      );
    }

    return (
      <View style={styles.footer}>
        <View style={{ flexDirection: 'row' }}>
	  <View style={styles.button}>
          <PrimaryButton
            title='Approve'
            onPress={this._approveSelectedGifts}
          />
	</View>
	  <View style={styles.button}>
          <PrimaryButton
            title='Reject'
            onPress={this._rejectSelectedGifts}
          />
	</View>
        </View>
        <Dialog.Container visible={this.state.showRemarksDialog}>
          <Dialog.Title>Add Remarks</Dialog.Title>
          <TextInput
            multiline
            placeholder='Enter Remarks'
            value={this.state.remarks}
            onChangeText={text => this.setState({ remarks: text })}
          />
         

          <View style={{ flexDirection: 'row' }}>
    <View style={{flex: 1}}>
          <PrimaryButton
      basic
            title="CANCEL"
            color={Colors.PRIMARY_TEXT}
      textStyle={{ color: Colors.SECONDARY_TEXT }}
           onPress={() => this.setState({ showRemarksDialog: false })}
          />
    </View>
    <View style={{flex: 1}}>
          <PrimaryButton
      basic
            title="SUBMIT"
            color={Colors.COLORPRIMARY}
            onPress={this._acceptRemarks}
          />
    </View>
    </View>


        </Dialog.Container>
      </View>
    );
  }

  render() {
    if (!this.props.profile) {
      return null;
    }
    const { giftingDetails } = this.props;
    if (giftingDetails && giftingDetails.length === 0) {
      return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={regularTextStyles.medium}>No gifts to show</Text>
      </View>
      );
    }
    return (
      <View style={styles.container}>
        <FlatList
          style={styles.giftList}
          data={this.props.giftingDetails}
          extraData={this.state.selectedGifts}
          keyExtractor={(item, index) => `${index}`}
          renderItem={this._listRenderer()}
        />
        { this._renderFooter() }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  giftList: {
    flexGrow: 1,
    marginLeft: 8,
    marginRight: 8,
  },
  footer: {
  },
  button: {
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
  }
});

const mapStateToProps = (state, props) => {
  const schemeId = props.navigation.getParam('schemeId');
  const status = props.navigation.getParam('status');
  const giftingDetails = getGiftingDetails(state, schemeId, status);
  const profile = getUserProfile(state);
  const busy = isRequestPending(state);
  return { profile, giftingDetails, busy };
}

const mapDispatchToProps = {
  showErrorMessage,
  getPointGiftDetail,
  updateGiftingStatus,
  clearGiftingData,
  updateReceivedGiftStatus,
};

export default connect(mapStateToProps, mapDispatchToProps)(GiftingStatus);
