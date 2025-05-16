import Button from "./Button";
import React from "react";
import PropTypes from "prop-types";

import "./ButtonPanel.css";

export default class ButtonPanel extends React.Component {
  static propTypes = {
    clickHandler: PropTypes.func,
  };

  handleClick = buttonName => {
    this.props.clickHandler(buttonName);
  };

  render() {
    return (
      <div className="component-button-panel">
        <div>
          <Button name="AC" clickHandler={this.handleClick} data-test="clear-button" />
          <Button name="+/-" clickHandler={this.handleClick} data-test="negate-button" />
          <Button name="%" clickHandler={this.handleClick} data-test="percent-button" />
          <Button name="÷" clickHandler={this.handleClick} orange data-test="divide-button" />
        </div>
        <div>
          <Button name="7" clickHandler={this.handleClick} data-test="number-7" />
          <Button name="8" clickHandler={this.handleClick} data-test="number-8" />
          <Button name="9" clickHandler={this.handleClick} data-test="number-9" />
          <Button name="x" clickHandler={this.handleClick} orange data-test="multiply-button" />
        </div>
        <div>
          <Button name="4" clickHandler={this.handleClick} data-test="number-4" />
          <Button name="5" clickHandler={this.handleClick} data-test="number-5" />
          <Button name="6" clickHandler={this.handleClick} data-test="number-6" />
          <Button name="-" clickHandler={this.handleClick} orange data-test="subtract-button" />
        </div>
        <div>
          <Button name="1" clickHandler={this.handleClick} data-test="number-1" />
          <Button name="2" clickHandler={this.handleClick} data-test="number-2" />
          <Button name="3" clickHandler={this.handleClick} data-test="number-3" />
          <Button name="+" clickHandler={this.handleClick} orange data-test="add-button" />
        </div>
        <div>
          <Button name="0" clickHandler={this.handleClick} wide data-test="number-0" />
          <Button name="." clickHandler={this.handleClick} data-test="decimal-button" />
          <Button name="=" clickHandler={this.handleClick} orange data-test="equals-button" />
        </div>
      </div>
    );
  }
}
