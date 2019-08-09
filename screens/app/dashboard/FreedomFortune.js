/**
 * @component   : FreedomFortune
 * @author      : Udgeeth
 * @created     : Tuesday Jan 15, 2019 13:07:58 IST
 * @description : FreedomFortune
 */

import React, {Component}  from 'react'
import PropTypes from 'prop-types'
import { View, Text, Image, Platform} from 'react-native';
import { WebView } from 'react-native-webview';
import { connect } from 'react-redux';
import { getUserProfile } from '../../../selectors/UserSelector';

class FreedomFortune extends Component {
  static propTypes = {
  }

  static defaultProps = {
  }

  render() {
    if (!this.props.profile) {
      return null;
    }
	
    let uri = null;
    if(Platform.OS === 'android'){
	uri = `https://orientconnect.in/SweepStake/GameDiffTime.aspx?MobileNo=${this.props.profile.RegisteredMobileNo}`
    }
    else{
	uri = `https://orientconnect.in/SweepStakeIOS/GameDiffTime.aspx?MobileNo=${this.props.profile.RegisteredMobileNo}`
	
    }
    
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flexGrow: 1, overflow: 'hidden' }}>
        <WebView source={{ uri: uri}} mediaPlaybackRequiresUserAction={false} javaScriptEnabled={true} />
        </View>
      </View>
    )
  }
}

const mapStateToProps = state => {
  const profile = getUserProfile(state);
  return { profile };
}

export default connect(mapStateToProps)(FreedomFortune);
