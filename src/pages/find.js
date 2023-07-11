import "@/app/globals.css";
import "@/styles/small.css";

import Header from "@/components/header";
import React from "react";
import Footer from "@/components/footer";
import RallyCard from "@/components/rallyCard";
import Help from "@/components/help";
import helpMessage from "../library/help-message.json";

export default class Find extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      joinedRallies: [],
      data: [],
      lat: 0,
      lng: 0,
      locationBoxIsVisible: true,
      zip: 0,
      helpMessage: helpMessage["help-messages"]["find"],
      distance: 20,
      isLocationAllowed: false,
    };
    this.fetchData = this.fetchData.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetchJoinedRallyIds = this.fetchJoinedRallyIds.bind(this);
  }

  componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          this.setState({ lat: latitude });
          this.setState({ lng: longitude });
          this.setState(
            {
              locationBoxIsVisible: !this.state.locationBoxIsVisible,
            },
            () => {
              this.setState({ isLocationAllowed: true });
              this.fetchData();
            }
          );
        },
        (error) => {
          console.log("Error getting current location:", error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
    this.fetchJoinedRallyIds();
  }

  async fetchJoinedRallyIds() {
    const userId = sessionStorage.getItem("user");
    const data = { userId: userId };
    try {
      const response = await fetch(`/api/getJoinedRallyIds`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const rallyIds = await response.json();
      this.setState({ joinedRallies: rallyIds });
    } catch (error) {
      console.log("Error fetching joined rallies", error);
    }
  }

  async fetchData() {
    const lat = this.state.lat;
    const lng = this.state.lng;
    const distance = this.state.distance;
    if (lat != 0 && lng != 0) {
      try {
        const response = await fetch(
          `/api/getRallies?latitude=${lat}&longitude=${lng}&distance=${distance}`,
          { method: "GET" }
        );
        console.log(
          `/api/getRallies?latitude=${lat}&longitude=${lng}&distance=${distance}`
        );
        const data = await response.json();
        this.setState({ data });
      } catch (error) {
        console.error("Error fetching Firestore collection:", error);
      }
    } else {
      console.log("Could not find user's location.");
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    const apiKey = process.env.NEXT_PUBLIC_GEO_API_KEY;
    const zipCode = this.state.zip;
    if (zipCode.length != 5) {
      return window.alert("Please enter a valid ZIP code.");
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode}&key=${apiKey}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "ZERO_RESULTS") {
          console.log("Please enter a valid ZIP.");
        } else {
          const latitude = data.results[0].geometry.location.lat;
          const longitude = data.results[0].geometry.location.lng;
          this.setState({ lat: latitude });
          this.setState({ lng: longitude }, () => {
            this.fetchData();
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    return (
      <>
        <Header></Header>
        <main>
          <h1 className="text-center">
            Find a Rally Near You <Help message={this.state.helpMessage}></Help>
          </h1>
          {this.state.locationBoxIsVisible && this.renderLocation()}
          {this.renderDistanceSelect()}
          {this.renderResults()}
        </main>
        <Footer></Footer>
      </>
    );
  }
  renderLocation() {
    return (
      <>
        <section className="max-w-screen-lg location">
          <p className="text-center">
            Allow us to use your location <br /> or
          </p>
          <div className="horizontal-line"></div>
          <div className="flex items-center">
            <div className="locationForm">
              <input
                type="zip"
                placeholder="Enter zip"
                name="zip"
                onChange={this.handleChange}
                required
                minLength={5}
                maxLength={5}
              />
            </div>
          </div>
        </section>
      </>
    );
  }

  renderResults() {
    const { data, joinedRallies } = this.state;

    return (
      <>
        <section className="results max-w-screen-lg">
          <p>Results:</p>
          <hr />
          {data.map((rally) => {
            let isJoined = false;
            if (joinedRallies.includes(rally.id)) {
              console.log(isJoined);
              isJoined = true;
            }
            return (
              <RallyCard
                key={rally.id}
                id={rally.id}
                name={rally.name}
                memberCount={rally.memberCount}
                frequency={rally.frequency}
                skillLevel={rally.skillLevel}
                address={rally.address}
                lat={rally.location.latitude}
                lng={rally.location.longitude}
                isJoined={isJoined}
                onFindPage={true}
              />
            );
          })}
        </section>
      </>
    );
  }

  handleDisanceSubmit = (e) => {
    e.preventDefault();
    this.fetchData();
  };

  handleSlider = (e) => {
    this.setState({ distance: e.target.value });
  };

  renderDistanceSelect() {
    return (
      <>
        <section className="distance-section">
          <form
            className="distance-form"
            onSubmit={
              this.state.isLocationAllowed
                ? this.handleDisanceSubmit
                : this.handleSubmit
            }
          >
            <label htmlFor="slider">Search Radius:</label>
            <div className="distance-grid">
              <input
                type="range"
                id="slider"
                name="slider"
                className="distance-slider"
                defaultValue={20}
                step={5}
                min={5}
                max={100}
                onChange={this.handleSlider}
              />
              <div className="distance-value">{this.state.distance} miles</div>
            </div>
            <input
              type="submit"
              value="Search"
              className="compButton distance-submit"
            />
          </form>
        </section>
      </>
    );
  }
}
