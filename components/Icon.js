/**
 * @component   : Icon
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Friday Jan 04, 2019 16:59:29 IST
 * @description : Icon
 */

import React, {Component}  from 'react'
import PropTypes from 'prop-types'
import  { Platform }  from 'react-native'
import Ionicon from 'react-native-vector-icons/Ionicons';

export default class Icon extends Component {
  render() {
    const { name, ...rest } = this.props;
  const iconName = Platform.select({
    ios: 'ios-' + name,
    android: 'md-' + name
  });
    return (<Ionicon name={iconName} { ...rest } />)
  }
}


