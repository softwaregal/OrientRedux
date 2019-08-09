/**
 * @component   : GiftDelivery
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Monday Jan 28, 2019 13:09:38 IST
 * @description : GiftDelivery
 */

import React, {Component}  from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { Card, CardItem } from 'native-base';
import { Grid, Row, Col } from 'native-base';
import Modal from 'react-native-modal';
import { Spinner } from 'native-base';

import { StepIndicator, Step } from '../../../components/StepIndicator';
import TextInput from '../../../components/TextInput';
import PrimaryButton from '../../../components/PrimaryButton';
import Icon from '../../../components/Icon';
import TouchableItem from '../../../components/TouchableItem';
import SignatureCapture from '../../../components/SignatureCapture';

import { getHappyCodeApprovedStatus, getUpdateGiftStatus } from '../../../selectors/GiftingSelector';
import { getUserProfile } from '../../../selectors/UserSelector';
import { showMessage, showErrorMessage } from '../../../actions/MessageActions';
import { verifyHappyCode, resetUpdateGiftingData, seUpdateGiftingStatus } from '../../../actions/GiftingActions';
import { elevation } from '../../../utils';
import { Colors } from '../../../res';
import { headingStyles, regularTextStyles } from '../../../res/Styles';
import { selectPicture, toBase64String } from '../../../camera';
import { getLocation } from '../../../geolocation';

const deviceHeight  = Dimensions.get('window').height;
const deviceWidth  = Dimensions.get('window').width;

const BANNER_HEIGHT = (deviceHeight * 0.2);

class GiftDelivery extends Component {
  static propTypes = {
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);

    this.state = {
      currentStep: 0,
      signature: null,
      invoicePicture: null,
      retailerPicture: null,
      happyCode: null,
      signed: false,
      fetchingLocation: false,
    };
    this.waitingHappyCodeStatus = false;
    this.waitingUpdateGiftStatus = false;
  }

  componentDidMount () {
    this.props.resetUpdateGiftingData();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.happyCodeAprrovedStatus !== this.props.happyCodeAprrovedStatus) {
      if (this.waitingHappyCodeStatus) {
        this.waitingHappyCodeStatus = false;
        if (this.props.happyCodeAprrovedStatus) {
          this.setState({ currentStep: this.state.currentStep + 1 });
        }
      }
    }
    if (prevProps.updateGiftStatus !== this.props.updateGiftStatus) {
      if (this.waitingUpdateGiftStatus) {
        this.waitingUpdateGiftStatus = false;
        if (this.props.updateGiftStatus) {
          this.props.navigation.pop();
        }
      }
    }
  }

  _selectPicture = (title, callback) => {
    selectPicture({
      title: title,
      onSelect: callback,
      onError: message => this.props.showErrorMessage(message),
      showRemove: false,
      mode: 'camera',
    });
  }

  _takeInvoicePicture = () => {
    this._selectPicture('Invoice', picture => this.setState({ invoicePicture: picture }));
  }

  _takeRetailerPicture = () => {
    this._selectPicture('Retailer', picture => this.setState({ retailerPicture: picture }));
  }

  _verifyHappyCode = async () => {
    const { happyCode } = this.state;
    if (!happyCode || happyCode.trim().length === 0) {
      this.props.showErrorMessage('Please enter Happy Code');
      return;
    }
    const { giftDetail, profile } = this.props;
    this.props.verifyHappyCode({
      UserId: profile.RegisteredMobileNo,
      SchemeId: giftDetail.SchemeId,
      GiftingId: giftDetail.GiftingId,
      HappyCode: happyCode
    });
    this.waitingHappyCodeStatus = true;
  }
  _clearSignature = () => {
    if (this.signatureCapture) {
      this.signatureCapture.clear();
    }
  }

  _onClearSignature = () => {
    this.setState({ signature: null, signed: false });
  }
  _onSaveSignature = result => {
    if (result && result.encoded && result.encoded.trim().length > 0) {
      const base64String = `data:image/png;base64,${result.encoded}`;
      this.setState({ signature: base64String, currentStep: this.state.currentStep + 1 });
    } else {
      this.props.showErrorMessage('Please provide retailer\'s signature');
    }
  }
  _completeSignature = () => {
    if (this.signatureCapture && this.state.signed) {
      this.signatureCapture.save();
    } else {
      this.props.showErrorMessage('Please provide retailer\'s signature');
    }
  }
  _completeInvoicePicture = () => {
    if (!this.state.invoicePicture) {
      this.props.showErrorMessage('Please provide invoice picture');
      return;
    }
    this.setState({ currentStep: this.state.currentStep + 1 });
  }
  _completeRetailerPicture = () => {
    if (!this.state.retailerPicture) {
      this.props.showErrorMessage('Please provide retailer\'s picture');
      return;
    }
    this.setState({ currentStep: this.state.currentStep + 1 });
  }

  _getLocation = async callback => {
    try {
      await getLocation(
        () => this.setState({ c: true }),
        (position) => {
          this.setState({ fetchingLocation: false })
          if (callback) {
            const { longitude, latitude } = position.coords;
            callback(longitude, latitude);
          }
        },
        (error) => {
          this.setState({ fetchingLocation: false});
          this.props.showErrorMessage(error.message);
        }
      );
    } catch (error) {
      this.setState({ fetchingLocation: false });
      this.props.showErrorMessage(error.message);
    }
  }
  _submitDetail = () => {
    this._getLocation((longitude, latitude) => {
      const { happyCode, signature, invoicePicture, retailerPicture } = this.state;
      const { giftDetail, profile } = this.props;
      
      this.waitingUpdateGiftStatus = true;
      
      this.props.seUpdateGiftingStatus({
        UserId: profile.RegisteredMobileNo,
        SchemeId: giftDetail.SchemeId,
        GiftingId: giftDetail.GiftingId,
        HappyCode: happyCode,
        DigitalSignatureimage: signature.split(',')[1],
        InvoiceImage: toBase64String(invoicePicture),
        RetailerPhoto: toBase64String(retailerPicture),
        Latitude: latitude,
        Longitude: longitude,
      });
      
    });

    
  }

  render() {
    const { giftDetail, profile } = this.props;

    if (!giftDetail || !profile) {
      return null;
    }
    return (
      <View style={{ flex: 1 }}>
        <Card>
          <CardItem cardBody>
            <Image
              source={{ uri: giftDetail.ProductImageURL }}
              style={styles.banner}
              resizeMode='contain'
            />
          </CardItem>
          <CardItem footer>
            <View
              style={styles.giftDetailContainer}>
              <Text style={[headingStyles.medium, styles.text]}>{giftDetail.RetailerName}</Text>
              <Text style={[regularTextStyles.medium, styles.text]}>{giftDetail.RetailerFirmAddress + "," + giftDetail.RetailerFirmCityName + "," + giftDetail.RetailerFirmStateName}</Text>
              <Text style={[regularTextStyles.medium, styles.text, {marginTop: 4}] }>Distributor: {giftDetail.DistributorName}</Text>
            </View>
          </CardItem>
        </Card>
        { this.state.currentStep < 4 ? (
          <StepIndicator
          currentStep={this.state.currentStep}
          style={{ flexGrow: 1 }}
        >
          <Step label='Happy Code' visible={this.state.currentStep === 0}>
            <View style={styles.stepContainer}>
              <TextInput
                placeholder='Happy Code'
                value={this.state.happyCode}
                onChangeText={text => this.setState({ happyCode: text })}
              />
              <PrimaryButton title='Verify' onPress={this._verifyHappyCode} />
            </View>
          </Step>
          <Step label='Signature' visible={this.state.currentStep === 1}>
            <View style={styles.stepContainer}>
              <SignatureCapture
                onSave={this._onSaveSignature}
                onClear={this._onClearSignature}
                onDrag={() => this.setState({ signed: true })}
                signature={this.state.signature}
                ref={node => this.signatureCapture = node}
              />
            </View>
            <View style={{ flexDirection: 'row' }}>
		<View style={{ flex: 1, marginRight: 8 }}>
              <PrimaryButton title='Clear' onPress={this._clearSignature} />
		</View>
	      <View style={{ flex: 1, marginLeft: 8 }}>
              <PrimaryButton title='Next' onPress={this._completeSignature}  />
		</View>            
		</View>
          </Step>
          <Step label='Invoice' visible={this.state.currentStep === 2}>
            <View style={styles.stepContainer}>
              <TouchableItem onPress={this._takeInvoicePicture}>
                <View style={{ flex: 1, alignItems: 'center'}}>
                  { this.state.invoicePicture ?
                  (<Image source={{ uri: this.state.invoicePicture.uri }} style={styles.picture} resizeMode='contain' />) :
                  (<Image source={{ uri: 'upload' }} style={styles.picture} resizeMode='contain' />)
                  }
                </View>
              </TouchableItem>
            </View>
            <PrimaryButton title='Next' onPress={this._completeInvoicePicture} />
          </Step>
          <Step label="Retailer's Picture" visible={this.state.currentStep === 3}>
            <View style={styles.stepContainer}>
              <TouchableItem onPress={this._takeRetailerPicture}>
                <View style={{ flex: 1 , alignItems: 'center'}}>
                  { this.state.retailerPicture ?
                  (<Image source={{ uri: this.state.retailerPicture.uri }} style={styles.picture} resizeMode='contain' />) :
                  (<Image source={{ uri: 'upload' }} style={styles.picture} resizeMode='contain' />)
                  }
                </View>
              </TouchableItem>
            </View>
            <PrimaryButton title='Next' onPress={this._completeRetailerPicture} />
          </Step>
        </StepIndicator>
        ) : (
          <View style={{ flexGrow: 1, padding: 8 }}>
          <View style={styles.stepContainer}>
            <Grid style={{ justifyContent: 'space-around' }}>
              <Row style={styles.row}>
                <Col style={styles.column}>
                  <Text>Happy Code</Text>
                </Col>
                <Col style={styles.column}>
                  <Text>{this.state.happyCode}</Text>
                </Col>
              </Row>
              <Row style={styles.row}>
                <Col style={styles.column} size={40}>
                  <Text>Signature</Text>
                </Col>
                <Col style={styles.column} size={60}>
                  <Row>
                    <Col>
                      <SignatureCapture
                        signature={this.state.signature}
                        disabled
                      />
                    </Col>
                    <Col>
                      <PrimaryButton basic title='REDO' onPress={() => this.setState({ currentStep: 1, signature: null, signed: false })} />
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row style={styles.row}>
                <Col style={styles.column} size={40}>
                  <Text>Invoice</Text>
                </Col>
                <Col style={styles.column} size={60}>
                  <Row>
                    <Col>
                      { this.state.invoicePicture && <Image source={{ uri: this.state.invoicePicture.uri }} style={[styles.pictureSmall]} resizeMode='contain' />}
                    </Col>
                    <Col>
                      <PrimaryButton basic title='REDO' onPress={() => this.setState({ currentStep: 2 })} />
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col style={styles.column} size={40}>
                  <Text>Retailer's Picture</Text>
                </Col>
                <Col style={styles.column} size={60}>
                  <Row>
                    <Col>
                      { this.state.retailerPicture && <Image source={{ uri: this.state.retailerPicture.uri }} style={[styles.pictureSmall]} resizeMode='contain' /> }
                    </Col>
                    <Col>
                      <PrimaryButton basic title='REDO' onPress={() => this.setState({ currentStep: 3 })} />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Grid>
            </View>
            <PrimaryButton title='Submit' onPress={this._submitDetail} />
          </View>
          )}
       </View>
    )
  }
}

const styles = StyleSheet.create({
  bannerContainer: {
    marginBottom: 16,
    ...elevation(5),
  },
  banner: {
    height: BANNER_HEIGHT,
    maxHeight: 200,
    flex: 1,
  },
  stepContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.BORDER_LIGHT,
    justifyContent: 'flex-start',
    padding: 8,
  },
  picture: {
    width: (deviceWidth * .7),
    height: (deviceHeight * .2),
    margin: 4,
  },
pictureSmall: {
    width: 50,
    height: 50,
    alignSelf: 'center',
    marginTop: 1,
  },
  column: {
    justifyContent: 'center',
  },
  row: {
    borderBottomWidth: 1,
    borderColor: Colors.BORDER_LIGHT,
  }
});

const mapStateToProps = (state, props) => {
  const giftDetail = props.navigation.getParam('giftDetail');
  const happyCodeAprrovedStatus = getHappyCodeApprovedStatus(state);
  const updateGiftStatus = getUpdateGiftStatus(state);
  const profile = getUserProfile(state);

  return { giftDetail, happyCodeAprrovedStatus, profile, updateGiftStatus };
}

const mapDispatchToProps = {
  showErrorMessage,
  verifyHappyCode,
  resetUpdateGiftingData,
  seUpdateGiftingStatus
};

export default connect(mapStateToProps, mapDispatchToProps)(GiftDelivery);

