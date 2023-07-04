import React from "react";
import Button from "./button";
import CountdownTimer from "./countdownTimer";

export default class RallyCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeout: 0,
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

  async componentDidMount() {
    const data = {
      caller: sessionStorage.getItem("user"),
    };
    const response = await fetch("/api/getTimeout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const results = await response.json();
    this.setState({ timeout: results.timeRemaining }, () => {
      this.setButtonInactive();
    });
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
    }, this.state.timeout); // 30 minutes in milliseconds
  };

  async callRally(e) {
    e.preventDefault();
    var confirmation = confirm(
      "Are you sure you would like to call this rally?"
    );
    if (confirmation) {
      this.getEmails(() => {
        // this.setButtonInactive();
        console.log(this.state.emails);
        this.sendEmails();
        window.location.reload();
      });
    }
  }

  async sendEmails() {
    const formatted_addy = this.state.address.replace(/ /g, "+");
    const data = {
      emails: this.state.emails,
      subject: "Pickleball is Calling!",
      message: `${this.state.name} is calling a Rally!  You can meet your fellow players at:  ${this.state.address}`,
      html: `
      <!DOCTYPE html>
      <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
      
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width,initial-scale=1">
          <meta name="x-apple-disable-message-reformatting">
          <title></title>
          <!--[if mso]>
        <noscript>
          <xml>
            <o:OfficeDocumentSettings>
              <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
          </xml>
        </noscript>
        <![endif]-->
          <style>
              table,
              td,
              div,
              h1,
              p {
                  font-family: Arial, sans-serif;
              }
          </style>
      </head>
      
      <body style="margin:0;padding:0;">
          <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;background:#ffffff;">
              <tr>
                  <td align="center" style="padding:0;">
                      <table role="presentation" style="width:602px;border-collapse:collapse;border:1px solid #cccccc;border-spacing:0;text-align:left;">
                          <tr>
                              <td align="center" style="padding:0px 0 30px 0;background:#70bbd9;">
                                  <img src="https://pickleball-rally-deployment-atwf-25rpfmwdj-sawilding.vercel.app/_next/image?url=%2FPR-logo.png&w=256&q=75" alt="" width="300" style="height:auto;display:block;" />
                              </td>
                          </tr>
                          <tr>
                              <td style="padding:36px 30px 42px 30px;">
                                  <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;">
                                      <tr>
                                          <td style="padding:0 0 36px 0;color:#153643;">
                                              <h1 style="font-size:24px;margin:0 0 20px 0;font-family:Arial,sans-serif;">${this.state.name} is calling a Rally!</h1>
                                              <p style="margin:0 0 12px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;">You can meet your fellow players at: <br/> ${this.state.address}</p>
                                              <img width="100% " src="https://maps.googleapis.com/maps/api/staticmap?center=${formatted_addy}&zoom=13&scale=2&size=600x300&maptype=roadmap&format=png&markers=color:red%7C${formatted_addy}&key=AIzaSyAm5xibxmBd3pRkeXtKA_zuZjjyuh5StHE " alt="Google map of Albany, NY " />
      
                                          </td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>
                          <tr>
                              <td style="padding:30px;background:#F3FF10;">
                                  <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;font-size:9px;font-family:Arial,sans-serif;">
                                      <tr>
                                          <td style="padding:0;width:50%;" align="left">
                                              <p style="margin:0;font-size:14px;line-height:16px;font-family:Arial,sans-serif;color:#00000;">
                                                  &reg; Seth Wilding 2023<br/><a href="https://pickleball-rally-deployment-atwf.vercel.app/" style="color:#000000;text-decoration:underline;">Leave Rally</a>
                                              </p>
                                          </td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>
                      </table>
                  </td>
              </tr>
          </table>
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

      const results = await response.json();
      this.setState({ emails: results.emails }, callback);
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
    const { name, address, memberCount, frequency, skillLevel, isJoined } =
      this.state;

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
                  <CountdownTimer duration={this.state.timeout / 1000} />
                )}
              </div>
            )}
          </div>
        </section>
      </>
    );
  }
}
