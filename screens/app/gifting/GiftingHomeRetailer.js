/**
 * @component   : GiftingHomeRetailer
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Thursday Jan 31, 2019 12:49:15 IST
 * @description : GiftingHomeRetailer
 */

import React, {Component}  from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, StyleSheet, Dimensions, FlatList } from 'react-native';
import { Card, CardItem, Tab, Tabs } from 'native-base';
import Dialog from "react-native-dialog";
import { connect } from 'react-redux';
import PrimaryButton from '../../../components/PrimaryButton';
import StarRating from '../../../components/StarRating';
import TextInput from '../../../components/TextInput';
import GiftingOptionsRow from '../gifting/GiftingOptionsRow'

import { fetchRetailerData } from '../../../actions/GiftingActions';
import { submitRetailerRating, clearGiftingData, GiftingActionTypes } from '../../../actions/GiftingActions';
import { showMessage } from '../../../actions/MessageActions';
import { getRatingDetails } from  '../../../selectors/GiftingSelector';
import { getUserProfile } from  '../../../selectors/UserSelector';
import { isRequestPending } from  '../../../selectors/ApiSelector';
import { elevation } from  '../../../utils';
import Colors from  '../../../res/Colors';

export class GiftItem extends Component {
  static propTypes = {
    giftDetail: PropTypes.object,
    showRating: PropTypes.bool,
    submitRetailerRating: PropTypes.func,
    onSubmitRatingStart: PropTypes.func,
    disableRatingInput: PropTypes.bool,
  }
  static defaultProps = {
    giftDetail: null,
    showRating: true,
    submitRetailerRating: null,
    onSubmitRatingStart: null,
    disableRatingInput: false,
  }

  constructor(props) {
    super(props);

    this.state = {
      promptVisible: false,
      comment: '',
      rating: 0,
      imageLoadError: false,
    };

    const { giftDetail } = this.props;
  }

  _sumbitRating = () => {
    const { giftDetail, profile } = this.props;
    this.setState({ promptVisible: false })
    this.props.submitRetailerRating({
      userid: profile.RegisteredMobileNo,
      schemeid: giftDetail.SchemeId,
      giftingid: giftDetail.GiftingId,
      rating: this.state.rating,
      comment: this.state.comment,
    });

    if (this._startRating) {
      this._startRating.refresh();
    }

    if (this.props.onSubmitRatingStart) {
      this.props.onSubmitRatingStart();
    }
  }

  _cancelRating = () => {
    this.setState({ promptVisible: false, comment: null, rating : 0 });
    if (this._startRating) {
      this._startRating.refresh();
    }
  }

  _renderCommentsDialog = () => {
    return (
      <Dialog.Container visible={this.state.promptVisible}>
        <Dialog.Title>Enter Comments</Dialog.Title>
        <TextInput
          placeholder='Enter Comment'
          value={this.state.comment}
          onChangeText={text => this.setState({ comment: text })}
        />




        <View style={{ flexDirection: 'row' }}>
    <View style={{flex: 1}}>
         
         <PrimaryButton
      basic
            title="CANCEL"
            color={Colors.PRIMARY_TEXT}
            textStyle={{ color: Colors.SECONDARY_TEXT }}
            onPress={this._cancelRating}
          />

    </View>
    <View style={{flex: 1}}>
          <PrimaryButton
      basic
            title="SUBMIT"
            color={Colors.COLORPRIMARY}
            onPress={this._sumbitRating}
          />
    </View>
    </View>

      </Dialog.Container>
      );
  }

  _onRatingChange = rating => {
    this.setState({ rating: rating, promptVisible: true });
  }

  render() {
    const { giftDetail } = this.props;
    if (!giftDetail) {
      return null;
    }
    let rating = 0;
    try {
      rating = parseFloat(giftDetail.Rating);
    } catch (error) {
    }
    return (
      <View style={ styles.cardContainer }>
        <Card>
          <Image
            source={{ uri: !this.state.imageLoadError ? giftDetail.RewardImageURL : 'no_image' }}
            style={styles.banner}
            resizeMode='cover'
            onError={() => this.setState({ imageLoadError: true })}
          />
          <GiftingOptionsRow
            style={styles.detailRow}
            options={[
            { label: 'PRODUCT NAME', value: giftDetail.RewardName },
            { label: 'SCHEME NAME', value: giftDetail.SchemeName },
            ]}
          />

          <GiftingOptionsRow
            style={styles.detailRow}
            options={[
            { label: 'DISTRIBUTOR/RDD/NSM', value: giftDetail.DistributorName },
            { label: 'SALES EXECUTIVE', value: giftDetail.SalesExecutive },
            ]}
          />
          { this.props.showRating && (
          <View style={styles.ratingContainer}>
            <StarRating
              ref={node => this._startRating = node }
              rating={rating}
              comment={giftDetail.Comment}
              disabled={(rating > 0) || this.props.disableRatingInput}
              onChange={this._onRatingChange}
            />
            { this._renderCommentsDialog() }
          </View>
          )}
        </Card>
      </View>
    );
  }
}

const deviceHeight  = Dimensions.get('window').height;
const BANNER_HEIGHT = 120;

const styles = StyleSheet.create({
  banner: {
    height: BANNER_HEIGHT,
    maxHeight: BANNER_HEIGHT,
    flex: 1,
    margin: 8,
  },
  ratingContainer: {
    paddingLeft: 8,
    paddingRight: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  tab: {
    padding: 8,
  },
  tabStyle: {
    backgroundColor: Colors.WHITE,
  },
  tabBarUnderlineStyle: {
    backgroundColor: Colors.COLORPRIMARY,
  },
  tabTextStyle: {
    color: Colors.PRIMARY_TEXT,
  },
  activeTabTextStyle: {
    color: Colors.COLORPRIMARY,
  },
  detailRow: {
    marginTop: 8,
    marginBottom: 8
  },
  cardContainer: {
    marginLeft: 8,
    marginRight: 8,
    marginTop: 4,
    marginBottom: 4,
  }
});


class GiftingHomeRetailer extends Component {
  static propTypes = {
  }

  static defaultProps = {
  }

  constructor (props) {
    super(props);

    this.state = {
      pendingGifts: [],
      deliveredGifts: [],
    }
    this.waitingForResponse = false;
  }

  componentDidMount() {

        if (!this.props.profile) {
        return;
      }
      this.props.fetchRetailerData(this.props.navigation.getParam('userMobileNuber') || this.props.profile.RegisteredMobileNo);
  }

  componentDidUpdate(prevProps) {
   
      if (prevProps.giftDetails !== this.props.giftDetails) {
      this._updateGiftsList();
      }
      if (!this.props.busy && this.waitingForResponse) {
        this.waitingForResponse = false;
        this.props.fetchRetailerData(this.props.navigation.getParam('userMobileNuber') || this.props.profile.RegisteredMobileNo);
      }
   
  }

  componentWillUnmount () {
    this.props.clearGiftingData(GiftingActionTypes.GET_RETAILER_DATA);
  }

  _updateGiftsList = () => {
    if (!this.props.giftDetails) {
      this.setState({ pendingGifts: [], deliveredGifts: [] });
      return;
    }
    const pendingGifts = this.props.giftDetails.filter(giftDetail => giftDetail.Status === 'Pending');
    const deliveredGifts = this.props.giftDetails.filter(giftDetail => giftDetail.Status === 'Delivered');

    this.setState({ pendingGifts, deliveredGifts });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Tabs
          tabBarUnderlineStyle={styles.tabBarUnderlineStyle}
        >
          <Tab
            heading='Pending'
            tabStyle={styles.tabStyle}
            activeTabStyle={styles.tabStyle}
            textStyle={styles.tabTextStyle}
            activeTextStyle={styles.activeTabTextStyle}
          >
            <FlatList
              data={this.state.pendingGifts}
              extraData={this.props.giftDetails}
              keyExtractor={(detail, index) => `${index}`}
              renderItem={({ item }) => (
              <GiftItem
                profile={this.props.profile}
                giftDetail={item}
                showRating={false}
              />)}
            />
          </Tab>
          <Tab
            heading='Delivered'
            tabStyle={styles.tabStyle}
            activeTabStyle={styles.tabStyle}
            textStyle={styles.tabTextStyle}
            activeTextStyle={styles.activeTabTextStyle}
          >
            <FlatList
              data={this.state.deliveredGifts}
              extraData={this.props.giftDetails}
              keyExtractor={(detail, index) => `${index}`}
              renderItem={({ item }) => (
              <GiftItem
                profile={this.props.profile}
                giftDetail={item}
                submitRetailerRating={this.props.submitRetailerRating}
                disableRatingInput = {!this.props.navigation.getParam('isRetailer')}
                onSubmitRatingStart={() => { this.waitingForResponse = true; }}
              />)}
            />
          </Tab>
        </Tabs>
      </View>
    )
  }
}

const mapStateToProps = state => {
  const profile = getUserProfile(state);
  const giftDetails = getRatingDetails(state);
  const busy = isRequestPending(state);

  return { profile, giftDetails, busy };
}

const mapDispatchToProps = { fetchRetailerData, submitRetailerRating, showMessage, clearGiftingData }

export default connect(mapStateToProps, mapDispatchToProps)(GiftingHomeRetailer);
