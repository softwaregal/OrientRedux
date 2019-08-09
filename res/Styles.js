/**
 * @class       : Styles
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Wednesday Jan 02, 2019 12:39:18 IST
 * @description : Styles
 */

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Button } from 'native-base';
import { HeaderBackButton } from 'react-navigation'

import { Fonts, FontSize, Colors } from './';
import ImageButton from '../components/ImageButton';
import DrawerMenuButton from '../components/DrawerMenuButton';
import IconBadge from 'react-native-icon-badge';

export const defaultStackbarNavigatorOptions = ({ navigation }) => {
  return {
    title: navigation.state.params ? navigation.state.params.title : '',
    headerStyle: {
      backgroundColor: Colors.COLORPRIMARY,
    },
    headerTitleStyle: {
      flex: 1,
    },
    headerLeft: (props) => (navigation.getParam('showDrawerMenuButton') ?
      (<DrawerMenuButton navigation={navigation} {...props} />):
      (<HeaderBackButton navigation={navigation} {...props} />)),

    
    headerRight: ( navigation.getParam('showDrawerMenuButton') && navigation.getParam('showNotification') ? 
      (

      <View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'center',}}>
      <IconBadge
        MainElement={
         <ImageButton
          source={{ uri: 'noti' }}
          onPress={() => navigation.push(navigation.getParam('notificationScreen'))} />
        }
        BadgeElement={
          <Text style={{color:'#F26522'}}>{navigation.getParam('notificationCount')}</Text>
        }
        IconBadgeStyle={
          {width:20,
          height:20,
          backgroundColor: '#FFFFFFFF'}
        }
         Hidden={navigation.getParam('notificationCount') === 0}
        />
    </View>

      


      ) : null),


  headerTintColor: Colors.WHITE,
  activeTintColor: Colors.COLORPRIMARY,
  headerRightContainerStyle: { marginRight: 16 },
}};


export const buttonStyles = StyleSheet.create({
  primaryButton: {
    backgroundColor: Colors.COLORPRIMARY,
    marginTop: 8,
    marginBottom: 8,
    padding: 12,
    elevation: 1.5,
    justifyContent: 'center',
    borderRadius: 2,
  },
  primaryButtonText: {
    alignSelf: 'center',
    color: Colors.WHITE,
    fontFamily: Fonts.BOLD,
  },
  basicButton: {
    margin: 8,
    padding: 12,
    justifyContent: 'center',
    borderRadius: 2,
  },
  basicButtonText: {
    alignSelf: 'center',
    color: Colors.COLORPRIMARY,
    fontFamily: Fonts.BOLD,
  }
});

export const headingStyles = StyleSheet.create({
  large: {
    color: Colors.PRIMARY_TEXT,
    fontFamily: Fonts.BOLD,
    fontSize: FontSize.BIG,
  },
  medium: {
    color: Colors.PRIMARY_TEXT,
    fontFamily: Fonts.BOLD,
    fontSize: FontSize.MEDIUM,
  },
  small: {
    color: Colors.PRIMARY_TEXT,
    fontFamily: Fonts.BOLD,
    fontSize: FontSize.SMALL,
  }
});

export const regularTextStyles = StyleSheet.create({
  large: {
    color: Colors.PRIMARY_TEXT,
    fontFamily: Fonts.OPENSANS_REGULAR,
    fontSize: FontSize.BIG,
  },
  medium: {
    color: Colors.PRIMARY_TEXT,
    fontFamily: Fonts.OPENSANS_REGULAR,
    fontSize: FontSize.MEDIUM,
  },
  small: {
    color: Colors.PRIMARY_TEXT,
    fontFamily: Fonts.OPENSANS_REGULAR,
    fontSize: FontSize.SMALL,
  }
});

export const linkStyles = StyleSheet.create({
  link: {
    color: Colors.COLORPRIMARY,
    fontFamily: Fonts.BOLD,
    textDecorationLine: 'underline',
  }
});

