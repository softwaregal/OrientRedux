/***
 * @component   : UserRegistration
 * @author      : Vivek V Singh
 * @created     : Monday Jan 07, 2019 16:31:07 IST
 * @description : UserRegistration
 * User Registration Image Upload : https://github.com/react-native-community/react-native-image-picker
 * Date Picker: https://docs.nativebase.io/Components.html#picker-input-headref
 */

import React, {Component}  from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text, ScrollView, Button, Image, FlatList, ImageBackground } from 'react-native';
import { Card, Container, Header, Content, Form } from 'native-base';
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-picker';

import { Colors, Fonts } from '../../res';
import ImageButton from '../../components/ImageButton';
import TextInput from '../../components/TextInput';
import OrientLogo from '../../components/OrientLogo';
import PrimaryButton from '../../components/PrimaryButton';
import TouchableItem from '../../components/TouchableItem';
import CheckBox from '../../components/CheckBox';
import DatePicker from '../../components/DatePicker';
import HeaderedItem from '../../components/HeaderedItem';

import { headingStyles, linkStyles } from '../../res/Styles';

import Picker from '../../components/Picker';
import ScreenName from './ScreenName';
import {
  getSignUpProfile,
  getStateCityMapping,
  getBUCategories,
  getSignUpStep, getBankNameList
} from '../../selectors/SignUpSelector';
import { getAction } from '../../selectors/ApiSelector';
import { getUserProfile } from '../../selectors/UserSelector';
import { fetchStateCityMapping, fetchBUCategory, fetchBankListData } from '../../actions/helpActions';
import { showErrorMessage } from '../../actions/MessageActions';
import { signUpRetailer, salesExecutiveSignUpRetailer, resetSignUp } from '../../actions/AuthorizationActions';
import { toDateString, SignUpStep } from '../../utils';

const salutationTypes = [
  { label: 'Mr.', value: 'Mr' },
  { label: 'Mrs.', value: 'Mrs' },
  { label: 'Ms.', value: 'Miss' },
];

const retailerTypes = [
  { label: 'Direct', value: 'DIRECT' },
  { label: 'Indirect', value: 'INDIRECT' },
];

const businessTypes = [
  { label: 'Wholesale', value: 'WHOLESALE' },
  { label: 'Retail', value: 'RETAIL' },
];

const maritalStatus = [
  { label: 'Single', value: 'Single' },
  { label: 'Married', value: 'Married' },
];

const genderTypes = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
];

const mandatoryFields = {
  ProfileImageContent: 'Profile image is mandatory.',
  Name : 'Please provide your name.',
  Salutation: 'Please select Salutation.',
  MobileNo: 'Please provide valid mobile number.',
  BusinessType: 'Please select your firm business type',
  NameoftheFirm: 'Please provide firm name',
  FirmAddress: 'Please provide your firm address.',
  FirmState: 'Please select your firm state name.',
  FirmCity: 'Please provide your firm city name.',
  FirmPinCode: 'Please provide your firm city pin code.',
  VisitingCardPhotoContent: 'Visiting type image is mandatory.',
  Password: 'Please provide your password.',
  ConfirmPassword: 'Please confirm your password.',

};

const EMAIL_REGEX = /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i;

class UserRegistration extends Component {
  static propTypes = {
    disabled: PropTypes.bool,
  }

  static defaultProps = {
    disabled: false,
  }

  static navigationOptions = ({ navigation }) => ({
    headerRight: (
      <ImageButton
        source={{ uri: 'done' }}
        onPress={navigation.getParam('signUp') ? navigation.getParam('signUp') : () => {}}
      />)
  });


  constructor (props) {
    super(props);

    this.state = {
  SameAddress: false,
  ProvideBankDetails: false,
      profile: {
        Salutation: null,
        Name : null,
        TypeofRetailer: 'Indirect',
        BUName: null,
        MobileNo: null,
        DateofBirth: null,
        NameoftheFirm: null,
        OTP: null,
        FirmAddress: null,
        FirmState: null,
        FirmCity: null,
        FirmPinCode: null,
        BusinessType: null,
        PersonalAddress: null,
        PersonalAddressState: null,
        PersonalAddressCity: null,
        PersonalAddressPinCode: null,
        AlternateContactNumber: null,
        PanCardNo: null,
        PanCardNumberImageFileType: null,
        PanCardNumberImageContent: null,
        AadharCardNumber: null,
        AadharCardNumberFileType: null,
        AadharCardNumberContent: null,
        VisitingCardPhotoFileType: null,
        VisitingCardPhotoContent: null,
        ProfileImageFileType: null,
        ProfileImageContent: null,
        Password: null,
        ConfirmPassword: null,
        EmailId: '',
        MaritalStatus: null,
        WeddingAnniversary: null,
        SpouseName: null,
        SpouseDOB: null,
        Child1Name: null,
        Child1DOB: null,
        Child2Name: null,
        Child2DOB: null,
        Child3Name: null,
        Child3DOB: null,
        Gender: null,
        BankName: null,
        BankOtherName: null,
        AccountNumber: null,
        IFSCCode: null,
        UploadCancelledChequeContent: null,
        UploadCancelledChequeFileType: null,
      },
      firmAddressCityNames: [],
      personalAddressCityNames: [],
      stateNames: [],
      productDealsIn: {},
      productDealsInSet: false,
      profilePic: null,
      chequePic: null,
      visitingCardPic: null,
      aadharCardPic: null,
      panCardPic: null,
      cancelledChequePic: null,
      waitingForResponse: false,
      profilePicError: false,
      visitingCardPicError: false,
      aadharCardPicError: false,
      panCardPicError: false,
      chequePicError: false,
      
    };

    const newProfile = this.props.profile || this.props.profileDetail;
    if (newProfile) {
      this.state.profile = Object.assign(this.state.profile, newProfile);
      if (this.props.BUCategories) {
        const { BUCategories } = this.props;
        const productDealsIn = BUCategories.reduce((obj, category) => {
          obj[category] = false;
          return obj;
        }, {});
        const { BUName } = newProfile;
        if (BUName) {
          const selectedCategories = BUName.split(',');
          selectedCategories.forEach(category => { productDealsIn[category] = true; });
        }
        this.state.productDealsIn = productDealsIn;
      }
      }

    if (this.props.navigation && !this.props.disabled) {
      this.props.navigation.setParams({ signUp: this._signUp });
    }
    const { stateCityMapping } = this.props;
    if (stateCityMapping) {
      const stateNames = Object.keys(stateCityMapping).map(state => ({ label: state, value: state }));
      this.state.stateNames = stateNames;
      if (stateNames && stateNames.length > 0) {
        let cities = null;
        if (newProfile && newProfile.FirmState) {
          cities = stateCityMapping[newProfile.FirmState];
        } else {
          cities = stateCityMapping[stateNames[0]];
        }
        if (cities) {
          this.state.firmAddressCityNames = cities.map(city => ({ label: city, value: city }));
        }
        cities = null;
        if (newProfile && newProfile.PersonalAddressState) {
          cities = stateCityMapping[newProfile.PersonalAddressState];
        } else {
          cities = stateCityMapping[stateNames[0]];
        }
        if (cities) {
          this.state.personalAddressCityNames = cities.map(city => ({ label: city, value: city }));
        }
      }
    }
  }

  componentDidMount() {
    this.props.resetSignUp();
    if (!this.props.disabled) {
      this.props.fetchStateCityMapping();
      console.log('sdkvjbjsdvjbsdvsdv hitting');
      /*this.props.fetchBankListData();*/
    }
    this.props.fetchBUCategory();
    this._updateStateList();
  }


  getAge(dateString) 
  {
      var today = new Date();
      var birthDate = new Date(dateString);
      var age = today.getFullYear() - birthDate.getFullYear();
      var m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) 
      {
          
          age--;
      }
      return age;
  }

  componentDidUpdate(prevProps) {
    if (this.props.disabled) {
      if (this.props.profileDetail === prevProps.profileDetail
        && this.props.BUCategories === prevProps.BUCategories) {
        return;
      }
    } else {
      if (this.props.profile === prevProps.profile
        && this.props.BUCategories === prevProps.BUCategories
        && this.props.stateCityMapping === prevProps.stateCityMapping) {
        return;
      }
    }
    let changes = {}
    if (prevProps.profile !== this.props.profile && this.props.profile) {
      changes = Object.assign(changes,{
        profile: Object.assign({}, this.state.profile, this.props.profile),
        profilePicError: false,
        visitingCardPicError: false,
        panCardPicError: false,
        aadharCardPicError: false,
      });
    }
    if (prevProps.profileDetail !== this.props.profileDetail && this.props.profileDetail) {
      changes = Object.assign(changes, {
        profile: Object.assign({}, this.state.profile, this.props.profileDetail),
        profilePicError: false,
        visitingCardPicError: false,
        panCardPicError: false,
        aadharCardPicError: false,
      });
    }
    if (prevProps.stateCityMapping !== this.props.stateCityMapping  && this.props.stateCityMapping) {
      this._updateStateList();
    }
    const newProfile = this.props.profile || this.props.profileDetail;
    if (newProfile) {
      if (prevProps.BUCategories !== this.props.BUCategories
        || !(Object.keys(this.state.productDealsIn).reduce((res, cur) => { return res || this.state.productDealsIn[cur]; }, false) || this.state.productDealsInSet)) {
        const { BUCategories } = this.props;
        if (!BUCategories) {
          changes = Object.assign(changes, { productDealsIn: {} });
        } else {
          const productDealsIn = BUCategories.reduce((obj, category) => {
            obj[category] = false;
            return obj;
          }, {});
          const { BUName } = newProfile;
          if (BUName) {
            const selectedCategories = BUName.split(',');
            selectedCategories.forEach(category => { productDealsIn[category] = true; });
          }
          changes = Object.assign(changes, { productDealsIn: productDealsIn, productDealsInSet: true });
        }
      }
      if ((!this.state.panCardPic
        || newProfile.PANCardImage !== this.state.panCardPic.uri)
        && newProfile.PANCardImage) {
          changes = Object.assign(changes, { panCardPic : { uri: newProfile.PANCardImage }});
      }
      if ((!this.state.aadharCardPic
        || newProfile.AddressProofImage !== this.state.aadharCardPic.uri)
        && newProfile.AddressProofImage) {
        changes = Object.assign(changes, { aadharCardPic : { uri: newProfile.AddressProofImage }});
      }
      if ((!this.state.visitingCardPic
        || newProfile.VisitingCardPhoto !== this.state.visitingCardPic.uri)
        && newProfile.VisitingCardPhoto) {
        changes = Object.assign(changes, { visitingCardPic : { uri: newProfile.VisitingCardPhoto }});
      }
      if ((!this.state.profilePic
        || newProfile.ProfileImage !== this.state.profilePic.uri)
        && newProfile.ProfileImage) {
        changes = Object.assign(changes, { profilePic : { uri: newProfile.ProfileImage }});
      }
 ///vivek .. takes uri for profile screen
      if ((!this.state.chequePic
        || newProfile.UploadCancelledCheque !== this.state.cancelledChequePic.uri)
        && newProfile.UploadCancelledCheque) {
        changes = Object.assign(changes, { cancelledChequePic : { uri: newProfile.UploadCancelledCheque }});
      }
    }
    if (this.props.signUpStep === SignUpStep.VERIFY_OTP && this.state.waitingForResponse) {
      this.props.navigation.push(this.props.navigation.getParam('otpVerificationScreen'));
      changes = Object.assign(changes, { waitingForResponse: false });
    }

    this.setState(changes);
  }

  _validateUserProfile = (profile) => {
    Object.keys(mandatoryFields).forEach(key => {
      if (!profile[key] || profile[key].length === 0) {
        throw new Error(mandatoryFields[key]);
      }
    });

    if (profile.MobileNo.length !== 10) {

      throw new Error('Invalid mobile number');
    }
    if (profile.AlternateContactNumber && profile.AlternateContactNumber.length !== 10) {
      throw new Error('Invalid alternate mobile number');
    }
    if (profile.Password.length < 6 || profile.Password.length > 10) {
      throw new Error('Password should be alpha numeric from 6-10 characters');
    }
    if (profile.Password !== profile.ConfirmPassword) {
      throw new Error('Password did not match.');
    }
    if ((!profile.AadharCardNumber || profile.AadharCardNumber.length === 0)
      && (!profile.PanCardNo || profile.PanCardNo.length === 0)) {
      throw new Error('Please enter your correct 16 digit Aadhar card or 10 digit alpha numeric Pan card no.');
    }
    if (!profile.BUName || profile.BUName.length === 0) {
      throw new Error('Please choose your products.');
    }

    if (profile.EmailId && profile.EmailId.length > 0) {
      if (!profile.EmailId.match(EMAIL_REGEX)) {
        throw new Error('Please enter a valid email id');
      }
    }

    if(this.getAge(profile.DateofBirth) < 18){
      throw new Error('Age is less than 18 years.');
    } 

    if(this.state.ProvideBankDetails)
    {
      console.log("BANK NAE IS  " + profile.BankName);
      if(!profile.BankName || profile.BankName.length === 0){
        throw new Error('Please select Bank Name to continue.');
      }

      if(profile.BankName === '-1'){
          if(!profile.BankOtherName || profile.BankOtherName.length === 0){
            throw new Error("Please provide other bank name");
          }
      }

      if(!profile.AccountNumber || profile.AccountNumber.length === 0){
        throw new Error('Please provide associated Bank Account Number');
      }

      if(!profile.IFSCCode || profile.IFSCCode.length === 0){
        throw new Error('Please provide associated Bank IFSC Code');
      }
      
      if(!profile.UploadCancelledChequeContent || profile.UploadCancelledChequeContent.length === 0){
        throw new Error('Please upload Cancelled Cheque image');
      }

      if(!profile.PanCardNo || profile.PanCardNo.length === 0){
        throw new Error('Linking PAN card details with Bank in mandatory');
      }

    }

    // validate rest of the fields
  }

  _updateStateList = () => {
    const { stateCityMapping } = this.props;
    if (!stateCityMapping) {
      this.setState({ stateNames: [], firmAddressCityNames: [], personalAddressCityNames: [] });
      return;
    }
    const stateNames = Object.keys(stateCityMapping).map(state => ({ label: state, value: state }));
    this.setState({ stateNames });
    this._updateFirmStateName(this.state.profile.FirmState);
    this._updatePersonalStateName(this.state.profile.PersonalAddressState);
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
  // Call API functions
  _signUp = () => {
    try {
      let profile = Object.assign({}, this.state.profile);

      const { profilePic, visitingCardPic, aadharCardPic, panCardPic, cancelledChequePic } = this.state;

      if (profilePic) {
        profile.ProfileImageContent = profilePic.data;
        profile.ProfileImageFileType = this._getImageFormat(profilePic.type);
      }
      if (visitingCardPic) {
        profile.VisitingCardPhotoContent = visitingCardPic.data;
        profile.VisitingCardPhotoFileType = this._getImageFormat(visitingCardPic.type);
      }
      if (aadharCardPic) {
        profile.AadharCardNumberContent = aadharCardPic.data;
        profile.AadharCardNumberFileType = this._getImageFormat(aadharCardPic.type);
      }
      if (panCardPic) {
        profile.PanCardNumberImageContent = panCardPic.data;
        profile.PanCardNumberImageFileType = this._getImageFormat(panCardPic.type);
      }

      //vivek
      if (cancelledChequePic) {
        profile.UploadCancelledChequeContent = cancelledChequePic.data;
        profile.UploadCancelledChequeFileType = this._getImageFormat(cancelledChequePic.type);
      }

      const productDealsIn = Object.keys(this.state.productDealsIn).filter(category => this.state.productDealsIn[category]);
      profile.BUName = productDealsIn.join(',');

      this._validateUserProfile(profile);

      // prepare object for non null fields
      profile = Object.keys(profile).reduce((obj, field) => {
        if (profile[field]) {
          obj[field] = profile[field];
        }
        return obj;
      }, {});

    if (profile.DateofBirth) {
      console.log("Date is : " + profile.DateofBirth);
      profile.DateofBirth = toDateString(profile.DateofBirth);
    }
      if (profile.WeddingAnniversary) {
        profile.WeddingAnniversary = toDateString(profile.WeddingAnniversary);
      }
      if (profile.SpouseDOB) {
        profile.SpouseDOB = toDateString(profile.SpouseDOB);
      }
      if (profile.Child1DOB) {
        profile.Child1DOB = toDateString(profile.Child1DOB);
      }
      if (profile.Child2DOB) {
        profile.Child2DOB = toDateString(profile.Child2DOB);
      }
      if (profile.Child3DOB) {
        profile.Child3DOB = toDateString(profile.Child3DOB);
      }

      if (this.props.navigation.getParam('retailerSignUp')) {
        this.props.salesExecutiveSignUpRetailer(profile, this.props.salesExecutiveProfile);
      } else {
        this.props.signUpRetailer(profile);
      }
      this.setState({ waitingForResponse: true });
    } catch (error) {
      this.props.showErrorMessage(error.message);
    }
  }

  selectPicture = (title, callback, showRemove) => {
    if (this.props.disabled) {
      return;
    }
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

  _updateProfile = obj => {
    this.setState({ profile: Object.assign({}, this.state.profile, obj) });
  }

  _updateFirmStateName = name => {
    this._updateProfile({ FirmState: name });
    this._updateProfile({ FirmCity: null });
    if (this.props.stateCityMapping[name]) {
      this.setState({ firmAddressCityNames: this.props.stateCityMapping[name].map(city => ({ label: city, value: city })) });
    }
  }

  _updatePersonalStateName = name => {
    this._updateProfile({ PersonalAddressState: name });
    this._updateProfile({ PersonalAddressCity: null });
    if (this.props.stateCityMapping[name]) {
      this.setState({ personalAddressCityNames: this.props.stateCityMapping[name].map(city => ({ label: city, value: city })) });
    }
  }

  _toggleBUCategory = category => {
    const { productDealsIn } = this.state;
    productDealsIn[category] = !productDealsIn[category];
    this.setState({ productDealsIn: Object.assign({}, productDealsIn) });
  }

  
  handleCheckBox = () => {
    let checkValue = !this.state.SameAddress;
        this.setState({ SameAddress: checkValue })
         if (checkValue) {
     this._updateProfile({ PersonalAddress: this.state.profile.FirmAddress, PersonalAddressState: this.state.profile.FirmState,
  PersonalAddressCity: this.state.profile.FirmCity, PersonalAddressPinCode: this.state.profile.FirmPinCode })
         }else{
     this._updateProfile({ PersonalAddress: '',  PersonalAddressState: '', PersonalAddressCity: '', PersonalAddressPinCode: ''})
         }    
      };
      
      handleBankCheckBox = () => {
        let checkValue = !this.state.ProvideBankDetails;
           this.setState({ ProvideBankDetails: checkValue })
            if (checkValue) {
              this.setState({'ProvideBankDetails' : true})
            }else{
              this._updateProfile({ BankName: '',  BankOtherName: '', AccountNumber: '', IFSCCode: '', UploadCancelledChequeContent: '', UploadCancelledChequeFileType: ''})
              this.setState({'ProvideBankDetails' : false})
            }    
         };

  render() {
    const {
      profile,
      profilePic, 
      visitingCardPic,
      aadharCardPic,
      panCardPic,
      profilePicError,
      visitingCardPicError,
      aadharCardPicError,
      panCardPicError,
      cancelledChequePic,
      chequePicError,
    } = this.state;

    const { disabled } = this.props;
    const profilePicUri = (profilePic && !profilePicError) ? profilePic.uri : (disabled ? 'no_image' : 'addimage');
    const visitingCardPicUri = (visitingCardPic && !visitingCardPicError) ? visitingCardPic.uri : (disabled ? 'no_image' : 'upload');
    const aadharCardPicUri = (aadharCardPic && !aadharCardPicError) ? aadharCardPic.uri : (disabled ? 'no_image' : 'upload');
    const panCardPicUri = (panCardPic && !panCardPicError) ? panCardPic.uri : (disabled ? 'no_image' : 'upload');
    const cancelledChequePicUri = (cancelledChequePic && !chequePicError) ? cancelledChequePic.uri : (disabled ? 'no_image' : 'upload');

    console.log(this.props.bankList);

    const isMarried = profile.MaritalStatus === 'Married';

    return (
      <ScrollView contentContainerStyle={{ padding: 8 }}>
        <Card>
          <View style={{ padding: 8 }}>
            <View style={{ alignItems: 'center', flex: 1 }}>
              {
              !disabled ?
              (<View style={{ alignItems: 'center' }}>
                <Text style={headingStyles.large}>Welcome to Orient Connect</Text>
                <Text style={headingStyles.small}>Fields marked with * are mandatory</Text>
              </View>) : (<View />)
              }
              <ImageButton
                circular
                clipImage
                raised
                size={72}
                style={{ margin: 8 }}
                padding={0}
                source={{ uri: profilePicUri }}
                onError={() => this.setState({ profilePicError: true }) }
                onPress={ () => this.selectPicture('Select profile picture', picture => { this.setState({ profilePic: picture })}, profilePic) }
              />
            </View>
            <View>
             
              <TextInput
                placeholder='Member Name*'
                value={profile.Name}
                onChangeText={text => this._updateProfile({ Name: text })}
                editable={!disabled}
              />

              <Picker
                placeholder='Gender'
                options={genderTypes}
                selectedValue={profile.Gender}
                onValueChange={ (text) => this._updateProfile({ Gender: text })}
                enabled={!disabled}
              />

              <Picker
                placeholder='Salutation*'
                options={salutationTypes}
                selectedValue={profile.Salutation}
                onValueChange={value => this._updateProfile({ Salutation: value })}
                enabled={!disabled}
              />

              <TextInput
                keyboardType='numeric'
                placeholder='Mobile no. linked to Paytm*'
                value={profile.MobileNo || (disabled ? this.props.RegisteredMobileNo : null)}
                onChangeText={text => this._updateProfile({ MobileNo: text })}
                editable={!disabled}
              />

              <TextInput
                keyboardType='numeric'
                placeholder='Alternate Mobile Number'
                value={profile.AlternateContactNumber}
                onChangeText={text => this._updateProfile({ AlternateContactNumber: text })}
                editable={!disabled}
              />

              <TextInput
                placeholder='Email Id'
                value={profile.EmailId}
                onChangeText={text => this._updateProfile({ EmailId: text })}
                editable={!disabled}
              />
              
              <DatePicker
                defaultDate={profile.DateofBirth}
                maximumDate={new Date()}
                placeHolderText="Date of Birth"
    headerText="Date of Birth"
                onDateChange={date => this._updateProfile({ DateofBirth: date })}
                disabled={disabled}
    style= {{width: '100%' }}
              />
              <TextInput
                placeholder='Firm Name*'
                value={profile.NameoftheFirm}
                onChangeText={text => this._updateProfile({ NameoftheFirm: text })}
                editable={!disabled}
              />


              <Picker
                placeholder='Firm Business Type*'
                options={businessTypes}
                selectedValue={profile.BusinessType}
                onValueChange={ (text) => this._updateProfile({ BusinessType: text })}
                enabled={!disabled}
              />


              <TextInput
                placeholder='Firm Address*'
                value={profile.FirmAddress}
                onChangeText={text => this._updateProfile({ FirmAddress: text })}
                editable={!disabled}
              />
              <Picker
                placeholder='Firm State Name*'
                options={this.state.stateNames}
                selectedValue={profile.FirmState}
                onValueChange={ (text) => this._updateFirmStateName(text)}
                enabled={!disabled}
              />
              <Picker
                placeholder='Firm City Name*'
                options={this.state.firmAddressCityNames}
                selectedValue={profile.FirmCity}
                onValueChange={ (text) => this._updateProfile({ FirmCity: text })}
                enabled={!disabled}
              />
              <TextInput
                keyboardType='numeric'
                placeholder='Firm Pin Code*'
                value={profile.FirmPinCode}
                onChangeText={text => this._updateProfile({ FirmPinCode: text })}
                editable={!disabled}
              />
              

               {
                !this.props.disabled && 
              
                <CheckBox
              checked={this.state.SameAddress}
              label='Personal address same as Firm address'
              onPress={this.handleCheckBox}
              />

              }

              <TextInput
                placeholder='Personal Address'
                value={profile.PersonalAddress}
                onChangeText={text => this._updateProfile({ PersonalAddress: text })}
                editable={!disabled}
              />
              <Picker
                placeholder='Personal State Name'
                options={this.state.stateNames}
                selectedValue={profile.PersonalAddressState}
                onValueChange={ (text) => this._updatePersonalStateName(text)}
                enabled={!disabled}
              />
              <Picker
                placeholder='Personal Address City'
                options={this.state.personalAddressCityNames}
                selectedValue={profile.PersonalAddressCity}
                onValueChange={ (text) => this._updateProfile({ PersonalAddressCity: text })}
                enabled={!disabled}
              />
              <TextInput
    keyboardType='numeric'
                placeholder='Personal Address Pin Code'
                value={profile.PersonalAddressPinCode}
                onChangeText={text => this._updateProfile({ PersonalAddressPinCode: text })}
                editable={!disabled}
              />
              
              <Picker
                placeholder='Marital Status'
                options={maritalStatus}
                selectedValue={profile.MaritalStatus}
                onValueChange={ (text) => this._updateProfile({ MaritalStatus: text })}
                enabled={!disabled}
              />
              {
                isMarried && <DatePicker
                  defaultDate={profile.WeddingAnniversary}
                  maximumDate={new Date()}
                  placeHolderText="Wedding Anniversary"
      headerText="Wedding Anniversary"
                  onDateChange={date => this._updateProfile({ WeddingAnniversary: date })}
                  disabled={disabled}
style= {{width: '100%' }}
                />
                }
              {
                isMarried &&
                    <TextInput
                      placeholder='Spouse Name'
                      value={profile.SpouseName}
                      onChangeText={text => this._updateProfile({ SpouseName: text })}
                      editable={!disabled}
                    />
                }
              {
                isMarried &&
                    <DatePicker
                      defaultDate={profile.SpouseDOB}
                      maximumDate={new Date()}
                      placeHolderText="Spouse DOB"
          headerText="Spouse DOB"
                      onDateChange={date => this._updateProfile({ SpouseDOB: date })}
                      editable={!disabled}
style= {{width: '100%' }}
                    />
                }
              {
                isMarried &&
                    <TextInput
                      placeholder='Child 1 Name'
                      value={profile.Child1Name}
                      onChangeText={text => this._updateProfile({ Child1Name: text })}
                      editable={!disabled}
                    />
                }
              {
                isMarried &&
                    <DatePicker
                      defaultDate={profile.Child1DOB}
                      maximumDate={new Date()}
                      placeHolderText="Child 1 DOB"
          headerText="Child 1 DOB"
                      onDateChange={date => this._updateProfile({ Child1DOB: date })}
                      disabled={disabled}
style= {{width: '100%' }}
                    />
                }
              {
                isMarried &&
                    <TextInput
                      placeholder='Child 2 Name'
                      value={profile.Child2Name}
                      onChangeText={text => this._updateProfile({ Child2Name: text })}
                      editable={!disabled}
                    />
                }
              {
                isMarried &&
                    <DatePicker
                      defaultDate={profile.Child2DOB}
                      maximumDate={new Date()}
                      placeHolderText="Child 2 DOB"
          headerText="Child 2 DOB"
                      onDateChange={date => this._updateProfile({ Child2DOB: date })}
                      disabled={disabled}
style= {{width: '100%' }}
                    />
                }
              {
                isMarried &&
                    <TextInput
                      placeholder='Child 3 Name'
                      value={profile.Child3Name}
                      onChangeText={text => this._updateProfile({ Child3Name: text })}
                      editable={!disabled}
                    />
                }
              {
                isMarried &&
                    <DatePicker
                      defaultDate={profile.Child3DOB}
                      maximumDate={new Date()}
                      placeHolderText="Child 3 DOB"
          headerText="Child 3 DOB"
                      onDateChange={date => this._updateProfile({ Child3DOB: date })}
                      disabled={disabled}
style= {{width: '100%' }}
                    />
                }
              { !disabled ? (
              <View><TextInput
                secureTextEntry
                placeholder='Password*'
                value={profile.Password}
                onChangeText={text => this._updateProfile({ Password: text })}
                editable={!disabled}
              />
            <TextInput
              secureTextEntry
              placeholder='Confirm Password*'
              value={profile.ConfirmPassword}
              onChangeText={text => this._updateProfile({ ConfirmPassword: text })}
              editable={!disabled}
            /></View>) : null }

            <HeaderedItem header='Shop Pic/ Visiting Card/ Letter Head/ Bill Copy*'>
              <TouchableItem
                style={{ marginTop: 4, marginBottom: 4 }}
                onPress={ () => this.selectPicture('Select a picture', picture => { this.setState({ visitingCardPic: picture })}, visitingCardPic) }
              >
                <Image
                  style={{ flex: 1, height: 120 }}
                  resizeMode='stretch'
                  source={{ uri: visitingCardPicUri }}
                  onError={() => this.setState({ visitingCardPicError: true }) }
                />
              </TouchableItem>
            </HeaderedItem>
            <HeaderedItem header='Aadhar Card'>
              <View style={{ flexDirection: 'row' }}>
                <TouchableItem
                  style={{ flex: 1, marginTop: 4, marginBottom: 4 }}
                  onPress={ () => this.selectPicture('Select a picture', picture => { this.setState({ aadharCardPic: picture })}, aadharCardPic) }
                >
                  <Image
                    style={{ flex: 1, height: 80 }}
                    source={{ uri: aadharCardPicUri }}
                    onError={() => this.setState({ aadharCardPicError: true }) }
                  />
                </TouchableItem>
                <TextInput
                  placeholder='Aadhar Number'
                  style={{ flex: 3, marginLeft: 6 }}
                  value={profile.AadharCardNumber}
                  onChangeText={text => this._updateProfile({ AadharCardNumber: text })}
                  editable={!disabled}
                />
              </View>
            </HeaderedItem>
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
                  value={profile.PanCardNo}
                  onChangeText={text => this._updateProfile({ PanCardNo: text })}
                  editable={!disabled}
                />
              </View>
            </HeaderedItem>

            

            <View style={{ flexDirection: 'row', marginLeft : 15 }}>
              <Text>Product Deals In*</Text>
              <FlatList
                data={this.props.BUCategories}
                extraData={this.state.productDealsIn}
                keyExtractor={(item, index) => `${index}`}
                renderItem={({ item }) => {
                return (
                <CheckBox
                  onPress={ () => !disabled && this._toggleBUCategory(item) }
                  checked={this.state.productDealsIn[item]}
                  label={item}
                />
                )
                }
                }
              />
            </View>
          </View>
  </View>
  </Card>
  </ScrollView>
);
}
}

const mapStateToProps = (state) => {
  const profile = getSignUpProfile(state);
  const stateCityMapping = getStateCityMapping(state);
  const BUCategories = getBUCategories(state);
  const action = getAction(state);
  const signUpStep = getSignUpStep(state);
  const salesExecutiveProfile = getUserProfile(state);
  const bankList = getBankNameList(state);
  return { profile, stateCityMapping, BUCategories, action, signUpStep, salesExecutiveProfile, bankList };
}

const mapDispatchToProps = {
  fetchStateCityMapping,
  fetchBUCategory,
  showErrorMessage,
  signUpRetailer,
  getSignUpStep,
  salesExecutiveSignUpRetailer,
  resetSignUp,
  fetchBankListData,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRegistration);