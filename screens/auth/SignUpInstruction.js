/**
 * @component   : UserRegistration
 * @author      : Vivek V Singh
 * @created     : Monday Jan 07, 2019 16:31:07 IST
 * @description : UserRegistration
 */

import React, {Component}  from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text, Dimensions, Platform } from 'react-native';
import { connect } from 'react-redux';
import { WebView } from 'react-native-webview';
import { Card, CardItem } from 'native-base';

import { Colors, Fonts } from '../../res';
import { LayoutSize } from '../../res/Dimens';

import PrimaryButton from '../../components/PrimaryButton';
import { headingStyles, linkStyles } from '../../res/Styles';
import ScreenName from './ScreenName';

import { fetchSignUpInstruction } from '../../actions/AuthorizationActions';
import { getSignUpInstructions } from '../../selectors/SignUpSelector';


class SignUpInstruction extends Component {
  static propTypes = {
  }

  static defaultProps = {
  }

  componentDidMount(){
    this.props.fetchSignUpInstruction();
  }

  render() {
    return (
      <View style={{ flex: 1, padding: 16  }}>
        <View style={{ flexGrow: 1, overflow: 'hidden' }}>
         { this.props.signUpInstruction &&  
            (<WebView 
            source={{ html: this.props.signUpInstruction }} /> )}
         
        </View>
        <PrimaryButton
          title='Next'
          onPress={() => this.props.navigation.push(ScreenName.AUTH_SIGNUP)}
        />
      </View>
      );
  }
}

const mapStateToProps = (state) => {
  const signUpInstruction = getSignUpInstructions(state);
  return { signUpInstruction };
}

const mapDispatchToProps = { fetchSignUpInstruction };

export default connect(mapStateToProps, mapDispatchToProps)(SignUpInstruction);
