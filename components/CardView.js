/**
 * @component   : CardView
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Wednesday Jan 02, 2019 11:19:33 IST
 * @description : CardView
 */

import React, {Component}  from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, Text, View } from 'react-native';
import { Card } from 'native-base';

import Colors from '../res/Colors';

export default class CardView extends Component {
  static propTypes = {
  }

  static defaultProps = {
  }
  constructor(props) {
    super(props);
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        elevation: 2,
      },
    });
    this.state = { styles: styles }
  }

  render() {
    return (
      <View style={this.props.style} >
        {this.props.children}
      </View>
    )
  }
};

