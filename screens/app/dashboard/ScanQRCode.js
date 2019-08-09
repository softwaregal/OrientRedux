/**
 * @component   : ScanQRCode
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Thursday Jan 03, 2019 14:19:55 IST
 * @description : ScanQRCode
 */

import React, {Component}  from 'react'
import PropTypes from 'prop-types'
import { StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  Vibration,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { connect } from 'react-redux';
import { Keyboard } from 'react-native';

import { Card } from 'native-base';
import { validateQrCode, clearScannedQRCode, QRCodeActionsType } from '../../../actions/QRCodeActions';
import { getScannedQRCodes } from '../../../selectors/QRCodeSelector';
import { isRequestPending } from '../../../selectors/ApiSelector';
import { getUserProfile } from '../../../selectors/UserSelector';
import { headingStyles, regularTextStyles } from '../../../res/Styles';
import { Colors } from '../../../res';
import Icon from '../../../components/Icon';
import ImageButton from '../../../components/ImageButton';
import PrimaryButton from '../../../components/PrimaryButton';
import QRCodeStatus from '../../../components/QRCodeStatus';
import TextInput from '../../../components/TextInput';
import ScreenName from './ScreenName';
import { showErrorMessage } from '../../../actions/MessageActions';
import { Fonts} from '../../../res/Fonts';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DeviceInfo from 'react-native-device-info';

const SCAN_TYPE_QR = Platform.select({ ios: 'org.iso.QRCode', android: 'QR_CODE' });

const CameraMarker = props => {
  const style = StyleSheet.create({
    container: {
      flex: 1,
      borderWidth: 24,
      borderColor: Colors.BLACK,
      width: props.width,
      height: props.height,
      opacity: 0.3,
    }
  });
  return (
  <View
    style={style.container}
  />)
  }

const ratio = (DeviceInfo.getSystemVersion() === "8.1.0") ? ({ratio : "3:5"}) : ({ratio : "3:5"});
const marginTopRatio = (DeviceInfo.getSystemVersion() === "8.1.0") ? ({marginTop : 24 }) : ({marginTop : 24});

class ScanQRCode extends Component {
  static propTypes = {
  }

  static defaultProps = {
  }

  static navigationOptions = ({ navigation }) => ({
    headerRight: (
      <ImageButton
        source={{ uri: 'done' }}
        onPress={navigation.getParam('submitQrCode') ? navigation.getParam('submitQrCode') : () => {}}
      />)
  });

  constructor(props) {
    super(props);

    const scanType = this.props.navigation.getParam('scanType');
    this.state = {
      qrcodeInput: '',
      keyboardVisible: false,
      scanType: scanType ? scanType : 'qrcode',
      emptyQRCodeErrorMessage: scanType === 'barcode' ? 'Barcode is empty' : 'QR code is empty',
      emptyScannedCodeListErrorMessage: scanType === 'barcode' ? 'Please scan bar codes' : 'Please scan QR codes',
      noValidScannedCodesErrorMessage: scanType === 'barcode' ? 'No valid bar code available' : 'No valid QR code available',
    };
    if (this.props.navigation) {
      this.props.navigation.setParams({ 'submitQrCode': this.submitQrCode });
    }
  }

  addScannedCode = (code, vibrate = true) => {
    if (!code || code.length === 0) {
      this.props.showErrorMessage(this.state.emptyQRCodeErrorMessage);
      return;
    }
    const { scannedQRCodes } = this.props;
    const index = scannedQRCodes.findIndex(currentQrCode => currentQrCode.BarCode === code);
    if (index === -1) {
      this.props.validateQrCode(this.props.profile.RegisteredMobileNo, code);
      if (vibrate) {
        Vibration.vibrate();
      }
    }
  }

  getValidQrCodes = () => {
    const { scannedQRCodes } = this.props;
    if (!scannedQRCodes) {
      return [];
    }
    return scannedQRCodes.filter(code => code.Status === 'CODE VALID');
  }

  submitQrCode = () => {
    const { scannedQRCodes } = this.props;

    if (!scannedQRCodes || scannedQRCodes.length === 0) {
      this.props.showErrorMessage(this.state.emptyScannedCodeListErrorMessage);
      return;
    }

    const validScannedCodes = this.getValidQrCodes();
    if (validScannedCodes.length === 0) {
      this.props.showErrorMessage(this.state.noValidScannedCodesErrorMessage);
      return;
    }

    const code = validScannedCodes.map(entry => entry.BarCode).join(',');
    this.props.validateQrCode(this.props.profile.RegisteredMobileNo, code, true /* reward */);
    this.props.navigation.navigate(ScreenName.DASHBOARD_SUBMIT_QRCODE_STATUS);
  }

  onSuccess = (e) => {
    const { type } = e;
    const { scanType } = this.state;

    if (type === SCAN_TYPE_QR) {
      if (scanType === 'qrcode' || scanType === 'all') {
        this.addScannedCode(e.data);
      }
    } else {
      if (scanType === 'barcode' || scanType === 'all') {
        this.addScannedCode(e.data);
      }
    }
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => this.setState({ keyboardVisible: true }));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => this.setState({ keyboardVisible: false }));
  }

  componentWillUnmount() {
    this.props.clearScannedQRCode(QRCodeActionsType.VALIDATE_QR_CODE);
    this.keyboardDidHideListener.remove();
    this.keyboardDidShowListener.remove();
  }

  render() {
    const deviceWidth = Dimensions.get('window').width;
    const deviceHeight = Dimensions.get('window').height;
    const cameraWidth = deviceWidth * .7;
    const cameraWidth1 = deviceWidth * .8;
    const cameraHeight = cameraWidth;
    let numValidCodes = this.getValidQrCodes().length;
    return (
      <View style={{ flex: 1 }}>
	<KeyboardAwareScrollView contentContainerStyle={{ flex: 1, padding: 10  }}>
        <View style={{ flex: 3, alignItems: 'center' }}>
          
          <QRCodeScanner
            onRead={this.onSuccess}
            cameraProps={{ captureAudio: false}}
            showMarker
            reactivate={!this.props.busy}
            reactivateTimeout={1000}
            vibrate={true}
            topViewStyle={null}
            containerStyle={{ alignItems: 'center', justifyContent: 'center' }}
            cameraStyle={{ width: cameraWidth, height: cameraHeight }}
            customMarker={<CameraMarker width={cameraWidth} height={cameraHeight} />}
          />

        </View>
        <View style={{ flex: 2 , ...marginTopRatio}}>
          <View style={{ flexDirection: 'row', marginLeft: 16, marginRight: 16, alignItems: 'center' }}>
            <PrimaryButton
              style={{ margin: 4, marginTop: 8 }}
              title={ numValidCodes < 10 ? '0'+numValidCodes : numValidCodes }
            />
            <TextInput
              placeholder={ this.state.scanType === 'barcode' ? 'Enter Bar Code' : 'Enter QR Code' }
              value={this.state.qrcodeInput}
              onChangeText={text => this.setState({ qrcodeInput: text })}
              style={{ marginLeft: 16, marginRight: 16, flexGrow: 1 }}
              ref={ node => this.qrcodeInput = node}
            />
            <ImageButton
              size={56}
              style={{ flex: 1 }}
              source={{ uri: 'forward' }}
              onPress={() => {
              this.addScannedCode(this.state.qrcodeInput, false);
              this.setState({ qrcodeInput: '' });
              }}
            />
          </View>
          <View style={{ flexGrow: 1 }}>
            {
            this.props.scannedQRCodes.length === 0 ? (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={regularTextStyles.medium}>Scan code to continue</Text>
            </View>
            ) :
            (<FlatList
              style={{ flex: 1 }}
              data={this.props.scannedQRCodes}
              extraData={this.props.scannedQRCodes}
              keyExtractor={(code, index) => `${index}`}
              renderItem={({ item }) => (<QRCodeStatus code={item} editable />)}
            />)
            }
          </View>
        </View>
	</KeyboardAwareScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => {
  const scannedQRCodes = getScannedQRCodes(state);
  const busy = isRequestPending(state);
  const profile = getUserProfile(state);
  return { scannedQRCodes, busy, profile };
}

const mapDispatchToProps = { validateQrCode, clearScannedQRCode, showErrorMessage };

export default connect(mapStateToProps, mapDispatchToProps)(ScanQRCode);
