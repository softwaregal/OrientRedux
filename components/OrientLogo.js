/**
 * @component   : OrientLogo
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Monday Jan 07, 2019 16:33:30 IST
 * @description : OrientLogo
 */

import React, {Component}  from 'react'
import PropTypes from 'prop-types'
import { View, Image, StyleSheet, Platform } from 'react-native';

import { Colors } from '../res';

export default class OrientLogo extends Component {
  static propTypes = {
    size: PropTypes.oneOf(['small', 'large', 'huge']),
  }

  static defaultProps = {
    size: 'huge'
  }

  constructor(props) {
    super(props);

    let dimens = 140;
    const { size } = this.props;
    if (size === 'small') {
      dimens = 96;
    } else if (size === 'large') {
      dimens = 120;
    } else {
      dimens = 140;
    }

    
    const shadow = {  
	shadowOffset: { width: 0, height: 0 },  
	      shadowColor: '#aaa',  
	      shadowOpacity: 1,  
	      elevation: 3,  
	      zIndex:999
    }  
    
    const styles = StyleSheet.create({
      logo: {
	width: dimens,
	height: dimens,
        borderRadius: dimens / 2
      },
      container: {
        alignSelf: 'center',
        borderRadius: dimens / 2,
        ...Platform.select({ android: { elevation: 10 }, ios: shadow }),
        backgroundColor: Colors.WHITE,
        margin: 8,
      }
    });

    this.state = { styles };
  }

  render() {
    const { logo, container } = this.state.styles;
    return (
      <View style={container}>
        <Image source={{ uri: 'orient' }} style={logo} resizeMode={Platform.select({ android: null, ios: 'center' }) }/>
      </View>
    )
  }
}

