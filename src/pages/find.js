import "@/app/globals.css";
import Header from "@/components/header";
import React from "react";
import Footer from "@/components/footer";
import RallyCard from "@/components/rallyCard";

export default class Find extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      lat: 0,
      lng: 0,
      locationBoxIsVisible: true,
    };
    this.fetchData = this.fetchData.bind(this);
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
  }

  async fetchData() {
    const lat = this.state.lat;
    const lng = this.state.lng;
    if (lat != 0 && lng != 0) {
      try {
        const response = await fetch(
          `/api/getRallies?latitude=${lat}&longitude=${lng}&distance=10`,
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
            <form action="" className="locationForm text-center">
              <input type="zip" placeholder="Enter zip" />
              <input type="submit" className="compButton" />
            </form>
          </div>
        </section>
      </>
    );
  }

  renderResults() {
    const { data } = this.state;
    return (
      <>
        <section className="results max-w-screen-lg">
          <p>Results:</p>
          <hr />
          {data.map((rally) => (
            <RallyCard
              key={rally.id}
              name={rally.name}
              memberCount={rally.memberCount}
              frequency={rally.frequency}
              skillLevel={rally.skillLevel}
              address={rally.address}
            ></RallyCard>
          ))}
        </section>
      </>
    );
  }
}
