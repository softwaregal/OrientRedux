/**
 * @component   : PreScannedQRCodeList
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Wednesday May 22, 2019 17:21:05 IST
 * @description : PreScannedQRCodeList
 */

import React, {Component}  from 'react'
import PropTypes from 'prop-types'
import { View, Button, Text, StyleSheet, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { Card, Grid, Row, Col } from 'native-base';


import {
 getQRCodePreScanDetails,
} from '../../../selectors/QRCodeSelector';

import Colors from '../../../res/Colors';
import {Fonts} from '../../../res/Fonts';
import { headingStyles, regularTextStyles } from '../../../res/Styles';

const StatusItem = props => {
  let ValueComponent = null;
  if (typeof props.value === 'string') {
    ValueComponent = (<Text style={regularTextStyles.medium}>{props.value}</Text>);
  } else {
    ValueComponent = props.value;
  }
  return (
    <Row>
      <Col style={styles.column} size={2}>
        <Text style={headingStyles.small}>{props.label}</Text>
      </Col>
      <Col style={styles.column} size={3}>
        {ValueComponent}
      </Col>
    </Row>
    )
}

class PreScannedQRCodeList extends Component {
  static propTypes = {
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
  }

  render() {
    if (!this.props.qrPreScanDetails) {
      return null;
    }
    const PreScanDetail = props => {
      return (
        <Card>
          <View style={styles.detail}>
            <Text style={{ ...headingStyles.medium, fontFamily: Fonts.OPENSANS_SEMIBOLD, fontSize: 18, marginLeft:4, marginRight:4 }}>{`${props.ScanBy} (${props.MobileNumberofRetailer})`}</Text>
            <Text style={{ ...headingStyles.low, fontFamily: Fonts.OPENSANS_SEMIBOLD, fontSize: 14, marginLeft:4, marginRight:4, marginTop: 10, marginBottom: 10 }}>{`${props.RetailerFirmName}, ${props.Address}`} </Text>
            <Text style={{ ...headingStyles.low, fontFamily: Fonts.OPENSANS_SEMIBOLD, fontSize: 14, marginLeft:4, marginRight:4, marginBottom: 10 }}>{`${props.BUDescription}`} </Text>
            
            <View
              style={{marginBottom: 10,
                borderBottomColor: 'orange',
                borderBottomWidth: 1,
              }}
            />

            <View style={{ flexDirection: 'row', flex: 1}}>
              <Text style={{ ...headingStyles.medium, fontFamily: Fonts.OPENSANS_SEMIBOLD, fontSize: 16, marginLeft:4, marginRight:4 }}>{`#${props.CouponCode}`} </Text>
              <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end' }}>
                <Text style={{...headingStyles.medium, fontFamily: Fonts.OPENSANS_SEMIBOLD, fontSize: 16, marginLeft:4, marginRight:4 ,textAlign: 'right' }} >{`${props.DateTimeofScanning}`} </Text>
              </View>
            </View>
            </View>

            
        </Card>
        );
    }
    const filtered = this.props.qrPreScanDetails.filter(d => d.BUName === this.props.navigation.getParam('BUName'));
    return (
      <View style={{ flex: 1, padding: 8 }}>
      <FlatList
        data={filtered}
        keyExtracter={(item, index) => index}
        renderItem={({item}) => <PreScanDetail {...item} />}
      />
      </View>
      );
  }
}




const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#C1C0B9' },
  text: { margin: 6, textAlign: 'center' , fontWeight: '100', fontFamily: Fonts.OPENSANS_SEMIBOLD },
  row: { flexDirection: "row", flex: 1, backgroundColor: '#E7E6E1' },
  container: {
    flex: 1,
  },
  detail: {
    flexGrow: 1,
    padding: 16
  },
  column: {
    justifyContent: 'center',
  }
});

const mapStateToProps = state => {
  const qrPreScanDetails = getQRCodePreScanDetails(state);
  return { qrPreScanDetails };
}

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(PreScannedQRCodeList);
