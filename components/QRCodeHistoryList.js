/**
 * @component   : QRCodeHistoryList
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Monday Jan 14, 2019 11:19:42 IST
 * @description : QRCodeHistoryList
 */

import React, {Component}  from 'react'
import PropTypes from 'prop-types'
import { View, Text, FlatList } from 'react-native'

import QRCodeHistoryListItem from './QRCodeHistoryListItem';

import { regularTextStyles } from '../res/Styles';

export default class QRCodeHistoryList extends Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    mode: PropTypes.oneOf(['date', 'time', 'detail']),
    onItemPress: PropTypes.func,
    emptyListPlaceholder: PropTypes.string,
    valueFieldName: PropTypes.string,
    valueFieldLabel: PropTypes.string,
  }

  static defaultProps = {
    data: [],
    mode: 'date',
    onItemPress: null,
    emptyListPlaceholder: 'No data in the list',
    valueFieldName: 'TotalCouponCode',
    valueFieldLabel: 'TOTAL COUNT',
  }

  render() {
    const { data, mode, onItemPress, emptyListPlaceholder, ...rest } = this.props;
    if (!data || data.length === 0) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={regularTextStyles.medium}>{emptyListPlaceholder}</Text>
        </View>
        )
    }
    return (
      <FlatList {...rest}
        data={data}
        renderItem={({ item }) => (
          <QRCodeHistoryListItem
            data={item}
            mode={mode}
            onPress={onItemPress}
            valueFieldLabel={this.props.valueFieldLabel}
            valueFieldName={this.props.valueFieldName}
            detailFieldLabel={this.props.detailFieldLabel}
            detailFieldName={this.props.detailFieldName}
            />)}
        keyExtractor={(item, index) => `${index}`}
        showsVerticalScrollIndicator={false}
      />
    )
  }
}
