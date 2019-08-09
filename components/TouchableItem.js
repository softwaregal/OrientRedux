import React, {Component}  from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, Text, View, Platform, TouchableNativeFeedback, TouchableOpacity, Button } from 'react-native';

import { buttonStyles } from '../res/Styles';
import { Colors } from '../res';

export default class TouchableItem extends Component {
  static propTypes = {
  }

  static defaultProps = {
  }
  constructor(props) {
    super(props);
  }

  render() {
    if(Platform.OS === 'android'){
      return (
        <TouchableNativeFeedback
          background={TouchableNativeFeedback.SelectableBackground()}
          {...this.props}
        />
      )
    }else{
      return (
        <TouchableOpacity
          {...this.props}
        />
        )
    }
  }

};
