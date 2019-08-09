import React, { Component } from 'react'
import PropTypes from 'prop-types'
import NativeDatePicker from 'react-native-datepicker'

import HeaderedItem from './HeaderedItem';

import { fromDateString } from '../utils';
import { regularTextStyles } from '../res/Styles';
import { Fonts } from '../res';

export default class DatePicker extends Component {
  static propTypes = {
  }
  constructor(props){
    super(props)
  }

  _onDateChange = date => {
    if (this.props.onDateChange) {
      this.props.onDateChange(fromDateString(date));
    }
  }

  render(){
    const { defaultDate, placeHolderText, headerText, maximumDate, onDateChange, ...rest } = this.props;
    return (
      <HeaderedItem header={this.props.headerText}>
        <NativeDatePicker
          date={this.props.defaultDate}
          placeholder={this.props.placeHolderText}
          format="DD-MMM-YYYY"
          maxDate={this.props.maximumDate}
          confirmBtnText="Done"
          cancelBtnText="Cancel"
          onDateChange={this._onDateChange}
          customStyles={{
            placeholderText: { fontSize: 12 },
            dateText: { fontSize: 14, fontFamily: Fonts.OPENSANS_REGULAR },
            dateInput: { fontSize: 14 }
          }}
          {...rest}
        />
      </HeaderedItem>
      )
  }
}
