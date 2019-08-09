/**
 * @component   : Sidebar
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Monday Jan 07, 2019 11:12:13 IST
 * @description : Sidebar
 */

import React, {Component}  from 'react'
import PropTypes from 'prop-types'
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView, DrawerItems } from 'react-navigation';
import { connect } from 'react-redux';
import Dialog from "react-native-dialog";
import PrimaryButton from '../../components/PrimaryButton';
import { Colors, IconSize } from '../../res';
import OrientLogo from '../../components/OrientLogo';
import TouchableItem from '../../components/TouchableItem';
import { getUserProfile, getUserPrivilegeMap } from '../../selectors/UserSelector';
import { removeUser } from '../../actions/UserActions';
import ScreenName from '../../ScreenName';
import { ModuleName } from '../../constants';
import { screenToModuleNameMap } from './ScreenName';

class SidebarItem extends Component {
  static propTypes = {
    onPress: PropTypes.func,
    icon: PropTypes.any.isRequired,
    label: PropTypes.string.isRequired,
  }

  static defaultProps = {
    onPress: null,
    icon: null,
    label: null,
  }

  render() {
    const { icon, label } = this.props;
    return (
      <TouchableItem
        onPress={this.props.onPress}
      >
        <View style={styles.item}>
          <Image source={{uri: icon}} style={styles.icon} tintColor={Colors.SECONDARY_TEXT}/>
          <Text style={styles.label}>{label}</Text>
        </View>
      </TouchableItem>
      );
  }
};

class Sidebar extends Component {
  static propTypes = {
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);

    this.state = {
      label: 'Logout',
      confirmLogoutVisible: false,
    }
  }

  _logout = () => {
    this.props.removeUser();
    this.setState({ confirmLogoutVisible: false });
  }

  _confirmLogout = () => {
    this.props.navigation.closeDrawer();
    this.setState({ confirmLogoutVisible: true });
  }

  render() {
    if (!this.props.profile) {
      this.props.navigation.navigate(ScreenName.Navigator.AUTH);
      return null;
    }
    if (!this.props.privilegeMap) {
      return null;
    }

    const { items, ...rest } = this.props;
    const filteredItems = items.filter(route => this.props.privilegeMap[screenToModuleNameMap[route.routeName]] !== false);

    return (
      <ScrollView>
        <SafeAreaView style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
          <View style={{backgroundColor: Colors.COLORPRIMARY, flex: 1}}>
            <OrientLogo size='small' />
          </View>
          <DrawerItems items={filteredItems} {...rest} labelStyle={styles.label} />
          { this.props.profile && (<SidebarItem icon='logout' label={this.state.label} onPress={this._confirmLogout}/>) }
        </SafeAreaView>


        <Dialog.Container
          visible={this.state.confirmLogoutVisible}
        >
          <Dialog.Title>Logout!!</Dialog.Title>
          <Dialog.Description>Are you sure, you want to logout?</Dialog.Description>

          

          <View style={{ flexDirection: 'row' }}>
          <View style={{flex: 1}}>
                <PrimaryButton
            basic
                  title="CANCEL"
                  color={Colors.PRIMARY_TEXT}
            textStyle={{ color: Colors.SECONDARY_TEXT }}
                  onPress={() => this.setState({ confirmLogoutVisible: false })}
                />
          </View>
          <View style={{flex: 1}}>
                <PrimaryButton
            basic
                  title="SUBMIT"
                  color={Colors.COLORPRIMARY}
                  onPress={this._logout}
                />
          </View>
          </View>          
        </Dialog.Container>

      </ScrollView>
      );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginHorizontal: 16,
    width: IconSize.SMALL,
    height: IconSize.SMALL,
    alignItems: 'center',
  },
  label: {
    margin: 16,
    fontWeight: 'bold',
    color: Colors.SECONDARY_TEXT,
    flex: 1,
  },
});

const mapStateToProps = (state) => {
  const profile = getUserProfile(state);
  const privilegeMap = getUserPrivilegeMap(state);
  return { profile, privilegeMap };
};

const mapDispatchToProps = { removeUser }

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
