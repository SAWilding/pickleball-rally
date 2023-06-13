"use client";
import React from "react";
import Button from "./button";

export default class RallyCard extends React.Component {
  constructor(props) {
    super(props);
    this.name = props.name;
    this.memberCount = props.memberCount;
    this.frequency = props.frequency;
    this.skillLevel = props.skillLevel;
    this.address = props.address;
  }

  render() {
    return (
      <>
        <section className="rallyCard flex">
          <div className="rallyInfo">
            <ul className="flex flex-wrap rallyInfoItems">
              <li>
                Name: <span>{this.name}</span>
              </li>
              <li>
                Address:
                <span>{this.address}</span>
              </li>
              <li>
                Members: <span>{this.memberCount}</span>
              </li>
              <li>
                Frequency: <span>{this.frequency}</span>
              </li>
              <li>
                Skill Level: <span>{this.skillLevel}</span>
              </li>
            </ul>
          </div>
          <div>
            <Button content="Join"></Button>
          </div>
        </section>
      </>
    );
  }
}
