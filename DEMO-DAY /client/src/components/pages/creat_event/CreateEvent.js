import React, { useState } from "react";
import Maps from "../supplementary/Maps";

import "../../css/createevent.css";

import TimePicker from "rc-time-picker";
import "rc-time-picker/assets/index.css";
import DayPickerInput from "react-day-picker/DayPickerInput";
import "react-day-picker/lib/style.css";

//Materialize UI
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

//API requests
import createEventAPI from "../../../API/eventAPI";


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CreateEvent = props => {

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const token = JSON.parse(localStorage.getItem('token'));
    const userId = token.uid;
    // const userName = token.ue;

    if (createEventSuccess()) {
      createEventAPI (
        {
          signedUpUsers: userId,
          eventCreaterID:userId,
          eventType:     eventType,
          eventCategory: eventCategory,
          eventName:     eventTitle, 
          participants:  eventParticipants, 
          eventDate:     eventDate,
          eventStart:    eventStartTime,
          eventEnd:      eventEndTime,
          notes:         eventNotes,
          location:      eventSelectedAddress
        }
      );
      props.history.push('/viewall');
    }
    else {
      handleClickOpen();
    }
  };

  const createEventSuccess = () => {
    if (!eventType            ||
        !eventCategory        ||
        !eventTitle           ||
        !eventParticipants    ||
        !eventDate            ||
        !eventStartTime       ||
        !eventEndTime         ||
        !eventSelectedAddress
       )
      return false;
    else
      return true;
  };

  const headTitle  = (window.location.href).substring((window.location.href).indexOf("=") + 1, (window.location.href).length);
  const hrefCancel = `/events~category=${(headTitle).substring(0, (headTitle).indexOf(":"))}`;

  const participants = [2, 3, 4, 5, 10, 20, 30];

  const [eventTitle,           setEventTitle]           = useState(null);
  const [eventParticipants,    setEventParticipants]    = useState(participants[0]);
  const [eventDate,            setEventDate]            = useState(null);
  const [eventStartTime,       setEventStartTime]       = useState(null);
  const [eventEndTime,         setEventEndTime]         = useState(null);
  const [eventNotes,           setEventNotes]           = useState(null);
  const [eventSelectedAddress, setEventSelectedAddress] = useState(null);
  const [eventDescription,     setEventDescription    ] = useState(null);

  const eventType     = headTitle.substring(0, headTitle.indexOf("@"));
  const eventCategory = headTitle.substring(headTitle.indexOf(":") + 1, headTitle.length);

  // const FORMAT = 'MM/dd/yyyy';
  function disabledSeconds(h, m) {
    return [h + (m % 60)];
  }

  return (
    <div className="content-wrapper">
      <section className="content-header">
        <h1>
          <strong>{eventType.toUpperCase()}:</strong> {eventCategory.replace(/%20/g, " ")}
          <small><i>"<strong>to.gather</strong> makes it possible!"</i></small>
        </h1>
        <ol className="breadcrumb">
          <li>
            <a href="/home"><i className="fas fa-door-open"></i><span className="text-orange"> Main</span></a>
          </li>
          <li>
            <a href="/events"><span className="text-orange"> Events</span></a>
          </li>
          <li>
            <a href={`/events~category=${(headTitle).substring(0, (headTitle).indexOf(":"))}`}><span className="text-orange"> {eventType}</span></a>
          </li>
          <li>New Event</li>
        </ol>
      </section>

      <div className="signup__container">
        {/* <div className="container__child signup__thumbnail">
          <div className="thumbnail__logo">
            <img src="./assets/icons/logo_gray.png" alt="to.gather logo" className="logo__shape" width="25px" />
            <h1 className="logo__text">to.gather</h1>
          </div>
          <div className="signup__overlay">
            <Maps 
              onDescriptionchange={description => setEventDescription (description)} 
              onAddresschange={address => setEventSelectedAddress(address)} 
              type={eventCategory} 
            />
          </div>
        </div> */}
        <div className="container__child signup__form">
          <form action="" onSubmit={handleSubmit}>
            <div className="form-group">
              <label for="eventtitle">Event Title</label>
              <input
                type="text"
                className="form-control"
                name="eventtitle"
                id="txtEventTitle"
                onChange={ (e) => setEventTitle(e.target.value) }
                value={eventTitle}
                placeholder="My event"
              />
            </div>
            <div className="form-group dark-text">
              <label for="eventdate">Date</label>
              <DayPickerInput
                onDayChange={ (day) => setEventDate(day.toString().substring(4, day.toString().indexOf(":") - 3)) }
              />
            </div>
            <div className="form-group">
              <label for="starttime">Start Time</label>
              <TimePicker
                style={{ width: 130 }}
                placeholder="--:-- am/pm"
                showSecond={false}
                minuteStep={5}
                disabledSeconds={disabledSeconds}
                onChange={ (value) => setEventStartTime(value && value.format("HH:mm")) }
                use12Hours
                inputReadOnly
              />
            </div>
            <div className="form-group">
              <label for="endtime">Finish Time</label>
              <TimePicker
                style={{ width: 130 }}
                placeholder="--:-- am/pm"
                showSecond={false}
                minuteStep={5}
                disabledSeconds={disabledSeconds}
                onChange={ (value) => setEventEndTime(value && value.format("HH:mm")) }
                use12Hours
                inputReadOnly
              />
            </div>
            <div className="form-group">
              <label for="participants">Participants</label>
              <input 
                className="form-control" 
                type="number" 
                step="any" 
                name="participants" 
                ng-model="user.participants" 
                min="2" 
                max="100" 
                placeholder="2"  
                id="form-participants"
                onChange={(e) => setEventParticipants(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label for="additionalnotes">Notes</label>
              <textarea
                id="exampleFormControlTextarea1"
                className="form-control createEvent-textarea"
                placeholder="Write here additional notes.."
                rows="5"
                onChange={ (e) => setEventNotes(e.target.value) }
                value={eventNotes}
              ></textarea>
            </div>
            <div className="form-group">
              <label for="location">Location</label>
              <input
                value={eventSelectedAddress}
                onChange={ (e) => setEventSelectedAddress(e.target.value) }
                type="text"
                className="form-control"
                name="location"
                id="eventAddress"
                aria-describedby="eventLocation"
                placeholder="Choose your location on the map"
                disabled
              />
              <p className="gray-text"><i>{!eventDescription || eventDescription === "" ? "" : eventDescription}</i></p>
            </div>
            <div className="m-t-lg">
              <ul className="list-inline">
                <li>
                  <input className="btn btn--form btn--submit" type="submit" value="Create Event" />
                </li>
                <li>
                  <a className="signup__link" href={hrefCancel}>Cancel</a>
                </li>
              </ul>
            </div>
          </form>
        </div>
        <div className="container__child signup__thumbnail">
          <div className="thumbnail__logo">
            <img src="./assets/icons/logo_gray.png" alt="to.gather logo" className="logo__shape" width="25px" />
            <h1 className="logo__text">to.gather</h1>
          </div>
          <div className="signup__overlay dark-text">
            <Maps 
              onDescriptionchange={description => setEventDescription (description)} 
              onAddresschange={address => setEventSelectedAddress(address)} 
              type={eventCategory} 
            />
          </div>
        </div>
      </div>

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{"Oops!! Sorry, your event was not created successfully."}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            It looks like you haven't completed the form before creating an event.
            {"\n"}
            Please, fill-up the form and be amazed by your new event.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Awesome
          </Button>
        </DialogActions>
      </Dialog>
    </div>              
  );
};
export default CreateEvent;
