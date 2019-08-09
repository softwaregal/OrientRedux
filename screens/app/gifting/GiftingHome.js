/**
 * @component   : GiftingHome
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Thursday Jan 24, 2019 14:24:49 IST
 * @description : GiftingHome
 */

import React, {Component}  from 'react';
import PropTypes from 'prop-types';
import { View, Text, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { headingStyles, regularTextStyles } from '../../../res/Styles';

import GiftingScheme from './GiftingScheme';
import { fetchRetailerData } from '../../../actions/GiftingActions';
import Dialog from "react-native-dialog";
import Colors from '../../../res/Colors';
import TextInput from '../../../components/TextInput';
import DatePicker from '../../../components/DatePicker';
import PrimaryButton from '../../../components/PrimaryButton';
import Picker from '../../../components/Picker';
import { toDateString } from '../../../utils';
import ImageButton from '../../../components/ImageButton';
import { getAllSchemes, getUserMapping } from '../../../selectors/GiftingSelector';
import { getUserProfile } from '../../../selectors/UserSelector';
import { showMessage, showErrorMessage } from '../../../actions/MessageActions';
import ScreenName from './ScreenName';
import { getPointGiftData, clearGiftingData, GiftingActionTypes, fetchUserMapping } from '../../../actions/GiftingActions';
import { GiftingStatus, SCHEME_ID_ALL_SCHEMES } from '../../../constants';
import {
  getShortMonthName,
  getYear,
  isNSH,
  isRSM,
  isStateHead,
} from '../../../utils';

const ALL_SCHEME = 'All';

class GiftingHome extends Component {
  static propTypes = {
  }

  static defaultProps = {
  }


  static navigationOptions = ({ navigation }) => ({
    headerRight: ( navigation.getParam('showRetailerSearch') ?
              (<ImageButton
                source={{ uri: 'search' }}
                onPress={navigation.getParam('searchRetailer') ? navigation.getParam('searchRetailer') : () => {}}
              /> ) : null)
  });

  searchRetailer = () => {
    this.setState({ searchUser: true })
  }

  constructor(props) {
    super(props);
    let toDate = null;
    let fromDate = null;

    toDate = new Date();
    fromDate = new Date();
    fromDate.setMonth(fromDate.getMonth() - 3);
    

    this.state = {
      fromDate: fromDate,
      toDate: toDate,
      schemeNames: null,
      selectedScheme: null,
      level1Users: [],
      level2Users: [],
      level3Users: [],
      currentLevel1User: null,
      currentLevel2User: null,
      currentLevel3User: null,
      searchUser: false,
      searchMobileNumber:'',
    };

    // Call for search btn defination
    if (this.props.navigation) {
      this.props.navigation.setParams({ 'searchRetailer': this.searchRetailer });
    }

     if (this.props.navigation) {
      this.props.navigation.setParams({ 'showRetailerSearch': false });
    }


    if (this.props.schemes && this.props.schemes.length > 0) {
      this.state.selectedScheme = ALL_SCHEME;
      this.state.schemeNames = this.props.schemes.map(scheme => ({ label: scheme.SchemeName, value: scheme.SchemeName }));
      this.state.schemeNames.push({ label: ALL_SCHEME, value: ALL_SCHEME });
    }
      const { userHierarchy } = this.props;
      if (userHierarchy) {
        const level1Users = userHierarchy.Level1Details.filter(user => user.Level1Id).
          map(user => ({ label: user.Level1Name, value: user.Level1Id }));
        this.state.level1Users = level1Users;
      }
      this.didBlur = false;
      this.didBlurSubscription = this.props.navigation.addListener(
      'didBlur',
      payload => {
        this.didBlur = true;
        }
      );

      this.didFocusSubscription = this.props.navigation.addListener(
        'didFocus',
        payload => {
          this.didBlur = false;
          this.onViewScheme();
        }
      );
  }

  componentDidMount() {
    if (!this.props.profile) {
      return;
    }
    if (isNSH(this.props.profile) ||
      isRSM(this.props.profile) ||
      isStateHead(this.props.profile)) {
      this.props.navigation.setParams({ 'showRetailerSearch': true });
      this.props.fetchUserMapping(this.props.profile.RegisteredMobileNo);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.schemes !== prevProps.schemes) {
      if (this.props.schemes && this.props.schemes.length > 0) {
        const schemeNames = this.props.schemes.map(scheme => ({ label: scheme.SchemeName, value: scheme.SchemeName }));
        schemeNames.push({ label: ALL_SCHEME, value: ALL_SCHEME });
        this.setState({
          selectedScheme: ALL_SCHEME,
          schemeNames: schemeNames,
        });
      } else {
        this.setState({
          selectedScheme: null,
          schemeNames: null,
        });
      }
    }
    if (this.props.userHierarchy !== prevProps.userHierarchy) {
      const { userHierarchy } = this.props;
      if (!userHierarchy) {
        this.setState({
          level1Users: [],
          currentLevel1User: null,
          level2Users: [],
          currentLevel2User: null,
          level3Users: [],
          currentLevel3User: null,
        });
        return;
      }
      const level1Users = userHierarchy.Level1Details.filter(user => user.Level1Id).
        map(user => ({ label: user.Level1Name, value: user.Level1Id }));
        this.setState({
          level1Users: level1Users,
          currentLevel1User: null,
          level2Users: [],
          currentLevel2User: null,
          level3Users: [],
          currentLevel3User: null,
        });
    }
  }

  _onLevel1UserChange = value => {
    if (value === this.currentLevel1User) {
      return;
    }
    const { userHierarchy } = this.props;
    const level1Details = userHierarchy.Level1Details.filter(user => user.Level1Id === value);
    let level2Users = [];
    if (level1Details.length > 0) {
      level2Users = level1Details[0].Level2Details.filter(user => user.Level2Id).
        map(user => ({ label: user.Level2Name, value: user.Level2Id }));
    }
    this.setState({
      currentLevel1User: value,
      level2Users: level2Users,
      currentLevel2User: null,
      level3Users: [],
      currentLevel3User: null,
    });
  }

  _onLevel2UserChange = value => {
    if (value === this.currentLevel2User) {
      return;
    }
    const { userHierarchy } = this.props;
    const level1Details = userHierarchy.Level1Details.filter(user => user.Level1Id === this.state.currentLevel1User);
    const level2Details = level1Details[0].Level2Details.filter(user => user.Level2Id === value);
    let level3Users = [];
    if (level2Details.length > 0) {
      level3Users = level2Details[0].Level3Details.filter(user => user.Level3Id).
        map(user => ({ label: user.Level3Name, value: user.Level3Id }));
    }
    this.setState({
      currentLevel2User: value,
      level3Users: level3Users,
      currentLevel3User: null,
    });
  }
  _onLevel3UserChange = value => {
    if (value === this.currentLevel3User) {
      return;
    }
    this.setState({ currentLevel3User: value });
  }

  componentWillUnmount () {
    this.props.clearGiftingData(GiftingActionTypes.GET_POINT_GIFT_DATA);
    this.props.clearGiftingData(GiftingActionTypes.FETCH_USER_MAPPING);
    this.didFocusSubscription.remove();
    this.didBlurSubscription.remove();
  }

  onViewScheme = () => {
    if (!this.state.fromDate || !this.state.toDate) {
      this.props.showErrorMessage('Please select date range');
      return;
    }
    if (this.state.fromDate > this.state.toDate) {
      this.props.showErrorMessage('To date can not be earlier than from date');
      return;
    }

    let mobileNo = null;
    if (isNSH(this.props.profile)) {
      mobileNo = this.state.currentLevel3User;
      if (!mobileNo) {
        mobileNo = this.state.currentLevel2User;
      }
      if (!mobileNo) {
        mobileNo = this.state.currentLevel1User;
      }
    } else if (isRSM(this.props.profile)) {
      mobileNo = this.state.currentLevel2User;
      if (!mobileNo) {
        mobileNo = this.state.currentLevel1User;
      }
    } else if (isStateHead(this.props.profile)) {
      mobileNo = this.state.currentLevel1User;
    } else {
      mobileNo = this.props.profile.RegisteredMobileNo;
    }
    if (!mobileNo) {
      mobileNo = this.props.profile.RegisteredMobileNo;
    }
    this.props.getPointGiftData({
      userid: mobileNo,
      fromdate: toDateString(this.state.fromDate),
      todate: toDateString(this.state.toDate),
      schemeid: SCHEME_ID_ALL_SCHEMES,
      status: GiftingStatus.ALL,
    });
  }

  _onItemPress = (scheme, option) => {
    this.props.navigation.push(ScreenName.GIFTING_STATUS, {
      schemeId: scheme ? scheme.SchemeId : null,
      status: option ? option.Status : null,
    });
  }
  _renderFilters = () => {
    const options = [];
    if (isNSH(this.props.profile)) {
      options.push({
        label: 'RSM',
        values: this.state.level1Users,
        currentValue: this.state.currentLevel1User,
        onValueChange: this._onLevel1UserChange
      });
      options.push({
        label: 'State Head',
        values: this.state.level2Users,
        currentValue: this.state.currentLevel2User,
        onValueChange: this._onLevel2UserChange
      });
      options.push({
        label: 'Sales Executive',
        values: this.state.level3Users,
        currentValue: this.state.currentLevel3User,
        onValueChange: this._onLevel3UserChange
      });
    } else if (isRSM(this.props.profile)) {
      options.push({
        label: 'State Head',
        values: this.state.level1Users,
        currentValue: this.state.currentLevel1User,
        onValueChange: this._onLevel1UserChange
      });
      options.push({
        label: 'Sales Executive',
        values: this.state.level2Users,
        currentValue: this.state.currentLevel2User,
        onValueChange: this._onLevel2UserChange
      });
    } else if (isStateHead(this.props.profile)) {
      options.push({
        label: 'Sales Executive',
        values: this.state.level1Users,
        currentValue: this.state.currentLevel1User,
        onValueChange: this._onLevel1UserChange
      });
    }

    return <View style={{ flexDirection: 'row' }}>
      {
      options.map((item, index) => (
      <View key={index} style={{ flex: 1, marginLeft: 2, marginRight: 2 }}>
        <Picker
          placeholder={item.label}
          options={item.values}
          selectedValue={item.currentValue}
          onValueChange={item.onValueChange}
        />
      </View>)
      )}
    </View>
  }

  render() {
    if (!this.props.profile) {
      return null;
    }
    const filteredSchems =this.props.schemes ? this.props.schemes.filter(scheme => (this.state.selectedScheme === ALL_SCHEME
      || this.state.selectedScheme === scheme.SchemeName)) : null;
    return (
      <View style={{ flex: 1, padding: 8 }}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1, alignItems: 'center', textAlignVertical: 'top' }}>
            <DatePicker
              defaultDate={this.state.fromDate}
              placeHolderText='From'
              onDateChange={ date => this.setState({ fromDate: date }) }
              maximumDate={new Date()}
            />
          </View>
          
          <View style={{ marginLeft: 8, flex: 1, alignItems: 'center', textAlignVertical: 'top'}}>
            <DatePicker
              defaultDate={this.state.toDate}
              placeHolderText='To'
              onDateChange={ date => this.setState({ toDate: date }) }
              maximumDate={new Date()}
            />
          </View>

        </View>
        { this._renderFilters() }
        <PrimaryButton title='Go' onPress={this.onViewScheme} />
        { this.state.schemeNames && this.state.selectedScheme && (
        <Picker
          placeholder='Scheme Name'
          options={this.state.schemeNames}
          selectedValue={this.state.selectedScheme}
          onValueChange={value => this.setState({ selectedScheme: value })}
        />)
        }
        {
          filteredSchems && filteredSchems.length === 0 ?
          (<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={regularTextStyles.medium}>No scheme data to show</Text>
        </View>) : null
        }
        { (filteredSchems && filteredSchems.length > 0) ? ( <FlatList
          data={filteredSchems}
          keyExtractor={(item, index) => `${index}`}
          renderItem={({ item }) => (
          <GiftingScheme
            scheme={item}
            onItemPress={this._onItemPress}
            />)
          }
        />) : null
        
        }


        <Dialog.Container visible={this.state.searchUser}>
          <Dialog.Title>Search Retailer</Dialog.Title>
          <TextInput
            placeholder='Enter Mobile No.'
            value={this.state.mobileno}
            onChangeText={text => this.setState({ searchMobileNumber: text })}
          />


          <View style={{ flexDirection: 'row' }}>
          <View style={{flex: 1}}>
                <PrimaryButton
            basic
                  title="CANCEL"
                  color={Colors.PRIMARY_TEXT}
                  textStyle={{ color: Colors.SECONDARY_TEXT }}
                  onPress={() => this.setState({ searchUser: false })}
                />
          </View>
          <View style={{flex: 1}}>
                <PrimaryButton
            basic
                  title="SUBMIT"
                  color={Colors.COLORPRIMARY}
                  onPress={() => {
                      this.props.navigation.push(ScreenName.GIFTING_HOME_RETAILER, {'isRetailer' : false, 'userMobileNuber': this.state.searchMobileNumber})
                      this.setState({ searchUser: false })
                  }}
                />
          </View>
          </View>

        </Dialog.Container>

      </View>
    )
  }
}

const mapStateToProps = (state, props) => {
  const profile = getUserProfile(state);
  const schemes = getAllSchemes(state, profile);
  const userHierarchy = getUserMapping(state);

  return { schemes, profile, userHierarchy };
}

const mapDispatchToProps = {
  getPointGiftData,
  showMessage,
  showErrorMessage,
  clearGiftingData,
  fetchUserMapping,
  fetchRetailerData,
};

export default connect(mapStateToProps, mapDispatchToProps)(GiftingHome);
