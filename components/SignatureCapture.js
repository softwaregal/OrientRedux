/**
 * @component   : SignatureCapture
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Tuesday Jan 29, 2019 11:12:44 IST
 * @description : SignatureCapture
 */

import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, TouchableOpacity, Image, Text } from 'react-native';

import RNSignatureCapture from 'react-native-signature-capture';

export default class SignatureCapture extends Component {
  static propTypes = {
    onSave: PropTypes.func,
    onClear: PropTypes.func,
    onDrag: PropTypes.func,
    signature: PropTypes.string,
    disable: PropTypes.bool,
  }

  static defaultProps = {
    onSave: null,
    onClear: null,
    onDrag: null,
    signature: null,
    disable: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      showImage: true,
    }
  }

  clear = () => {
    if (this.props.disable) {
      return;
    }
    const { onClear, onSave } = this.props;
    if (onClear) {
      onClear();
    }
    if (this.signatureCapture) {
      this.signatureCapture.resetImage();
    }
  }
  save = () => {
    if (this.props.disable) {
      return;
    }
    if (this.signatureCapture) {
      this.signatureCapture.saveImage();
    }
  }

  _showSignatureView = () => {
    if (this.props.disable) {
      return;
    }
    if (this.signatureCapture) {
      this.signatureCapture.show(true);
    }
    this.setState({ showImage: false });
  }

  render() {
    const { signature } = this.props;
    return (
      <View style={{ flex: 1 }}>
        {
        (signature && this.state.showImage) || this.props.disable ? (
          <TouchableOpacity onPress={this._showSignatureView} style={styles.signature}>
          <View style={styles.signature}>
            <Image
              resizeMode={'contain'}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
              source={{uri: signature}}
            />
          </View>
        </TouchableOpacity>
        ) : (
        <RNSignatureCapture
          style={styles.signature}
          ref={node => this.signatureCapture = node}
          onSaveEvent={this.props.onSave}
          onDragEvent={this.props.onDrag}
          saveImageFileInExtStorage={false}
          showNativeButtons={false}
          showTitleLabel={false}
        />
        )}
      </View>
      )
  }
}

const styles = StyleSheet.create({
  signature: {
    flex: 1,
  },
});
