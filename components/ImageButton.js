/**
 * @component   : ImageButton
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Thursday Jan 03, 2019 12:45:53 IST
 * @description : ImageButton
 */

import React, {Component}  from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, Text, View, Image } from 'react-native';
import TouchableItem from './TouchableItem';
import { Colors, Fonts } from '../res';

export default class ImageButton extends Component {
  static propTypes = {
    source: PropTypes.any,
    backgroundColor: PropTypes.string,
    tintColor: PropTypes.string,
    circular: PropTypes.bool,
    cornerRadius: PropTypes.number,
    label: PropTypes.string,
    size: PropTypes.number,
    padding: PropTypes.number,
    onPress: PropTypes.func,
    textColor: PropTypes.string,
    raised: PropTypes.bool,
    labelStyle: PropTypes.object,
    clipImage: PropTypes.bool,
  }

  static defaultProps = {
    source: null,
    backgroundColor: null,
    tintColor: null,
    circular: false,
    cornerRadius: 0,
    label: '',
    size: 40,
    padding: 4,
    onPress: null,
    textColor: Colors.PRIMARY_TEXT,
    raised: false,
    labelStyle: {},
    clipImage: false,
  }
  constructor(props) {
    super(props);

    const padding = this.props.children ? 0 : this.props.padding;
    const styles = StyleSheet.create({
      container: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: this.props.backgroundColor,
        borderRadius: (this.props.circular ? this.props.size / 2 : 0),
        width: this.props.size,
        height: this.props.size,
        elevation: this.props.raised ? 1.5 : 0,
      },
      image: {
        width: this.props.size - (2 * padding),
        height: this.props.size - (2 * padding),
        borderRadius: (this.props.circular && this.props.clipImage ? (this.props.size - (2 * padding)) / 2 : 0),
        alignSelf: 'center',
        tintColor: this.props.tintColor,
      },
      label: {
	textAlign: 'center', 
        color: this.props.textColor,
        alignSelf: 'center',
        marginTop: 16,
      },
      children: {
        alignContent: 'center',
        justifyContent: 'center',
        alignSelf: 'center'
      },
    });

    this.state = {
      styles: styles,
    };
  }

  render() {
    const { children, labelStyle, onLoadEnd, onError, onLoadStart, style, ...rest } = this.props;
    let ls = Object.assign({}, this.state.styles.label, labelStyle);
    const Label = () => (this.props.label ? (<Text style={ls}>{this.props.label}</Text>) : (<View />));
    return (
      <TouchableItem
        onPress={this.props.onPress}>
      <View>
        <View style={[this.state.styles.container, style]} {...rest} >
          {
          (children ? (<View style={this.state.styles.children}>{children}</View>) :
          <Image
            source={this.props.source}
            style={this.state.styles.image}
            onError={onError}
            onLoadStart={onLoadStart}
            onLoadEnd={onLoadEnd}
          />)
          }
        </View>
	
        <Label />
	
      </View>
      </TouchableItem>
    )
  }
}
