import React, { useState, useContext, useEffect } from "react";
import "../../css/join_in_events.css";
import getEventsByType from "../../../API/getEventsByType";
import addUserToEvent from "../../../API/addUserToEvent";

import { render } from "react-dom";
import { Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import Alert from "./Alert";

// optional cofiguration
const options = {
  position: "top center",
  timeout: 1500,
  width: "100px",
  offset: "100px",
  transition: "scale",
};

const Root = () => (
  <AlertProvider template={AlertTemplate} {...options}>
    <Alert />
  </AlertProvider>
);

class JoinInEvent extends React.Component {
  hrefTitle = window.location.href.substring(
    window.location.href.indexOf("=") + 1,
    window.location.href.length
  );
  eventCategory = this.hrefTitle.substring(
    this.hrefTitle.indexOf(":") + 1,
    this.hrefTitle.length
  );

  constructor(props) {
    super(props);
    // this.sportType = this.props.match.params.sportType;
    this.state = {
      sportEvents: [],
    };
  }

  componentWillMount() {
    console.log("Component Will Mount");
    getEventsByType(this.eventCategory)
      .then((data) => {
        this.setState({ sportEvents: data.data });
      })
      .catch((error) => {
        console.log("ERROR", error);
      });
  }

  joinInEvent(e, sportEvent) {
    // e.preventDefault();
    const token = JSON.parse(localStorage.getItem("token"));
    console.log(
      "joinInEvent - sportEvent: " +
        JSON.stringify(sportEvent) +
        "      This is the user ID = " +
        token.uid
    );
    let userJoined = false;
    if (sportEvent.signedUpUsers.length >= parseInt(sportEvent.participants)) {
      alert(
        "Sorry, there is no more room for you to join! Please select another event."
      );
      console.log("YOU CAN NO LONGER JOIN EVENT");
    }
    for (let i = 0; i < sportEvent.signedUpUsers.length; i++) {
      if (token.uid === sportEvent.signedUpUsers[i]) {
        userJoined = true;
        break;
      }
    }
    if (userJoined) {
      alert("You already joined this event");
    } else {
      addUserToEvent(sportEvent.eventName, token.uid)
        .then((data) => {
          // console.log('this is suppose to be the daata', this.state.sportEvents[i].eventName);
          //update signedUpUsers based on returned object
          for (var i = 0; i < this.state.sportEvents[0].participants; i++) {
            if (this.state.sportEvents[i].eventName === data.data.eventName) {
              console.log("here is the length", this.state.sportEvents.length);
              this.state.sportEvents[i].signedUpUsers = data.data.signedUpUsers;
              console.log(
                "signedup Users",
                this.state.sportEvents[i].signedUpUsers
              );
              console.log(
                "here is the state crap",
                this.state.sportEvents[0].participants
              );
              break;
            }
          }
          //NEED TO PULL THE NUMBER OF PEOPLE JOINED + DATA IS NOT RECOGNIZING THE ALLOWED USERS TO JOIN
          // this.setState({sportEvents: data.data});
          // Force a render with a simulated state change
          this.setState({ state: this.state });
          // Force a render without state change...
          //this.forceUpdate();
          alert("You have successfully joined!");
          window.location =  window.location.href;
          console.log("YOU HAVE SUCCESSFULLY JOINED");
        })
        .catch((error) => {
          console.log("ERROR", error);
        });
    }
  }

  state = {
    visible: false,
  };

  toggle() {
    this.setState({
      visible: !this.state.visible,
    });
  }

  render() {
    console.log("Render");
    return (
      <div className="content-wrapper">
        <section className="content-header">
          <h1>
            <strong>
              {this.hrefTitle
                .substring(0, this.hrefTitle.indexOf("@"))
                .toUpperCase()}
              :
            </strong>{" "}
            {this.eventCategory.replace(/%20/g, " ")}
            <small>
              <i>"Meet new people and join as many events as you want."</i>
            </small>
          </h1>
          <ol className="breadcrumb">
            <li>
              <a href="/home">
                <i className="fas fa-door-open"></i>
                <span className="text-orange"> Main</span>
              </a>
            </li>
            <li>
              <a href="/events">
                <span className="text-orange"> Events</span>
              </a>
            </li>
            <li>
              <a
                href={`/events~category=${this.hrefTitle.substring(
                  0,
                  this.hrefTitle.indexOf(":")
                )}`}
              >
                <span className="text-orange">
                  {" "}
                  {this.hrefTitle.substring(0, this.hrefTitle.indexOf("@"))}
                </span>
              </a>
            </li>
            <li>Join in</li>
          </ol>
        </section>
        <section className="content">
          <div>
            {this.state.sportEvents.length > 0 ? (
              this.state.sportEvents.map((sportEvent) => (
                <div className="joinin-container">
                  <div className="joinin-main">
                    <div className="joinin-preview">
                      <h6>{this.eventCategory}</h6>
                      <h2>{sportEvent.eventDate}</h2>
                    </div>
                    <div className="joinin-info">
                      <div className="joinin-progress-container">
                        <div className="joinin-progress"></div>
                        <span className="joinin-progress-text">
                          {/* TODO: progress bar needs to be updated to reflect (sportEvent.signedUpUsers.length / sportEvent.participants) * 100 % */}
                          {sportEvent.signedUpUsers.length} /{" "}
                          {sportEvent.participants} Participants
                        </span>
                      </div>

                      <h2>{sportEvent.eventName}</h2>
                      <h6>
                        <span className="text-red">Event Location:</span>{" "}
                        {sportEvent.location}
                      </h6>
                      <h6>
                        <span className="text-red">Event Start Time:</span>{" "}
                        {sportEvent.eventStart}
                      </h6>
                      <h6>
                        <span className="text-red">Event End Time:</span>{" "}
                        {sportEvent.eventEnd}
                      </h6>
                      <button
                        className="joinin-btn"
                        onClick={(e) => {
                          this.joinInEvent(e, sportEvent);
                        }}
                      >
                        Join In
                      </button>
                      {/* <button className="joinin-btn" onClick={(e) => {this.joinInEvent(e, sportEvent); alert('You have successfully joined!'); window.location='/events'}}>Join In</button> */}
                      {/* <button className="joinin-btn" onClick={(e) => {this.joinInEvent(e, sportEvent); }}>Join In</button> */}
                      {/* <button className="joinin-btn" onClick={Root}>Join In</button> */}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="joinin-center">
                <img
                  className="joinin-img"
                  src="./assets/icons/togather.png"
                  alt="Logo"
                />
                <h1 className="joinin-back-text">No events created</h1>
              </div>
            )}
          </div>
        </section>
      </div>
    );
  }
}
export default JoinInEvent;
