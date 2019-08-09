/**
 * @component   : GiftingStatusItem
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Friday Jan 25, 2019 13:50:09 IST
 * @description : GiftingStatusItem
 */

import React, {Component}  from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Card } from 'native-base';
import { Col, Row, Grid } from 'native-base';

import TouchableItem from '../../../components/TouchableItem';
import CheckBox from '../../../components/CheckBox';

import { headingStyles, regularTextStyles } from '../../../res/Styles';
import Colors from '../../../res/Colors';
import { getGiftingStatusString, isDistributor } from '../../../utils';
import { GiftingStatus } from '../../../constants';
import GiftingOptionsRow from './GiftingOptionsRow';

import {
  isNSH,
  isRSM,
  isStateHead,
} from '../../../utils';

import { getUserProfile } from '../../../selectors/UserSelector';

export default class GiftingStatusItem extends Component {
  static propTypes = {
    detail: PropTypes.object,
    onPress: PropTypes.func,
    checkable: PropTypes.bool,
    checked: PropTypes.bool,
    showStatus: PropTypes.bool,
    onToggle: PropTypes.func,
  }

  static defaultProps = {
    detail: null,
    onPress: null,
    checkable: false,
    checked: false,
    showStatus: true,
    onToggle: null,
  }

  _onPress = () => {
    const { detail } = this.props;
    if (!detail || !this.props.onPress) {
      return;
    }
    this.props.onPress(detail);
  }

  render() {
    const { detail } = this.props;
    if (!detail) {
      return <View />
    }

    const options = [{
      label: 'Scheme', value: detail.SchemeName },
    ];

    let dateString = null;
    if (detail.Status === GiftingStatus.APPROVED) {
      dateString = detail.ApprovalDate;
    } else if (detail.Status === GiftingStatus.DELIVERED) {
      dateString = detail.DeliveryDate;
    } else if (detail.Status === GiftingStatus.REJECTED) {
      dateString = detail.RejectionDate;
    }
    let statusString = null;
    if (dateString) {
      statusString = `${getGiftingStatusString(detail.Status)} (${dateString})`;
    } else {
      statusString = getGiftingStatusString(detail.Status);
    }
    if (this.props.showStatus) {
      options.push({ label: 'Status', value: statusString });
    }
    const extraOptions = [];
    if (detail.Status === GiftingStatus.REJECTED) {
      extraOptions.push({ value: detail.RejectionRemarks });
    }

    
    
    let toShowHierarchy = false;
    if (isNSH(this.props.profile) || isRSM(this.props.profile) || isStateHead(this.props.profile)) {
	toShowHierarchy = true;
    }

      let userHierarchy = '';
      if (isNSH(this.props.profile)) {
       if (detail.RegionalHeadName) {
         userHierarchy = detail.RegionalHeadName + "(RSH) -> ";
        }

       if (detail.StateHeadName) {
         userHierarchy = userHierarchy + detail.StateHeadName + "(SH) -> ";
       }	

       if (detail.SalesExecutiveName) {
         userHierarchy = userHierarchy + detail.SalesExecutiveName + "(SE)";
       }	

      } else if (isRSM(this.props.profile)) {
       if (detail.StateHeadName) {
         userHierarchy = userHierarchy + detail.StateHeadName + "(SH) -> ";
       }	

       if (detail.SalesExecutiveName) {
         userHierarchy = userHierarchy + detail.SalesExecutiveName + "(SE)";
       }	
      } else if (isStateHead(this.props.profile)) {
       if (detail.SalesExecutiveName) {
         userHierarchy = userHierarchy + detail.SalesExecutiveName + "(SE)";
       }	
      }

      const optionsHierarchy = [{
	      label: 'User Hierarchy', value: userHierarchy },
      ];


    let retailerAddress = null;
    if (detail.RetailerFirmAddress) {
      retailerAddress = detail.RetailerFirmAddress;
    }
    if (detail.RetailerFirmCityName) {
      if (retailerAddress) {
        retailerAddress = retailerAddress + ', ' + detail.RetailerFirmCityName;
      } else {
        retailerAddress = detail.RetailerFirmCityName;
      }
    }
    if (detail.RetailerFirmStateName) {
      if (retailerAddress) {
        retailerAddress = retailerAddress + ', ' + detail.RetailerFirmStateName;
      } else {
        retailerAddress = detail.RetailerFirmStateName;
      }
    }

    if (this.props.checkable) {
      options.push({ value: <CheckBox checked={this.props.checked} onPress={this.props.onToggle} /> });
    }

    const Touchable = this.props.onPress ? TouchableItem : View;
    var dataToShow;
    if(!isDistributor(this.props.profile)){
       dataToShow = `Distributor/RDD/NSM: ${detail.DistributorName}`;
    }
    else{
       dataToShow = `Sales Executive: ${detail.SalesExecutiveName}`;
    }

    return (
      <Card>
        <Touchable onPress={this._onPress}>
          <View style={styles.container} >
            <View style={styles.detailsRow}>
              <Image
                source={{ uri: detail.ProductImageURL }}
                style={styles.thumbnail}
              />
              <View style={styles.detailsColumn}>
                <View>
                  <Text style={headingStyles.small}>{detail.RetailerName}</Text>
                  <Text style={headingStyles.small}>{detail.RetailerFirmName}</Text>
                  { retailerAddress && <Text style={regularTextStyles.small}>{retailerAddress}</Text> }
                  <Text style={regularTextStyles.small}>{`Mobile: ${detail.RetailerMobileNo}`}</Text>
                </View>
                <View style={styles.productDetail}>
                  <Text style={headingStyles.small}>{dataToShow}</Text>
                  <Text style={headingStyles.small}>{detail.ProductName}</Text>
                </View>
              </View>
            </View>
            <GiftingOptionsRow
              style={styles.optionsRow}
              options={options}
            />
            { (extraOptions.length > 0) &&
            (<GiftingOptionsRow
              style={styles.optionsRow}
              options={extraOptions}
            />
            )}
	    
	{ toShowHierarchy &&
	    
          (<GiftingOptionsRow
              style={styles.optionsRow}
              options={optionsHierarchy}
            />
         )}

	 
          </View>
        </Touchable>
      </Card>
      )
  }
}

const styles = StyleSheet.create({
  optionsRow: {
    borderTopWidth: 1,
    borderColor: Colors.LIGHT_GREY,
    paddingTop: 8,
    paddingBottom: 4,
  },
  detailsColumn: {
    flex: 2,
    marginLeft: 8,
  },
  productDetail: {
    marginTop: 8,
  },
  thumbnail: {
    width: 90,
    height: 90
  },
  detailsRow: {
    flexDirection: 'row'
  },
  container: {
    flex: 1,
    padding: 8
  }
});

