/**
 * @component   : HeaderedItem
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Tuesday Jan 22, 2019 17:14:11 IST
 * @description : HeaderedItem
 */

import React, {Component}  from 'react'
import PropTypes from 'prop-types'
import { View, Text } from 'react-native';

import Colors from '../res/Colors';

export default class HeaderedItem extends Component {
  static propTypes = {
    header: PropTypes.string,
  }

  static defaultProps = {
    header: null
  }

  render() {
    return (
      <View style={{ marginTop: 8, marginBottom: 8 }}>
        { this.props.header && (<Text
          style={{ alignSelf: 'center', marginBottom: 6, color: Colors.SECONDARY_TEXT, fontSize: 12 }}>
          {this.props.header}
        </Text>) }
        { this.props.children }
      </View>
      )
  }
}


