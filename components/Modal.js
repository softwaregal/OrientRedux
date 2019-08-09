/**
 * @component   : Modal
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Monday Jan 14, 2019 15:39:08 IST
 * @description : Modal
 */

import React, {Component}  from 'react'
import PropTypes from 'prop-types'
import { Modal as NativeModal, View } from 'react-native';

export default class Modal extends Component {
  static propTypes = {
  }

  static defaultProps = {
  }

  render() {
    const { children, ...rest } = this.props;
    return (
      <NativeModal
        style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}
        animationType='fade'
        transparent
        onRequestClose={() => { }}
        {...rest}
      >
        <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
          <View style={{ backgroundColor: 'white', elevation: 100}}>
            { children }
          </View>
        </View>
      </NativeModal>
      )
  }
}


