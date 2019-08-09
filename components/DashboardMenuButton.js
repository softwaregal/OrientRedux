/**
 * @component   : DashboardMenuButton
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Tuesday Jan 15, 2019 17:18:07 IST
 * @description : DashboardMenuButton
 */

import React, {Component}  from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, Text, View, Image, ScrollView, FlatList, Dimensions } from 'react-native';
import { Card, Container } from 'native-base';

import ImageButton from './ImageButton';

import { Colors, Fonts } from '../res';

const deviceWidth  = Dimensions.get('window').width;

const CONTAINER_WIDTH = (deviceWidth * 0.85) / 2;
const CONTAINER_HEIGHT = (CONTAINER_WIDTH * 1.2);

export default class DashboardMenuButton extends Component {
  static propTypes = {
    circular: PropTypes.bool,
    padding: PropTypes.number,
    tintColor: PropTypes.string,
  }

  static defaultProps = {
    circular: true,
    padding: 12,
    tintColor: Colors.WHITE,
  }

  render() {
    if (!this.props.source || !this.props.source.uri) {
      return <View style={{ margin: 8, flex: 1 }} />
    }
    return (
     <View style={{ margin: 4, flex: 1, alignItems: 'center' }}>
        <Card style={{padding: 4, width: CONTAINER_WIDTH, height: CONTAINER_HEIGHT }}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ImageButton
              {...this.props}
              backgroundColor={Colors.COLORPRIMARY}
              tintColor={this.props.tintColor}
              circular={this.props.circular}
              size={96}
              padding={this.props.padding}
              labelStyle={{ fontFamily: Fonts.BOLD }}
            />
          </View>
        </Card>
    </View>
    )
  }
}


