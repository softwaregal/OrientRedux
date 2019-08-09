/**
 * @component   : Picker
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Wednesday Jan 16, 2019 14:07:04 IST
 * @description : Picker
 */

import React, {Component}  from 'react'
import PropTypes from 'prop-types'
import { View, Picker as NativePicker, PickerIOS, Text, Platform }  from 'react-native';
import { Picker as NativeBasePicker, Item }  from 'native-base';
import { Dropdown } from 'react-native-material-dropdown';

import TextInput from './TextInput';
import Colors from '../res/Colors';
import { Fonts } from '../res';

export default class Picker extends Component {
  static propTypes = {
    options: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string
    })),
    selectedValue: PropTypes.string,
    onValueChange: PropTypes.func,
    placeholder: PropTypes.string,
    enabled: PropTypes.bool,
  }

  static defaultProps = {
    options: [],
    selectedValue: null,
    onValueChange: null,
    placeholder: 'Select',
    enabled: true,
  }

      renderBaseFromBaseClass = ({ title, label }) => {
	return <TextInput placeholder={label} value={title} editable={false} />;

      }

  render() {
    const { options, selectedValue, onValueChange, placeholder, enabled } = this.props;
    const PlatformPicker = Platform.select({ ios: PickerIOS, android: NativePicker });
    if (!enabled) {
      return <TextInput placeholder={this.props.placeholder} value={this.props.selectedValue} editable={enabled} />
    }
    return (
      <Dropdown
	renderBase = {this.renderBaseFromBaseClass}
	textAlign='center'
        label={this.props.placeholder}
	alignItems='center'
        data={this.props.options}
        onChangeText={this.props.onValueChange}
        value={this.props.selectedValue ? this.props.selectedValue : ''}
        disabled={!enabled}
        baseColor={Colors.SECONDARY_TEXT}
        fontSize={12}
        style={{ fontSize: 14, fontFamily: Fonts.OPENSANS_REGULAR}}
        itemTextStyle={{ fontSize: 14 }}
	labelTextStyle ={{ textAlign: 'center', width: '100%', backgroundColor: 'orange'}}
      />
      )
  }
}
