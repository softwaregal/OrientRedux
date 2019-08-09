/**
 * @component   : GiftingOptionsRow
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Friday Jan 25, 2019 12:45:53 IST
 * @description : GiftingOptionsRow
 */
import React, {Component}  from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from 'native-base';
import { Col, Row, Grid } from 'native-base';

import TouchableItem from '../../../components/TouchableItem';
import { headingStyles, regularTextStyles } from '../../../res/Styles';
import Colors from '../../../res/Colors';

export default class GiftingOptionsRow extends Component {
  static propTypes = {
    options: PropTypes.arrayOf(PropTypes.object),
    onPress: PropTypes.func,
  }

  static defaultProps = {
    options: [],
    onPress: null,
  }

  render() {
    const { options, onPress, ...rest } = this.props;
    const count = this.props.options.length;

    return (
      <View {...rest}>
        <Row>
          <View style={styles.container}>
            {
            this.props.options.map(
            (entry, index) => {
            const ColumnWrapper = this.props.onPress ? TouchableItem : View;
            return (
            <Col key={index} style={{ borderRightWidth: index === count - 1 ? 0 : 1, borderColor: Colors.BORDER_LIGHT }}>
              <ColumnWrapper
                style={styles.columnWrapper}
                onPress={() => this.props.onPress && this.props.onPress(entry)}
              >
                <View style={styles.column} >
                  { entry.label && <Text style={[regularTextStyles.medium, {textAlign: 'center'}]} >{entry.label.toUpperCase()}</Text> }
                  {
                  ((typeof entry.value) === 'number' || (typeof entry.value) === 'string') ?
                  (<Text style={headingStyles.small}>{entry.value}</Text>) :
                  (entry.value)
                  }
                </View>
              </ColumnWrapper>
            </Col>
            )})}
          </View>
        </Row>
      </View>
      )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row'
  },
  columnWrapper : {
    flex: 1
  },
  column: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',

  }
});
