/**
 * @component   : SubmitQRCodeStatus
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Friday Jan 11, 2019 16:03:25 IST
 * @description : SubmitQRCodeStatus
 */

import React, {Component}  from 'react'
import PropTypes from 'prop-types'
import { View, Text, FlatList } from 'react-native';
import { Card } from 'native-base';
import { connect } from 'react-redux';

import QRCodeStatus from '../../../components/QRCodeStatus';
import { getScannedAndRewardedQRCodes } from '../../../selectors/QRCodeSelector';
import { clearScannedQRCode, QRCodeActionsType } from '../../../actions/QRCodeActions';

class SubmitQRCodeStatus extends Component {
  static propTypes = {
  }

  static defaultProps = {
  }

  componentWillUnmount() {
    this.props.clearScannedQRCode(QRCodeActionsType.VALIDATE_N_REWARD_QR_CODE);
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
          {
          this.props.scannedQRCodes.length === 0 ? (<Text style={{alignSelf: 'center' }}>No results to display</Text>) :
          (<FlatList
            style={{ flex: 1, padding: 8 }}
            data={this.props.scannedQRCodes}
            keyExtractor={(code, index) => `${index}`}
            renderItem={({ item }) => (<QRCodeStatus code={item} />)}
          />)
          }
        </View>
    )
  }
}

const mapStateToProps = state => {
  const scannedQRCodes = getScannedAndRewardedQRCodes(state);
  return { scannedQRCodes };
}

const mapDispatchToProps = { clearScannedQRCode };

export default connect(mapStateToProps, mapDispatchToProps)(SubmitQRCodeStatus);
