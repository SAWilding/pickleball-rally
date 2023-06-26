import "@/app/globals.css";
import "@/styles/small.css";

import Header from "@/components/header";
import React from "react";
import Footer from "@/components/footer";
import RallyCard from "@/components/rallyCard";

export default class Joined extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      joinedRallies: [],
      data: [],
    };
    this.fetchJoinedRallyIds = this.fetchJoinedRallyIds.bind(this);
    this.fetchJoinedRallies = this.fetchJoinedRallies.bind(this);
  }

  componentDidMount() {
    this.fetchJoinedRallyIds(this.fetchJoinedRallies);
    // this.fetchJoinedRallies();
  }

  async fetchJoinedRallyIds(callback) {
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
      this.setState({ joinedRallies: rallyIds }, () => {
        callback();
      });
    } catch (error) {
      console.log("Error fetching joined rallies", error);
    }
  }

  async fetchJoinedRallies() {
    const { joinedRallies } = this.state;
    const data = { rallyIds: joinedRallies };
    try {
      const response = await fetch(`/api/getJoinedRallies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const rallies = await response.json();
      this.setState({ data: rallies });
    } catch (error) {
      console.log("There was an error fetching Joined Rallies", error);
    }
  }

  render() {
    return (
      <>
        <Header></Header>
        <main>
          <h1 className="text-center">Your Rallies</h1>
          {this.renderResults()}
        </main>
        <Footer></Footer>
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
                members={rally.members}
                isJoined={isJoined}
                canRally={true}
              />
            );
          })}
        </section>
      </>
    );
  }
}
