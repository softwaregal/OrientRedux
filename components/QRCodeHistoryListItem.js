/**
 * @component   : QRCodeHistoryListItem
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Friday Jan 11, 2019 18:05:46 IST
 * @description : QRCodeHistoryListItem
 */

import React, {Component}  from 'react'
import PropTypes from 'prop-types'
import { View, Text } from 'react-native';
import { Card } from 'native-base';

import { headingStyles, regularTextStyles } from '../res/Styles';
import { Fonts } from '../res/Fonts';
import TouchableItem from './TouchableItem';
const QRCodeHistoryListItemPart = props => {
  return (
    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around' }}>
      <Text style={{ ...headingStyles.large, fontSize: 14, fontFamily: Fonts.OPENSANS_REGULAR, textAlign: 'center' }} >{props.title}</Text>
      <Text style={{ ...regularTextStyles.small, fontWeight: 'bold', textAlign: 'center' }} >{props.value}</Text>
    </View>
  );
}

export default class QRCodeHistoryListItem extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    onPress: PropTypes.func,
    mode: PropTypes.oneOf(['date', 'time', 'detail']),
    valueFieldName: PropTypes.string,
    valueFieldLabel: PropTypes.string,
    detailFieldName: PropTypes.string,
    detailFieldLabel: PropTypes.string,
  }

  static defaultProps = {
    data: null,
    onPress: null,
    mode: 'date',
    valueFieldName: 'TotalCouponCode',
    valueFieldLabel: 'TOTAL COUNT',
    detailFieldName: 'Status',
    detailFieldLabel: 'STATUS',
  }

  renderDetail = () => {
    const { data } = this.props;
    return (
      <View>
        <Text style={headingStyles.medium}>{`${data.BUName} (${data.ProductType})`}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ ...headingStyles.medium, fontFamily: Fonts.OPENSANS_SEMIBOLD, marginTop:8, marginBottom:8 }}>Scanned#&nbsp;&nbsp;&nbsp;</Text>
          <Text>{data.ScannedCode}</Text>
        </View>
      </View>
    );
  }

  render() {
    const { onPress, data, mode } = this.props;
    const showTime = mode === 'time' || mode === 'detail';
    const showDetail = mode === 'detail';

    let date = '';
    let time = '';
    if (!showTime) {
      date = data.DATE;
    } if (showTime && data.Time) {
      let arr = data.Time.split(' ');
      date = arr[0];
      time = arr[1];
    }

    console.log('props::::::; ', this.props);

    return (
      <Card>
        <TouchableItem
          onPress={() => onPress && onPress(data)}>
          <View style={{ flexDirection: 'column', padding: 8, justifyContent: 'space-around' }}>
            { showDetail && this.renderDetail() }
            <View style={{ flexDirection: 'row', margin: 8 }}>
              <QRCodeHistoryListItemPart title='DATE' value={date} />
              { showTime && <QRCodeHistoryListItemPart title='TIME' value={time} /> }
              { showDetail ?
              (<QRCodeHistoryListItemPart title={this.props.detailFieldLabel} value={data[this.props.detailFieldName]}  />) :
              (<QRCodeHistoryListItemPart title={this.props.valueFieldLabel} value={data[this.props.valueFieldName]} />)
              }
            </View>
          </View>
        </TouchableItem>
      </Card>
      )
  }
}
