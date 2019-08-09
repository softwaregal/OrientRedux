/**
 * @component   : AboutUs
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Tuesday Jan 15, 2019 13:07:58 IST
 * @description : AboutUs
 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, Text, Image } from "react-native";
import { WebView } from "react-native-webview";
import { Card } from "native-base";
import { connect } from "react-redux";

import ImagePageViewer from "../../../components/ImagePageViewer";

import {
  getAboutUsHtml,
  getAboutUsImageList
} from "../../../selectors/helpSelector";
import { fetchAboutUs } from "../../../actions/helpActions";
import {
  getUserProfile,
  getUserPrivilegeMap
} from "../../../selectors/UserSelector";
import { ModuleName } from "../../../constants";
import { getNotificationsCount } from "../../../selectors/NotificationSelector";

class AboutUs extends Component {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.props.navigation.setParams({
      showNotification: this.props.privilegeMap
        ? this.props.privilegeMap[ModuleName.NOTIFICATION]
        : false
    });

    this.didFocusSubscription = this.props.navigation.addListener(
      "didFocus",
      payload => {
        this.props.navigation.setParams({
          notificationCount: this.props.notificationCount
        });
      }
    );
  }

  componentWillUnmount() {
    this.didFocusSubscription.remove();
  }

  componentDidMount() {
    this.props.fetchAboutUs();
  }
  componentDidUpdate(prevProps) {
    if (this.props.privilegeMap !== prevProps.privilegeMap) {
      this.props.navigation.setParams({
        showNotification: this.props.privilegeMap
          ? this.props.privilegeMap[ModuleName.NOTIFICATION]
          : false
      });
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.props.aboutUsImageList && (
          <ImagePageViewer
            images={this.props.aboutUsImageList.map(url => ({ uri: url }))}
          />
        )}

        <View style={{ flexGrow: 1, overflow: "hidden" }}>
          {this.props.aboutUsgetUserProfileHtml && (
            <WebView source={{ html: this.props.aboutUsHtml }} />
          )}
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  const aboutUsHtml = getAboutUsHtml(state);
  const aboutUsImageList = getAboutUsImageList(state);
  const profile = getUserProfile(state);
  const privilegeMap = getUserPrivilegeMap(state);
  const notificationCount = getNotificationsCount(state);
  return {
    aboutUsHtml,
    aboutUsImageList,
    profile,
    privilegeMap,
    notificationCount
  };
};

const mapDispatchToProps = { fetchAboutUs };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AboutUs);
