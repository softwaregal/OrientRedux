/**
 * @component   : ContactUs
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Tuesday Jan 15, 2019 10:25:53 IST
 * @description : ContactUs
 */

import React, {Component}  from 'react'
import PropTypes from 'prop-types'
import { View, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { Card } from 'native-base';
import { connect } from 'react-redux';

import PrimaryButton from '../../../components/PrimaryButton';

import { getContactUsHtml } from '../../../selectors/helpSelector';
import { getGiftingList } from  '../../../selectors/GiftingSelector';
import { fetchContactUs } from '../../../actions/helpActions';
import { getPointGiftData } from '../../../actions/GiftingActions';
import { showMessage } from '../../../actions/MessageActions';
import ScreenName from './ScreenName';

class ContactUs extends Component {
  static propTypes = {
  }

  static defaultProps = {
  }

  componentDidMount() {
    this.props.getPointGiftData();
  }

  render() {
    return (
      <View style={{ flex: 1, padding: 16  }}>
        <View style={{ flexGrow: 1, overflow: 'hidden' }}>
          <Text>{this.props.giftPointData}</Text>
        </View>
        <PrimaryButton
          title='Query / Suggestions'
          onPress={() => this.props.navigation.push(this.props.navigation.getParam('complaintScreen'))}
        />
      </View>
    )
  }
}

const mapStateToProps = state => {
  const giftPointData = getPointGiftData(state);
  return { giftPointData };
}

const mapDispatchToProps = { getPointGiftData, showMessage }

export default connect(mapStateToProps, mapDispatchToProps)(ContactUs);
