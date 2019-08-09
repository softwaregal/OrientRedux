/**
 * @component   : DrawerMenuButton
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Thursday Jan 03, 2019 14:28:39 IST
 * @description : DrawerMenuButton
 */

import React, {Component}  from 'react'
import PropTypes from 'prop-types'
import Icon from './Icon';

import ImageButton from './ImageButton';

export default class DrawerMenuButton extends Component {
  static propTypes = {
  }

  static defaultProps = {
  }

  render() {
    return (
      <ImageButton style={{marginLeft: 16}} onPress={() => this.props.navigation.openDrawer()}>
        <Icon name="menu" size={24} color={this.props.tintColor} />
      </ImageButton>
    )
  }
}


