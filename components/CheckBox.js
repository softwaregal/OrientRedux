/**
 * @component   : CheckBox
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Thursday Jan 17, 2019 14:37:24 IST
 * @description : CheckBox
 */

import React, {Component}  from 'react'
import PropTypes from 'prop-types'
import { View, Text } from 'react-native';
import { CheckBox as NativeCheckBox } from 'native-base';
import { Colors } from '../res';
import { regularTextStyles } from '../res/Styles';

import TouchableItem from './TouchableItem';

export default class CheckBox extends Component {
  static propTypes = {
    onPress: PropTypes.func,
    checked: PropTypes.bool,
    label: PropTypes.string,
    color: PropTypes.string,
    tickColor: PropTypes.string,
  }

  static defaultProps = {
    color: Colors.COLORPRIMARY,
    tickColor: Colors.WHITE,
  }

  render() {
    return (
      <TouchableItem
        onPress={this.props.onPress}
      >
        <View style={{ flexDirection: 'row', padding: 8 }}>
          <NativeCheckBox
            onPress={this.props.onPress}
            color={this.props.color}
            checked={this.props.checked}
            checkboxTickColor= {this.props.tickColor}
          />
          <Text style={[regularTextStyles.small, { fontSize: 14, marginLeft: 20 }]} >{this.props.label}</Text>
        </View>
      </TouchableItem>
    )
  }
}


