import React from "react";
import Button from "./button";

export default class RallyCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rallyId: props.id,
      name: props.name,
      memberCount: props.memberCount,
      frequency: props.frequency,
      skillLevel: props.skillLevel,
      address: props.address,
      lat: props.lat,
      lng: props.lng,
      isJoined: props.isJoined,
    };
    this.joinRally = this.joinRally.bind(this);
    this.leaveRally = this.leaveRally.bind(this);
  }

  async joinRally(e) {
    e.preventDefault();
    const { rallyId } = this.state;
    const data = {
      userId: sessionStorage.getItem("user"),
      rallyId: rallyId,
    };

    try {
      const response = await fetch("/api/joinRally", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log("Form submitted successfully");

        // Perform any additional actions after successful form submission
      } else {
        console.error("Form submission failed");
        // Handle form submission errors
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      // Handle any network or other errors
    }
    window.location.reload();
  }

  async leaveRally(e) {
    e.preventDefault();
    const { rallyId } = this.state;
    const data = {
      userId: sessionStorage.getItem("user"),
      rallyId: rallyId,
    };

    try {
      const response = await fetch("/api/leaveRally", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log("Form submitted successfully");

        // Perform any additional actions after successful form submission
      } else {
        console.error("Form submission failed");
        // Handle form submission errors
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      // Handle any network or other errors
    }
    window.location.reload();
  }

  render() {
    const { name, address, memberCount, frequency, skillLevel, isJoined } =
      this.state;

    return (
      <>
        <section className="rallyCard flex place-content-between">
          <div className="rallyInfo">
            <ul className="flex flex-wrap rallyInfoItems">
              <li>
                Name: <span>{name}</span>
              </li>
              <li>
                Address: <span>{address}</span>
              </li>
              <li>
                Members: <span>{memberCount}</span>
              </li>
              <li>
                Frequency: <span>{frequency}</span>
              </li>
              <li>
                Skill Level: <span>{skillLevel}</span>
              </li>
            </ul>
          </div>
          <div className="rally-btn">
            {isJoined ? (
              <Button content="Leave" action={this.leaveRally} />
            ) : (
              <Button content="Join" action={this.joinRally} />
            )}
          </div>
        </section>
      </>
    );
  }
}
