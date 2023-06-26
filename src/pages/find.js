import "@/app/globals.css";
import "@/styles/small.css";

import Header from "@/components/header";
import React from "react";
import Footer from "@/components/footer";
import RallyCard from "@/components/rallyCard";

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
    if (lat != 0 && lng != 0) {
      try {
        const response = await fetch(
          `/api/getRallies?latitude=${lat}&longitude=${lng}&distance=20`,
          { method: "GET" }
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
    const apiKey = "AIzaSyAm5xibxmBd3pRkeXtKA_zuZjjyuh5StHE";
    const zipCode = this.state.zip;

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
          <h1 className="text-center">Find a Rally Near You</h1>
          {this.state.locationBoxIsVisible && this.renderLocation()}
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
            <form
              className="locationForm text-center"
              onSubmit={this.handleSubmit}
            >
              <input
                type="zip"
                placeholder="Enter zip"
                name="zip"
                onChange={this.handleChange}
                required
                minLength={5}
                maxLength={5}
              />
              <input type="submit" className="compButton" />
            </form>
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
}
