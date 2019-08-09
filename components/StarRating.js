/**
 * @component   : StarRating
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Thursday Jan 31, 2019 12:57:18 IST
 * @description : StarRating
 */

import React, {Component}  from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, StyleSheet, TouchableHighlight,Dimensions } from 'react-native';
import Stars from 'react-native-stars';

import Icon from './Icon';
import Colors from '../res/Colors';
import { regularTextStyles } from '../res/Styles';

export default class StarRating extends Component {
  static propTypes = {
    rating: PropTypes.number,
    comment: PropTypes.string,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
  }

  static defaultProps = {
    rating: 0,
    comment: null,
    onChange: null,
    disabled: false,
  }

  constructor(props) {
    super(props);

    this.state = {
      show: true,
    };
  }

  refresh = () => {
    this.setState({ show: false });

    const timer = setTimeout(() => {
      this.setState({ show: true });
      clearTimeout(timer);
    }, 100);
  }

  render() {
    if (!this.state.show) {
      return null;
    }
    const {
      style,
      rating,
      comment,
      onChange,
      count,
      starSize,
      half,
      full,
      disabled,
      ...rest
    } = this.props;

    let size = starSize || 40;
  const commentComponent = (comment && comment.length > 0) ? (
    <Text
      style={[regularTextStyles.small, styles.comment]}
    >
      {comment}
    </Text>
    ) : null;
    return (
      <View style={[styles.container, style]} textAlign='center'>
        { commentComponent }
      <Stars
        default={rating}
        count={count || 5}
        half={true}
        full={true}
        starSize={size}
        disabled={disabled}
        update={onChange}
        fullStar={<Icon size={size} name={'star'} style={[styles.starStyle]}/>}
        emptyStar={<Icon size={size} name={'star-outline'} style={[styles.starStyle, styles.emptyStarStyle]}/>}
        halfStar={<Icon size={size} name={'star-half'} style={[styles.starStyle]}/>}
      />
    </View>
    )
  }
}

const styles = StyleSheet.create({
  starStyle: {
    color:Colors.COLORPRIMARY,
  },
  emptyStarStyle: {
    color:Colors.COLORPRIMARY
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  comment : {
  },
});
