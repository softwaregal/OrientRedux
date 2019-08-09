/**
 * @component   : RegisterComplaint
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Tuesday Jan 15, 2019 11:46:29 IST
 * @description : RegisterComplaint
 */

import React, {Component}  from 'react'
import PropTypes from 'prop-types'
import { View, TextInput } from 'react-native';
import { Card } from 'native-base';
import { connect } from 'react-redux';

import PrimaryButton from '../../../components/PrimaryButton';
import { addComplain } from '../../../actions/helpActions';
import { showErrorMessage } from '../../../actions/MessageActions';
import { getUserProfile } from '../../../selectors/UserSelector';

class RegisterComplaint extends Component {
  static propTypes = {
  }

  static defaultProps = {
  }

  constructor (props) {
    super(props);

    this.state = {
      complain: null,
    };
  }

  _registerComplaint = () => {
    const { complain } = this.state;
    if (!complain || complain.trim().length === 0) {
      this.props.showErrorMessage('Please provide your complaint details');
      return;
    }

    this.props.addComplain(this.props.profile.RegisteredMobileNo, complain);
    this.setState({ complain: null });
  }

  render() {
    return (
      <View style={{ flex: 1, padding: 16 }}>
        <Card style={{ padding: 16 }}>
          <TextInput
            placeholder='Enter message'
            multiline={true}
            style={{ borderWidth: 1, borderColor: 'black', textAlignVertical: 'top' }}
            numberOfLines={8}
            value={this.state.complain}
            onChangeText={text => this.setState({ complain: text })}
	    minHeight={120}
	    maxHeight={120}
          />
          <PrimaryButton title='Submit' onPress={this._registerComplaint} />
        </Card>
    </View>
    )
  }
}

const mapStateToProps = state => {
  const profile = getUserProfile(state);
  return { profile };
}

const mapDispatchToProps = { addComplain, showErrorMessage };

export default connect(mapStateToProps, mapDispatchToProps)(RegisterComplaint);
