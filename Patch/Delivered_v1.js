/**
 * @component   : ContactUs
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Tuesday Jan 15, 2019 10:25:53 IST
 * @description : ContactUs
 */

import React, {Component}  from 'react'
import PropTypes from 'prop-types'
import { View, Text, Image, StyleSheet, TouchableHighlight,Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { Card,CardItem } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux';
import { headingStyles, regularTextStyles, linkStyles } from '../../../res/Styles';
import { createMaterialTopTabNavigator, createAppContainer } from 'react-navigation';
import Prompt from 'react-native-input-prompt';
import PrimaryButton from '../../../components/PrimaryButton';
import TouchableItem from '../../../components/TouchableItem';
import Icon from '../../../components/Icon';
import Colors from '../../../res/Colors';
import TextInput from '../../../components/TextInput';

import { showMessage } from '../../../actions/MessageActions';
import ScreenName from './ScreenName';
import Stars from 'react-native-stars';
import GiftingOptionsRow from '../gifting/GiftingOptionsRow'
import Dialog from "react-native-dialog";
import { getRetailerData } from '../../../actions/GiftingActions';
import { getRatingDetails } from  '../../../selectors/GiftingSelector'
import { retailerRating } from '../../../actions/GiftingActions';;

const deviceHeight  = Dimensions.get('window').height;
const deviceWidth  = Dimensions.get('window').width;
const BANNER_HEIGHT = (deviceHeight * 0.2);


const styles = StyleSheet.create({
  myStarStyle: {
    color:Colors.COLORPRIMARY
            },
  myEmptyStarStyle: {
      color:Colors.COLORPRIMARY
      },
  banner: {
    height: BANNER_HEIGHT,
    maxHeight: 200,
    flex: 1,
  },
});


class DelieveredScreen extends React.Component {
  static propTypes = {
      onPress: PropTypes.func,
   }

   static defaultProps = {
     onPress: null,
   }

   componentDidMount() {
     this.props.getRetailerData({ userid:'9865321047'});
     }

  constructor(props) {
   super(props);
   this.state = {
     message: '',
     promptVisible: false,
     promptVisible1: false,
     starValue: 0
   };
}

render() {
    return (
<View>
<Card>
    <CardItem cardBody>
        <Image source={{ uri: 'orient' }} style={styles.banner} resizeMode='contain'/>
    </CardItem>
        <CardItem footer>
            <View style={{ flex: 1, padding: 8, marginTop:10}} >
                <GiftingOptionsRow
                    options={[
                        { label: 'PRODUCT NAME', value: 'Mixer Grinder' },
                        { label: 'SCHEME NAME', value: 'Summer Bonanza' },
                        ]} onPress={option => this._onItemPress(option) } />
            </View>
        </CardItem>
      <View style={{ flexDirection: 'row', padding: 1,margin:2 }}>
      {
        this.props.giftingRetailer.map(
        (entry, index) => {
        return (
          <View>
        {parseInt(entry.Rating)?
            <Row>
            <CardItem footer>
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Text>{entry.Comment}</Text>
            <Stars
                   default={parseInt(entry.Rating)}
                   count={5}
                   half={true}
                   full={true}
                   starSize={50}
                   disabled={true}
                   fullStar={<Icon size={40} name={'star'} style={[styles.myStarStyle]}/>}
                   emptyStar={<Icon size={40} name={'star-outline'} style={[styles.myStarStyle, styles.myEmptyStarStyle]}/>}
                   halfStar={<Icon size={40} name={'star-half'} style={[styles.myStarStyle]}/>}
                    />
                  </View>
                    </CardItem>
            </Row>
          :
          <Row>
          <View style={{flexDirection: 'row', padding: 1,margin:2,alignItems: 'center', justifyContent: 'center' }}>
             <Stars
               default={parseInt(entry.Rating)}
               count={5}
               half={true}
               full={true}
               starSize={50}
               disabled={false}
               update={(val)=> {this.setState({ promptVisible: true, starValue:val })}}
               fullStar={<Icon size={40} name={'star'} style={[styles.myStarStyle]}/>}
               emptyStar={<Icon size={40} name={'star-outline'} style={[styles.myStarStyle, styles.myEmptyStarStyle]}/>}
               halfStar={<Icon size={40} name={'star-half'} style={[styles.myStarStyle]}/>}
                />
                <Dialog.Container visible={this.state.promptVisible}>
                   <Dialog.Title>Enter Comments</Dialog.Title>
                     <TextInput
                       placeholder='Comment'
                       value={this.state.message}
                       onChangeText={text => this.setState({ message: text })}
                     />
                  <Dialog.Button
                    label="Cancel"
                    color={Colors.PRIMARY_TEXT}
                    onPress={() => this.setState({ promptVisible: false, message: null, starValue:0 })}
                  />
                  <Dialog.Button
                    label="Submit"
                    color={Colors.COLORPRIMARY}
                    onPress={() => {
                      this.setState({ message: this.state.message, promptVisible: false })
                      this.props.retailerRating({ userid:'9865321047', schemeid:entry.SchemeId,
                        giftingid:entry.GiftingId,rating:this.state.starValue,comment:this.state.message});
                    }}
                    disabled={!this.state.message}
                   />
                </Dialog.Container>
              </View>
          </Row>
        }
          </View>
          );
        }

      )
    }
    </View>
    </Card>
</View>
);
}
}



const mapStateToProps = (state, props) => {
  const giftingRetailer = getRatingDetails(state);
  return { giftingRetailer };
}
const mapDispatchToProps = { getRetailerData, retailerRating, showMessage }

export default connect(mapStateToProps, mapDispatchToProps)(DelieveredScreen);
