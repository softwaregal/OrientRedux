/**
 * @component   : OTPVerification
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Thursday Jan 17, 2019 14:33:40 IST
 * @description : OTPVerification
 */

import React, {Component}  from 'react'
import PropTypes from 'prop-types'
import { View, Text, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview';
import { Card } from 'native-base';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import PrimaryButton from '../../components/PrimaryButton';
import CheckBox from '../../components/CheckBox';
import TextInput from '../../components/TextInput';

import { getSignUpProfile, getTermsAndConditions, getSignUpStep } from '../../selectors/SignUpSelector';
import { getUserProfile } from '../../selectors/UserSelector';
import {
  fetchTermsAndConditions,
  verifyOTP,
  signUpRetailer,
  salesExecutiveSignUpRetailer,
  resetSignUp,
} from '../../actions/AuthorizationActions';
import { showErrorMessage } from '../../actions/MessageActions';

import { SignUpStep } from '../../utils';

class OTPVerification extends Component {
  static propTypes = {
  }

  static defaultProps = {
  }

  constructor (props) {
    super(props);
    this.waitingForResponse = false;
    this.state = {
      termsAndConditionsAccepted: false,
      otp: null,
      termsAndConditions: !this.props.navigation.getParam('retailerSignUp')
    }
  }

  componentDidMount() {
    if (this.state.termsAndConditions) {
      this.props.fetchTermsAndConditions();
    }
  }

  componentWillUnmount () {
    this.props.resetSignUp();
  }

  _acceptTNCAndSubmitOPT = () => {
    const { profile } = this.props;
    if (!profile) {
      return;
    }
    const { termsAndConditionsAccepted, otp } = this.state;
    if (!termsAndConditionsAccepted && this.state.termsAndConditions) {
      this.props.showErrorMessage('Please accept Terms & Conditions');
      return;
    }
    if (!otp || otp.length === 0) {
      this.props.showErrorMessage('Please Enter OTP');
      return;
    }

    profile.OTP = otp;
     if (this.props.navigation.getParam('retailerSignUp')) {
      this.props.salesExecutiveSignUpRetailer(profile, this.props.salesExecutiveProfile);
    } else {
      this.props.signUpRetailer(profile);
    }
    this.waitingForResponse= true;
  }

  _resendOTP = () => {
    const { profile } = this.props;
    if (!profile) {
      return;
    }
    const { OTP, ...rest } = profile;
    if (this.props.navigation.getParam('retailerSignUp')) {
      this.props.salesExecutiveSignUpRetailer({ ...rest }, this.props.salesExecutiveProfile);
    } else {
      this.props.signUpRetailer({ ...rest });
    }
  }

  componentDidUpdate(prevProps) {
    console.log("In otpppppppppppppppppppppppppppppppppppppp 1111111 ", this.props.signUpStep,  this.waitingForResponse);
    if (this.props.signUpStep === SignUpStep.SIGNUP_COMPLETE && this.waitingForResponse) {
      console.log("In otpppppppppppppppppppppppppppppppppppppp");
      this.props.navigation.popToTop();
      this.waitingForResponse= false;
    }
  }

  render() {
    return (
            <ScrollView contentContainerStyle={{ flex: 1 }}>
      <KeyboardAwareScrollView contentContainerStyle={{ flex: 1, padding: 16  }}>
          {
          this.state.termsAndConditions && (
          <Card style={{ overflow: 'hidden', flexGrow: 1 }}>
           
           { this.props.termsAndConditionsHtml && <WebView source={{ html: this.props.termsAndConditionsHtml }} /> }
            <CheckBox
              onPress={() => this.setState({ termsAndConditionsAccepted: !this.state.termsAndConditionsAccepted })}
              checked={this.state.termsAndConditionsAccepted}
              label='Accept Terms & Conditions'
            />
          </Card>
          )}
          <TextInput
	    keyboardType='numeric'
            placeholder='Enter OTP'
            value={this.state.otp}
            onChangeText={text => this.setState({ otp: text })}
          />
          <PrimaryButton
            title='Submit'
            onPress={this._acceptTNCAndSubmitOPT}
          />
          <PrimaryButton
            basic
            title='Resend OTP'
            onPress={this._resendOTP}
          />
  </KeyboardAwareScrollView>
          </ScrollView>
    )
  }
}

const mapStateToProps = state => {
  const profile = getSignUpProfile(state);
  const termsAndConditionsHtml = getTermsAndConditions(state);
  const signUpStep = getSignUpStep(state);
  const salesExecutiveProfile = getUserProfile(state);
  return { termsAndConditionsHtml, profile, signUpStep, salesExecutiveProfile };
}

const mapDispatchToProps = {
  fetchTermsAndConditions,
  showErrorMessage,
  verifyOTP,
  getSignUpStep,
  signUpRetailer,
  salesExecutiveSignUpRetailer,
  resetSignUp,
}

export default connect(mapStateToProps, mapDispatchToProps)(OTPVerification);
