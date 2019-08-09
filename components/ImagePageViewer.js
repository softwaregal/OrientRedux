/**
 * @component   : ImagePageViewer
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Wednesday Jan 30, 2019 19:03:50 IST
 * @description : ImagePageViewer
 */

import React, {Component}  from 'react'
import PropTypes from 'prop-types'
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { IndicatorViewPager, PagerDotIndicator} from 'rn-viewpager';

const deviceHeight  = Dimensions.get('window').height;

export default class ImagePageViewer extends Component {
  static propTypes = {
    images: PropTypes.arrayOf(PropTypes.object),
    loadingPlaceholder: PropTypes.object,
    noImagePlaceHolder: PropTypes.object,
  }

  static defaultProps = {
    images: [],
    loadingPlaceholder: { uri: 'no_image' },
    noImagePlaceHolder: { uri: 'no_image' },
  }

  constructor (props) {
    super(props);

    this.state = {
      images: [],
    };

    const { images } = this.props;
    if (images && images.length > 0) {
      this.state.images = Object.assign([], images);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.images !== this.props.images) {
      const { images } = this.props;
      if (images && images.length > 0) {
        this.setState({ images: Object.assign([], images) });
      } else {
        this.setState({ images: [] });
      }
    }
  }

  _setError = index => {
    const { images } = this.state;
    images[index] = this.props.noImagePlaceHolder;
    this.setState({ images });
  }

  render() {
    const { style, images, loadingPlaceholder, noImagePlaceHolder, ...rest } = this.props;
    const imageList = this.state.images || [];
    return (
      <IndicatorViewPager
        style={[styles.viewer, style]}
        autoPlayEnable={true}
        indicator={<PagerDotIndicator pageCount={imageList.length} />}
        {...rest}
      >
      {
        imageList.map((source, index) => (
          <Image
            key={index}
            style={styles.image}
            source={source ? source : noImagePlaceHolder}
            resizeMode='cover'
            onError={() => this._setError(index)}
          />
          )
          )
      }
      </IndicatorViewPager>
    )
  }
}

const styles = StyleSheet.create({
  viewer: {
    height: deviceHeight * 0.3,
    maxHeight: 200,
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
