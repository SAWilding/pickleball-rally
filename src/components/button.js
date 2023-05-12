"use client";

import React from "react";

export default class Button extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
    };
  }
  render() {
    return (
      <button
        className="p-8 hover:bg-gray-800"
        onClick={() => this.setState({ count: this.state.count + 1 })}
      >
        {this.state.count}
      </button>
    );
  }
}
