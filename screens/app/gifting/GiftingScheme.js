/**
 * @component   : GiftingScheme
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Thursday Jan 24, 2019 17:55:32 IST
 * @description : GiftingScheme
 */

import React, {Component}  from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import { Card } from 'native-base';
import { Col, Row, Grid } from 'native-base';

import TouchableItem from '../../../components/TouchableItem';
import GiftingOptionsRow from './GiftingOptionsRow';

import { headingStyles, regularTextStyles } from '../../../res/Styles';
import Colors from '../../../res/Colors';


export default class GiftingScheme extends Component {
  static propTypes = {
    schemeNameLabel: PropTypes.string,
    showTotal: PropTypes.bool,
    totalLabel: PropTypes.string,
    onItemPress: PropTypes.func,
  }

  static defaultProps = {
    schemeNameLabel: null,
    showTotal: true,
    totalLabel: 'TOTAL',
    onItemPress: null,
  }

  _onItemPress = option => {
    if (this.props.onItemPress) {
      this.props.onItemPress(this.props.scheme, option);
    }
  }

  render() {
    const footerStyle = {
      flex: 1,
      borderTopWidth: 1,
      borderColor: Colors.LIGHT_GREY,
      padding: 4,
      marginLeft: 8,
      marginRight: 8,
      marginTop: 8,
      alignItems: 'center',
    };
    const headerStyle = {
      flex: 1,
      padding: 4
    };
    let total = this.props.scheme.TotalCount;
    if (!total && total !== 0) {
      total = this.props.scheme.options.reduce((total, entry) => (total + entry.value), 0);
    }

    let totalArrayCount = this.props.scheme.options.length;
    let showScheme = false;
    var firstArray = null;
    var secondArray = null;
    var completeArray = Object.assign([], this.props.scheme.options);
    if(totalArrayCount > 4){
      showScheme = true;
      firstArray = completeArray.splice(0,2);
      secondArray = completeArray;
    }else{
      firstArray = completeArray;
    }
    

    return (
      <Card>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <Grid>
            <Row>
              <View style={headerStyle}>
                <Text style={headingStyles.medium}>{this.props.scheme.SchemeName}</Text>
              </View>
            </Row>
              <GiftingOptionsRow options={firstArray} onPress={option => this._onItemPress(option) } />
            {
              showScheme &&
              (
                <View style={{ marginTop: 8}}>
                  <GiftingOptionsRow options={secondArray} onPress={option => this._onItemPress(option) } />
                </View>
              )
                
            }
            
            <Row>
              <View style={footerStyle}>
                <TouchableItem onPress={this._onItemPress}>
                  <Text style={[headingStyles.medium, { padding: 4 }]}>{this.props.totalLabel}  {total}</Text>
                </TouchableItem>
              </View>
            </Row>
          </Grid>
        </View>
      </Card>
      )
  }
}
