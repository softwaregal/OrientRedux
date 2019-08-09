/**
 * @component   : PrimaryButton
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Wednesday Jan 02, 2019 14:46:49 IST
 * @description : PrimaryButton
 */

import React, {Component}  from 'react'
import { View, Button, Text } from 'react-native';
import PropTypes from 'prop-types'

import { buttonStyles } from '../res/Styles';
import { Colors } from '../res';
import TouchableItem from './TouchableItem';

export default class PrimaryButton extends Component {
  static propTypes = {
    disabled: PropTypes.bool,
    basic: PropTypes.bool,
    outlined: PropTypes.bool,
  }

  static defaultProps = {
    disabled: false,
    basic: false,
    outlined: false,
  }
  _onPress = () => {
    if (this.props.disabled || !this.props.onPress) {
      return;
    }
    this.props.onPress();
  }

  render() {
    const { textStyle, onPress, title, style, basic, outlined } = this.props;
    let buttonStyle = buttonStyles.primaryButton;
    let buttonTextStyle = buttonStyles.primaryButtonText;
    let borderStyle = {};
    if (basic || outlined) {
      buttonStyle = buttonStyles.basicButton;
      buttonStyle.color = buttonStyles.primaryButton.backgroundColor;
      buttonTextStyle = buttonStyles.basicButtonText;
      if (outlined) {
        borderStyle = {
          borderColor: buttonStyles.primaryButton.backgroundColor,
          borderWidth: 1,
        }
      }
    }

    return (
      <TouchableItem
        onPress={this._onPress}
      >
        <View style={[buttonStyle, { backgroundColor: buttonStyle.backgroundColor }, borderStyle, style]} >
          <Text style={{...buttonTextStyle, ...textStyle}} >{title}</Text>
        </View>
      </TouchableItem>
    )
  }
}
