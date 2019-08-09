/**
 * @component   : StepIndicator
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Monday Jan 28, 2019 15:43:03 IST
 * @description : StepIndicator
 */

import React, {Component}  from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import NativeStepIndicator from 'react-native-step-indicator';

import Colors from '../res/Colors';

const customStyles = {
  stepIndicatorSize: 25,
  currentStepIndicatorSize:30,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 2,
  stepStrokeCurrentColor: Colors.COLORPRIMARY,
  stepStrokeWidth: 2,
  stepStrokeFinishedColor: Colors.COLORPRIMARY,
  stepStrokeUnFinishedColor: Colors.SECONDARY_TEXT,
  separatorFinishedColor: Colors.COLORPRIMARY,
  separatorUnFinishedColor: Colors.SECONDARY_TEXT,
  stepIndicatorFinishedColor: Colors.COLORPRIMARY,
  stepIndicatorUnFinishedColor: Colors.WHITE,
  stepIndicatorCurrentColor: Colors.WHITE,
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: Colors.COLORPRIMARY,
  stepIndicatorLabelFinishedColor: Colors.WHITE,
  stepIndicatorLabelUnFinishedColor: Colors.SECONDARY_TEXT,
  labelColor: Colors.SECONDARY_TEXT,
  labelSize: 13,
  currentStepLabelColor: Colors.COLORPRIMARY,
};

export class StepIndicator extends Component {
  static propTypes = {
    currentStep: PropTypes.number,
  }

  static defaultProps = {
    currentStep: 0,
  }

  constructor(props) {
    super(props);

    this.state = {
      labels: [],
    }
  }

  componentDidMount () {
    this._updateLabels();
  }
  componentDidUpdate(prevProps) {
    if (this.props.children !== prevProps.children) {
      this._updateLabels();
    }
  }

  _updateLabels = () => {
    const { children } = this.props;
    if (children) {
      this.setState({ labels: children.map(child => child.props.label) });
    }
    return this.setState({ label: [] });
  }

  _renderCurrentStep = () => {
    const { children } = this.props;
    if (!children || children.length <= this.props.currentStep) {
      return null;
    }
    return children[this.props.currentStep];
  }

  render() {
    const numSteps = this.props.children ? this.props.children.length : 0;
    const { style, children, ...rest } = this.props;

    return (
      <View style={[styles.container, style ]}>
        <NativeStepIndicator
          customStyles={customStyles}
          currentPosition={this.props.currentStep}
          labels={this.state.labels}
          stepCount={numSteps}
          {...rest}
          style={styles.stepIndicator}
        />
        { this._renderCurrentStep() }
      </View>
      )
  }
}

export class Step extends Component {
  static propTypes = {
    visible: PropTypes.bool,
  }
  static defaultProps = {
    visible: false,
  }
  render () {
    if (!this.props.visible) {
      return null;
    }
    const { style, ...rest } = this.props;
    return (<View style={[styles.step, style]} {...rest} />);
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  stepIndicator: {
    marginBottom: 4
  },
  step: {
    flex: 1,
    marginTop: 8,
  }
});
