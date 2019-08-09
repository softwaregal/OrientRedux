/**
 * @component   : QRCodeStatus
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Friday Jan 11, 2019 15:45:20 IST
 * @description : QRCodeStatus
 */

import React, {Component}  from 'react'
import PropTypes from 'prop-types'
import { View, Text } from 'react-native';
import { Card } from 'native-base';
import { connect } from 'react-redux';

import ImageButton from './ImageButton';
import Icon from './Icon';
import { headingStyles, regularTextStyles } from '../res/Styles';
import Colors from '../res/Colors';
import { removeQRCode } from '../actions/QRCodeActions';

class QRCodeStatus extends Component {
  static propTypes = {
    code: PropTypes.shape({
      BUName: PropTypes.string,
      BarCode: PropTypes.string,
      Status: PropTypes.string,
    }).isRequired,
    editable: PropTypes.bool
  }

  static defaultProps = {
    code: null,
    editable: false,
  }

  render() {
    const { BUName, BarCode, Status } = this.props.code;
    const { removeQRCode, editable } = this.props;

    return (
      <Card style={{ flex: 1 }}>
        <View style={{ flex: 1, flexDirection: 'row', padding: 4 }}>
          <View style={{ flex: 3 }}>
            <Text style={headingStyles.small}>{BUName ? BUName : '--'}</Text>
            <Text style={headingStyles.small}>{BarCode}</Text>
          </View>
          <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
            { editable && (
            <ImageButton
              size={18}
              padding={0}
              onPress={() => removeQRCode(BarCode)}
            >
              <Icon
                name='close'
                size={18}
              />
            </ImageButton>
            )}
            <Text style={{...headingStyles.small, color: Colors.COLORPRIMARY}}>{Status}</Text>
          </View>
        </View>
      </Card>
      )
  }
}

const mapDispatchToProps = { removeQRCode };

export default connect(null, mapDispatchToProps)(QRCodeStatus);
