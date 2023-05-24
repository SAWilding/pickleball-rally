import "@/app/globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import React from "react";

export default class Create extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      memberCount: 1,
      frequency: 0,
      skillLevel: "",
      latitude: 43.82302377814921,
      longitude: -111.79139248859552,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  async handleSubmit(e) {
    e.preventDefault();
    console.log(this.state);
    const { name, memberCount, frequency, skillLevel, latitude, longitude } =
      this.state;
    const data = {
      name: name,
      memberCount: memberCount,
      frequency: frequency,
      skillLevel: skillLevel,
      latitude,
      longitude,
    };

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
      <form
        onSubmit={this.handleSubmit}
        method="post"
        className="form createForm"
      >
        <label htmlFor="name">
          Rally Name:
          <input
            type="text"
            value={this.state.name}
            name="name"
            id="name"
            onChange={this.handleChange}
          />
        </label>
        <label htmlFor="skillLevel">
          Skill Level:
          <select
            name="skillLevel"
            id="skillLevel"
            onChange={this.handleChange}
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Expert">Expert</option>
          </select>
        </label>
        <label htmlFor="frequency">
          Average Meetups Per Week
          <input
            type="number"
            value={this.state.frequency}
            name="frequency"
            id="frequency"
            onChange={this.handleChange}
          />
        </label>
        <label htmlFor="latitude">
          Latitude:
          <input
            type="number"
            name="latitude"
            value={this.state.latitude}
            id="latitude"
            onChange={this.handleChange}
          />
        </label>
        <label htmlFor="longitude">
          Longitute:
          <input
            type="number"
            name="longitude"
            value={this.state.longitude}
            id="longitude"
            onChange={this.handleChange}
          />
        </label>
        <input type="submit" className="compButton" />
      </form>
    );
  }
}

// {
//   name: "Porker Park",
//   frequency: 7,
//   memberCount: 6,
//   skillLevel: "beginner",
//   location: [43.82302377814921, -111.79139248859552],
// }
