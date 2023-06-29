import React from "react";
import Button from "./button";
import CountdownTimer from "./countdownTimer";

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
      members: props.members || [],
      emails: [],
      isActive: true,
      canRally: props.canRally || false,
      onFindPage: props.onFindPage || false,
    };
    this.joinRally = this.joinRally.bind(this);
    this.leaveRally = this.leaveRally.bind(this);
    this.callRally = this.callRally.bind(this);
    this.getEmails = this.getEmails.bind(this);
    this.sendEmails = this.sendEmails.bind(this);
  }

  setButtonInactive = () => {
    this.setState({ isActive: false }, () => {
      console.log(this.state.isActive);
    });
    // Set a timeout to reactivate the button after 30 minutes
    setTimeout(() => {
      this.setState({ isActive: true }, () => {
        console.log(this.state.isActive);
      });
    }, 30 * 60 * 1000); // 30 minutes in milliseconds
  };

  async callRally(e) {
    e.preventDefault();
    this.setButtonInactive();
    this.getEmails(() => {
      console.log(this.state.emails);
      this.sendEmails();
    });
  }

  async sendEmails() {
    const data = {
      emails: this.state.emails,
      subject: "Pickleball is Calling!",
      message: `There is a Rally occuring!  You can find your fellow players at:  ${this.state.address}`,
      html: `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Pickleball Rally Email</title>
        <style>
          /* Add your CSS styles here */
        </style>
      </head>
      <body>
        <img src="https://pickleball-rally-deployment-atwf-25rpfmwdj-sawilding.vercel.app/_next/image?url=%2FPR-logo.png&w=256&q=75" alt="Logo image">
        <h1>There is a Rally occuring!</h1>
        <p>You can find your fellow players at: </p> 
        <p>${this.state.address}</p>
      </body>
      </html>
    `,
    };
    console.log(this.state.emails);
    try {
      const response = await fetch("/api/sendEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        console.log("Form submitted successfully");
      } else {
        console.error("Form submission failed");
      }
    } catch (error) {
      console.log("There was an error sending the emails", error);
    }
  }

  async getEmails(callback) {
    const data = {
      userIds: this.state.members,
      caller: sessionStorage.getItem("user"),
    };
    try {
      const response = await fetch("/api/getEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const emails = await response.json();
      this.setState({ emails: emails.emails }, callback);
    } catch (error) {
      console.log("There was an error getting the user emails", error);
    }
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
      } else {
        console.error("Form submission failed");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
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
    const {
      name,
      address,
      memberCount,
      frequency,
      skillLevel,
      isJoined,
      isActive,
      canRally,
    } = this.state;

    return (
      <>
        <section className="rallyCard flex place-content-between">
          <div className="rallyInfo">
            <ul className="rallyInfoItems">
              <li className="rallyName">
                Name: <span>{name}</span>
              </li>
              <li className="rallyAddress">
                Address: <span>{address}</span>
              </li>
              <li className="rallyCount">
                Members: <span>{memberCount}</span>
              </li>
              <li className="rallyFreq">
                Frequency: <span>{frequency}</span>
              </li>
              <li className="rallySkill">
                Skill Level: <span>{skillLevel}</span>
              </li>
            </ul>
          </div>
          <div className="rally-btns">
            <div className="rally-btn">
              {isJoined ? (
                <Button content="Leave" action={this.leaveRally} />
              ) : (
                <Button content="Join" action={this.joinRally} />
              )}
            </div>
            {this.state.onFindPage ? null : (
              <div className="rally-btn">
                {this.state.isActive && this.state.canRally ? (
                  <Button content="Rally" action={this.callRally} />
                ) : (
                  <CountdownTimer duration={30 * 60} />
                )}
              </div>
            )}
          </div>
        </section>
      </>
    );
  }
}
