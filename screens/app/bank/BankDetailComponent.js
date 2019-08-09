/**
 * @component   : BankDetailComponent
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Friday Apr 19, 2019 14:01:22 IST
 * @description : BankDetailComponent
 */

import React, {Component}  from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet, Text, ScrollView, Button, Image, FlatList, ImageBackground } from 'react-native';
import { Card, Container, Header, Content, Form } from 'native-base';
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-picker';

import { Colors, Fonts } from '../../../res';
import ImageButton from '../../../components/ImageButton';
import TextInput from '../../../components/TextInput';
import OrientLogo from '../../../components/OrientLogo';
import PrimaryButton from '../../../components/PrimaryButton';
import TouchableItem from '../../../components/TouchableItem';
import CheckBox from '../../../components/CheckBox';
import DatePicker from '../../../components/DatePicker';
import HeaderedItem from '../../../components/HeaderedItem';
import Picker from '../../../components/Picker';

import { headingStyles, linkStyles, regularTextStyles } from '../../../res/Styles';

import { getBankNameList, getBankDetailStatus } from '../../../selectors/SignUpSelector';
import { getAction } from '../../../selectors/ApiSelector';
import { getUserProfile } from '../../../selectors/UserSelector';
import { fetchStateCityMapping, fetchBUCategory, fetchBankListData } from '../../../actions/helpActions';
import { showErrorMessage } from '../../../actions/MessageActions';
import {
  signUpRetailer,
  salesExecutiveSignUpRetailer,
  resetSignUp,
  updateBankDetail,
  fetchBankDetailStatus
} from '../../../actions/AuthorizationActions';
import { toDateString, SignUpStep } from '../../../utils';

class BankDetailComponent extends Component {
  static propTypes = {
  }

  static defaultProps = {
  }

  constructor (props) {
    super(props);
    this.state = {
      BankName: null,
      BankOtherName: null,
      AccountNumber: null,
      IFSCCode: null,
      PanCardNo: null,
      panCardPic: null,
      cancelledChequePic: null,
      panCardPicError: false,
      chequePicError: false,
      waitingForResponse: false,
    };
  }

  componentDidMount() {
    this.props.fetchBankListData();
    this.props.fetchBankDetailStatus(this.props.profile.RegisteredMobileNo);
  }

  validateBankDetails = () => {
    if(!this.state.BankName || this.state.BankName.length === 0){
      throw new Error('Please select Bank Name to continue.');
    }
    if (this.state.BankName == -1) {
      if(!this.state.BankOtherName || this.state.BankOtherName.length === 0){
        throw new Error('Please provide other Bank Name to continue.');
      }
    }
    if(!this.state.AccountNumber || this.state.AccountNumber.length === 0){
      throw new Error('Please provide associated Bank Account Number');
    }

    if(!this.state.IFSCCode || this.state.IFSCCode.length === 0){
      throw new Error('Please provide associated Bank IFSC Code');
    }

    if(!this.state.cancelledChequePic){
      throw new Error('Please upload Cancelled Cheque image');
    }

    if(!this.state.PanCardNo || this.state.PanCardNo.length === 0){
      throw new Error('Linking PAN card details with Bank in mandatory');
    }
  }
  _getImageFormat = type => {
    let format = type.split('/')[1].toUpperCase();

    if (format === 'JPEG') {
      format = '.JPG';
    } else  {
      format = '.' + format;
    }
    return format;
  }

  updateBankDetail = () => {
    try {
      this.validateBankDetails();
      const { panCardPic, cancelledChequePic } = this.state;
      const bankDetail = {
        MobileNo: this.props.profile.RegisteredMobileNo,
        PANCardNumber: this.state.PanCardNo,
        BankName: this.state.BankName,
        BankOtherName: this.state.BankOtherName,
        AccountNumber: this.state.AccountNumber,
        IFSCCode: this.state.IFSCCode,
      };
      if (panCardPic) {
        bankDetail.PANCardImage = panCardPic.data;
        bankDetail.PanCardNumberImageFileType = this._getImageFormat(panCardPic.type);
      }
      //vivek
      if (cancelledChequePic) {
        bankDetail.UploadCancelledChequeImage = cancelledChequePic.data;
        bankDetail.UploadCancelledChequeFileType = this._getImageFormat(cancelledChequePic.type);
      }
      this.props.updateBankDetail(bankDetail);
    } catch (err) {
      this.props.showErrorMessage(err.message);
    }
  }

  selectPicture = (title, callback, showRemove) => {
    const options = {
      title: title || 'Select a picture',
      cancelButtonTitle: 'Cancel',
      takePhotoButtonTitle: 'Camera',
      customButtons: showRemove ? [{ name: 'remove', title: 'Remove' }] : [],
      chooseFromLibraryButtonTitle: 'Gallery',
      mediaType: 'photo',
      allowsEditing: false,
      storageOptions: { },
      resizeMethod: 'resize',
      quality: 0.3,
    };

    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        return;
      } else if (response.error) {
        this.props.showErrorMessage(response.error);
      } else if (response.customButton) {
        if (response.customButton === 'remove' && callback) {
          callback(null);
        }
      } else {
        if (callback) {
          const { uri, data, type } = response;
          callback({ uri, data, type });
        }
      }
    });
  }

  render() {
    const {
      panCardPic,
      panCardPicError,
      cancelledChequePic,
      chequePicError,
    } = this.state;

    const panCardPicUri = (panCardPic && !panCardPicError) ? panCardPic.uri : 'upload';
    const cancelledChequePicUri = (cancelledChequePic && !chequePicError) ? cancelledChequePic.uri : 'upload';

    if (!this.props.bankDetailStatus || this.props.bankDetailStatus.status) {
      return (
        <View style={{ flex: 1, padding: 8 }}>
            <View style={{ flex: 1, padding: 8, alignItems: 'center', justifyContent: 'center' }}>
              <Text textAlign='center' style={regularTextStyles.medium}>Bank details are already updated</Text>
            </View>
        </View>
        )
    }
    return (
      <ScrollView contentContainerStyle={{ padding: 8 }}>
        <Card>
          <View style={{ padding: 8 }}>
            <Picker
              placeholder='Bank Name*'
              options={this.props.bankList}
              selectedValue={this.state.BankName}
              onValueChange={(text) => this.setState({ BankName: text })}
            />
            {
            (this.state.BankName === '-1') &&
            (<TextInput
              placeholder='Other Bank Name*'
              value={this.state.BankOtherName}
              onChangeText={(text) => this.setState({ BankOtherName: text })}
            />)
            }
            <TextInput
              placeholder='Account Number*'
              value={this.state.AccountNumber}
              onChangeText={(text) => this.setState({ AccountNumber: text })}
            />
            <TextInput
              placeholder='IFSC Code*'
              value={this.state.IFSCCode}
              onChangeText={(text) => this.setState({ IFSCCode: text })}
            />
            <HeaderedItem header='PAN Card'>
              <View style={{ flexDirection: 'row', marginTop: 4, marginBottom: 4 }}>
                <TouchableItem
                  style={{ flex: 1, marginTop: 4, marginBottom: 4 }}
                  onPress={ () => this.selectPicture('Select a picture', picture => { this.setState({ panCardPic: picture })}, panCardPic) }
                >
                  <Image
                    style={{ flex: 1, height: 80 }}
                    source={{ uri: panCardPicUri }}
                    onError={() => this.setState({ panCardPicError: true }) }
                  />
                </TouchableItem>
                <TextInput
                  placeholder='PAN Card Number'
                  style={{ flex: 3, marginLeft: 6 }}
                  value={this.state.PanCardNo}
                  onChangeText={text => this.setState({ PanCardNo: text })}
                />
              </View>
            </HeaderedItem>

            <HeaderedItem header='Cancelled Cheque*'>
              <View style={{ flexDirection: 'row', marginTop: 4, marginBottom: 4 }}>
                <TouchableItem
                  style={{ marginTop: 4, marginBottom: 4 }}
                  onPress={ () => this.selectPicture('Select a picture', picture => { this.setState({ cancelledChequePic: picture })}, cancelledChequePic) }
                >
                  <Image
                    style={{ flex: 1, height: 120 }}
                    resizeMode='stretch'
                    source={{ uri: cancelledChequePicUri }}
                    onError={() => this.setState({ canceled: true }) }
                  />
                </TouchableItem>
              </View>
            </HeaderedItem>
            <PrimaryButton title='Update' onPress={this.updateBankDetail} />
          </View>
        </Card>
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  const action = getAction(state);
  const bankList = getBankNameList(state);
  const profile = getUserProfile(state);
  const bankDetailStatus = getBankDetailStatus(state);
  return { action, bankList, profile, bankDetailStatus };
}

const mapDispatchToProps = {
  showErrorMessage,
  fetchBankListData,
  updateBankDetail,
  fetchBankDetailStatus,
};

export default connect(mapStateToProps, mapDispatchToProps)(BankDetailComponent);
