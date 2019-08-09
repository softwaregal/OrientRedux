/**
 * @component   : GiftDeliveryStatus
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Wednesday Jan 30, 2019 18:55:41 IST
 * @description : GiftDeliveryStatus
 */

import React, {Component}  from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import { Grid, Row, Col } from 'native-base';
import { connect } from 'react-redux';

import ImagePageViewer from '../../../components/ImagePageViewer';
import StarRating from '../../../components/StarRating';
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

class GiftDeliveryStatus extends Component {
  static propTypes = {
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);

    this.state = {};
    const images = [];

    const { giftDetail } = this.props;
    if (giftDetail) {
      images.push(giftDetail.RetailerPhoto);
      images.push(giftDetail.ProductImageURL);
      images.push(giftDetail.DigitalSignatureimage);
      images.push(giftDetail.InvoiceImage);
    }
    this.state.images = images;
  }

  render() {
    const { giftDetail } = this.props;
    if (!giftDetail) {
      return null;
    }
    return (
      <View style={styles.container}>
        <ImagePageViewer
          images={this.state.images.map(url => (url ? { uri: url } : null))}
        />
        <View style={styles.detail}>
            <StatusItem label='Delivery Date' value={giftDetail.DeliveryDate} />
            <StatusItem label='Retailer Firm' value={giftDetail.RetailerFirmName} />
            <StatusItem label='Retailer Mobile' value={giftDetail.RetailerMobileNo} />
            <StatusItem label='Scheme' value={giftDetail.SchemeName} />
            <StatusItem label='Product' value={giftDetail.ProductName} />
            <StatusItem label='Date of Approval' value={giftDetail.ApprovalDate} />
            <StatusItem label='Remarks' value={giftDetail.Remarks} />
            <StatusItem label='Rating' value={<StarRating rating={parseFloat(giftDetail.Rating)} disabled />} />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
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

const mapStateToProps = (state, props) => {
  const giftDetail = props.navigation.getParam('giftDetail');

  /*
  const giftDetail = {
    "GiftingId": "5",
    "SchemeId": "1",
    "SchemeName": "Promotion Camp",
    "DistributorName": "sonu123",
    "RewardName": "fan",
    "RewardImageURL": "http://orientdemo.netcarrots.in/Admin/ProductImages/0dec8293-e67e-4804-a706-d16857968ef8we.jpg",
    "Status": "Pending",
    "Rating": "2.5",
    "Comment": "Good ",
    "SchemeYear": "2019",
    "DigitalSignatureimage": "http://orientdemo.netcarrots.in/Admin/ProductImages/0dec8293-e67e-4804-a706-d16857968ef8we.jpg",
    "InvoiceImage": "http://orientdemo.netcarrots.in/Admin/ProductImages/0dec8293-e67e-4804-a706-d16857968ef8we.jpg",
    "RetailerPhoto": "http://orientdemo.netcarrots.in/Admin/ProductImages/0dec8293-e67e-4804-a706-d16857968ef8we.jpg"
  }
  */

  return { giftDetail };
}

export default connect(mapStateToProps)(GiftDeliveryStatus);
