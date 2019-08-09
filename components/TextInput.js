import React, {Component}  from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableOpacity,
  Button,
  TextInput as NativeInput,
  Animated,
} from 'react-native';
import { Input, Item, Label, StyleProvider } from 'native-base';
import { buttonStyles, regularTextStyles } from '../res/Styles';
import { Colors } from '../res';
import { Fonts } from '../res';
import getTheme from '../native-base-theme/components';

const TOP_PADDING = 14;

export default class TextInput extends Component {
  static propTypes = {
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);

    this.state = {
      isFocused: false,
    };
    this._animatedIsFocused = new Animated.Value((!this.props.value || this.props.value === '') ? 0 : 1);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isFocused === prevState.isFocused
      && this.props.value === prevProps.value) {
      return;
    }
    Animated.timing(this._animatedIsFocused, {
      toValue: (this.state.isFocused || (this.props.value && this.props.value.length > 0)) ? 1 : 0,
      duration: 200,
    }).start();
  }


  handleFocus = () => this.setState({ isFocused: true });
  handleBlur = () => this.setState({ isFocused: false });

  render() {
    const { style, placeholder, label, ...rest } = this.props;
    const placeHolderText = placeholder || label;
    const { isFocused } = this.state;

    const labelStyle = {
      position: 'absolute',
      top: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [TOP_PADDING, 0],
      }),
      fontSize: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [12, 12],
      }),
    };

    return(
      <View style={[styles.container, style]} >

        <Animated.Text style={[styles.label, labelStyle]}>
          {placeHolderText}
        </Animated.Text>
        <NativeInput
          style={[regularTextStyles.small, styles.input]}
	  textAlign='center'
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          {...rest}
        />
      </View>
      )
  }
};

const styles = StyleSheet.create({
  container: {
    paddingTop: TOP_PADDING,
    marginTop: 10,
    marginBottom: 6
  },
  
  label: {
    textAlign: 'center',
    width: '100%',
    left: 0,
    fontSize: 12
     },
  input: {
    width: '100%',
    color: Colors.BLACK,
    fontSize: 14,
    paddingTop: 0,
    paddingBottom: 0,
    borderBottomWidth: 1,
    borderColor: Colors.SECONDARY_TEXT,
  }
});
