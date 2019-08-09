/**
 * @component   : Notification
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Wednesday Jan 23, 2019 12:13:39 IST
 * @description : Notification
 */

import React, {Component}  from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { Card } from 'native-base';
import { connect } from 'react-redux';

import PrimaryButton from '../../../components/PrimaryButton';
import ImageButton from '../../../components/ImageButton';

import { regularTextStyles } from '../../../res/Styles';

import { getNotifications } from '../../../selectors/NotificationSelector';
import { getUserProfile } from '../../../selectors/UserSelector';
import { fetchNotification, updateNotification, clearNotificationCount } from '../../../actions/NotificationActions';

const styles = StyleSheet.create({
	buttonContainerStyle:{
		flex: 1,
	},
	buttonStyle:{
		padding: 4
	}
});

const NotificationItem = props => {
  const { notification } = props;
  return (
    <Card>
      <View style={{ flex: 1, padding: 8 }}>
        <Text>{notification.NotificationContent}</Text>
        {
          !notification.Responded && (
          <View style={{ flexDirection: 'row' }}>
	  <View style={styles.buttonContainerStyle}>
            <PrimaryButton outlined title='Interested' style={styles.buttonStyle} onPress={props.updatedInterested} />
	    </View>
	  <View style={styles.buttonContainerStyle}>
            <PrimaryButton outlined title='Not interested' style={styles.buttonStyle} onPress={props.updatedNotInterested} />
	    </View>
          </View>
        )}
      </View>
    </Card>
    );
}

class Notification extends Component {
  static propTypes = {
  }

  static defaultProps = {
  }

  static navigationOptions = ({ navigation }) => ({
    title: 'Notification',
    headerRight: <ImageButton source={{ uri: 'noti' }} onPress={navigation.getParam('refreshNotifications')} />
  })

  constructor(props) {
    super(props);
    this.props.navigation.setParams({
      refreshNotifications: () => this.props.fetchNotification(this.props.profile.RegisteredMobileNo)
    });
  }

  componentDidMount () {
    if (!this.props.profile) {
      return;
    }
    this.props.fetchNotification(this.props.profile.RegisteredMobileNo);
    this.props.clearNotificationCount();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.profile !== this.props.profile && this.props.profile) {
      this.props.fetchNotification(this.props.profile.RegisteredMobileNo);
    }
  }

  _updateNotification = (notificationId, interested) => {
    this.props.updateNotification(this.props.profile.RegisteredMobileNo, notificationId, interested ? 1 : 0);
  }

  render() {
    if (!this.props.notifications || !this.props.notifications.length) {
      return (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={regularTextStyles.medium}>No notifications to show</Text>
      </View>)
    }
    return (
      <FlatList
        style={{ padding: 8 }}
        data={this.props.notifications}
        keyExtractor={(notification, index) => `${index}`}
        renderItem={({ item }) => (
        <NotificationItem
          notification={item}
          updatedInterested={() => this._updateNotification(item.NotificationID, true)}
          updatedNotInterested={() => this._updateNotification(item.NotificationID, false)}
        />
        )}
      />
    )
  }
}

const mapStateToProps = state => {
  const profile = getUserProfile(state);
  const notifications = getNotifications(state);
  return { profile, notifications };
}

const mapDispatchToProps = { fetchNotification, updateNotification, clearNotificationCount };

export default connect(mapStateToProps, mapDispatchToProps)(Notification);
