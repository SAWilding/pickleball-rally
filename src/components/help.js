import React from "react";

export default class Help extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isMessageActive: false,
      message: props.message || "Content goes here",
      id: props.id || null,
    };
  }

  toggleMessage = () => {
    this.setState({ isMessageActive: !this.state.isMessageActive });
  };

  handleClick = () => {
    this.toggleMessage();
  };

  renderMessage = () => {
    return (
      <>
        <div className="overlay help-overlay">
          <div className="pop-up help-pop-up">
            <div onClick={this.toggleMessage} className="help-exit">
              X
            </div>
            <div
              className="help-message"
              dangerouslySetInnerHTML={{ __html: this.state.message }}
            ></div>
          </div>
        </div>
      </>
    );
  };

  render() {
    return (
      <>
        <span
          className="help-btn"
          id={this.state.id}
          onClick={this.handleClick}
        >
          i
        </span>
        {this.state.isMessageActive && this.renderMessage()}
      </>
    );
  }
}
