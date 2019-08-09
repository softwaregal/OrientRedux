/**
 * @component   : QRCodeHistoryTimewise
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Monday Jan 14, 2019 13:00:25 IST
 * @description : QRCodeHistoryTimewise
 */

import React, {Component}  from 'react'
import PropTypes from 'prop-types'
import { View } from 'react-native';
import { connect } from 'react-redux';

import QRCodeHistoryList from '../../../components/QRCodeHistoryList';

import { getQRCodeTimewiseStatus } from '../../../selectors/QRCodeSelector';
import { getUserProfile } from '../../../selectors/UserSelector';
import {
  clearScannedQRCode,
  QRCodeActionsType
} from '../../../actions/QRCodeActions';

class QRCodeHistoryTimewise extends Component {
  static propTypes = {
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
  }

  componentWillUnmount() {
    this.props.clearScannedQRCode(QRCodeActionsType.GET_SCANNED_QR_CODE_TIMEWISE_STATUS);
  }

  render() {
    if(!this.props.history)
    {
      return null;
    }
    const showTotalPoint = this.props.navigation.getParam("showPoints");
    const filteredList = this.props.history.filter(args => args.PointsEarned != 0 );
    return (
      <View
      style={ {margin:12} }
      >
      {
        showTotalPoint ? (
          <QRCodeHistoryList
           data={filteredList}
           mode='detail'
           detailFieldName={'PointsEarned'}
           detailFieldLabel={'Total Points'}  />
           )
          :
          (
            <QRCodeHistoryList data={this.props.history} mode='detail' />)
      }
      
      </View>
    )
  }
}

const mapStateToProps = state => {
  const profile = getUserProfile(state);
  const history = getQRCodeTimewiseStatus(state);
  return { profile, history };
}

const mapDispatchToProps = { clearScannedQRCode };

export default connect(mapStateToProps, mapDispatchToProps)(QRCodeHistoryTimewise);
