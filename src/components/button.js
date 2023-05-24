"use client";

import React from "react";
import Link from "next/link";

export default class Button extends React.Component {
  constructor(props) {
    super(props);
    this.action = props.action || null;
    this.href = props.href || "#";
    this.content = props.content || "Add content here.";
    this.state = {
      count: 0,
    };
  }
  render() {
    return (
      <Link href={this.href}>
        <button className="compButton" onClick={this.action}>
          <span>{this.content}</span>
        </button>
      </Link>
    );
  }
}
