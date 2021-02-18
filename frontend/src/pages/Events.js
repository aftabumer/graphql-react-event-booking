import React, { useContext, useEffect, useRef, useState } from "react";
import Backdrop from "../components/Backdrop";
import Modal from "../components/Modal";
import AuthContext from "../context/auth-context";

const Events = () => {
  const authContext = useContext(AuthContext);

  const [creating, setCreating] = useState(false);
  const [events, setEvents] = useState("");

  const titleEl = useRef("");
  const priceEl = useRef(0);
  const dateEl = useRef("");
  const descriptionEl = useRef("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const modalConfirmHandler = () => {
    setCreating(false);

    const title = titleEl.current.value;
    const price = +priceEl.current.value;
    const date = dateEl.current.value;
    const description = descriptionEl.current.value;

    if (
      title.trim().lenght === 0 ||
      price <= 0 ||
      date.trim().lenght === 0 ||
      description.trim().lenght === 0
    ) {
      return;
    }

    const event = { title, price, date, description };
    console.log(event);

    const requestBody = {
      query: `
      mutation {
        createEvent(eventInput: {title: "${title}", price: ${price}, date: "${date}", description: "${description}"}) {
          _id
          title
          price
          date
          description
          creator {
            _id
            email
          }
        }
      }
      `,
    };

    const token = authContext.token;

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((resData) => {
        fetchEvents();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchEvents = () => {
    const requestBody = {
      query: `
      query {
        events {
          _id
          title
          price
          date
          description
          creator {
            _id
            email
          }
        }
      }
      `,
    };

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((resData) => {
        const events = resData.data.events;
        setEvents(events);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const eventList = (events) => {
    const list =
      events &&
      events.map((event) => (
        <li key={event._id} className="events__list-item">
          {event.title}
        </li>
      ));
    return list;
  };

  return (
    <>
      {creating && (
        <>
          <Backdrop />
          <Modal
            title="Add Event"
            canCancel
            canConfirm
            onCancel={() => setCreating(false)}
            onConfirm={modalConfirmHandler}
          >
            <form>
              <div className="form-control">
                <label htmlFor="title">Title</label>
                <input type="text" id="title" ref={titleEl} autoFocus />
              </div>
              <div className="form-control">
                <label htmlFor="price">Price</label>
                <input type="number" id="price" ref={priceEl} />
              </div>
              <div className="form-control">
                <label htmlFor="date">Date</label>
                <input type="datetime-local" id="date" ref={dateEl} />
              </div>
              <div className="form-control">
                <label htmlFor="description">Description</label>
                <textarea id="description" rows="4" ref={descriptionEl} />
              </div>
            </form>
          </Modal>
        </>
      )}
      {authContext.token && (
        <div className="events-control">
          <button className="btn" onClick={() => setCreating(true)}>
            Create Event
          </button>
        </div>
      )}
      <ul className="events__list">{eventList(events)}</ul>
    </>
  );
};

export default Events;
