"use client";
import React from "react";
import Button from "./button";

export default class RallyCard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <section className="rallyCard flex">
          <div className="rallyInfo">
            <ul className="flex flex-wrap rallyInfoItems">
              <li>
                Name: <span></span>
              </li>
              <li>
                Location: <span></span>
              </li>
              <li>
                Members: <span></span>
              </li>
              <li>
                Frequency: <span></span>
              </li>
              <li>
                Skill Level: <span></span>
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
