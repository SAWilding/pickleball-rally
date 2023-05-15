"use client";

import React from "react";
import Link from "next/link";

export default class Button extends React.Component {
  constructor(props) {
    super(props);
    this.href = props.href;
    this.content = props.content;
    this.state = {
      count: 0,
    };
  }
  render() {
    return (
      <Link href={this.href}>
        <button
          className="compButton"
          onClick={() => this.setState({ count: this.state.count + 1 })}
        >
          {this.content}
        </button>
      </Link>
    );
  }
}
