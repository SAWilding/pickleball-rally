import "@/app/globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import React from "react";
import Map from "@/components/map";

export default class Create extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      memberCount: 1,
      frequency: 0,
      skillLevel: "",
      skillLevel: "Beginner",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  async handleSubmit(e) {
    e.preventDefault();
    const { name, memberCount, frequency, skillLevel } = this.state;
    const data = {
      name: name,
      memberCount: memberCount,
      frequency: frequency,
      skillLevel: skillLevel,
      latitude: localStorage.getItem("lat"),
      longitude: localStorage.getItem("lng"),
      address: localStorage.getItem("address"),
    };
    console.log(data.address);
    if (data.address === "") {
      console.log("Please select an address.");
    } else {
      try {
        const response = await fetch("/api/createRally", {
          method: "POST",
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
    }
  }
  render() {
    return (
      <>
        <Header></Header>
        <main>
          <section className="max-w-screen-lg createMain">
            <h1 className="text-center">Create Your Rally</h1>
            {this.renderForm()}
          </section>
        </main>
        <Footer></Footer>
      </>
    );
  }

  renderForm() {
    return (
      <>
        <form onSubmit={this.handleSubmit} method="post" className="createForm">
          <label htmlFor="name">Rally Name: </label>
          <input
            type="text"
            value={this.state.name}
            name="name"
            onChange={this.handleChange}
            required
          />

          <label htmlFor="skillLevel">Skill Level:</label>
          <select
            name="skillLevel"
            id="skillLevel"
            onChange={this.handleChange}
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Expert">Expert</option>
          </select>

          <label htmlFor="frequency">Average Meetups Per Week</label>
          <input
            type="number"
            value={this.state.frequency}
            name="frequency"
            id="frequency"
            onChange={this.handleChange}
          />
          <Map></Map>
          <input type="submit" className="compButton" />
        </form>
      </>
    );
  }
}
