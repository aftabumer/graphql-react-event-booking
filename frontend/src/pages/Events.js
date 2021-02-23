import React, { useContext, useEffect, useRef, useState } from "react";
import Backdrop from "../components/Backdrop";
import EventList from "../components/Events/EventList";
import Modal from "../components/Modal";
import Spinner from "../components/Spinner";
import AuthContext from "../context/auth-context";

const Events = () => {
  const authContext = useContext(AuthContext);

  const [creating, setCreating] = useState(false);
  const [events, setEvents] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [viewDetailModal, setViewDetailModal] = useState(false);

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
      mutation CreateEvent($title: String!, $price: Float!, $date: String!, $description: String!) {
        createEvent(eventInput: {title: $title, price: $price, date: $date, description: $description}) {
          _id
          title
          price
          date
          description
        }
      }
      `,
      variables: {
        title: title,
        price: price,
        date: date,
        description: description,
      },
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
        setEvents((prevState) => {
          const updatedEvents = [...prevState];
          updatedEvents.push({
            _id: resData.data.createEvent._id,
            title: resData.data.createEvent.title,
            price: resData.data.createEvent.price,
            date: resData.data.createEvent.date,
            description: resData.data.createEvent.description,
            creator: {
              _id: authContext.userId,
            },
          });
          return updatedEvents;
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchEvents = () => {
    setIsLoading(true);
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
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const showDetailHandler = (eventId) => {
    setViewDetailModal(true);
    setSelectedEvent(() => {
      const selectedEvent = events.find((e) => e._id === eventId);
      return selectedEvent;
    });
  };

  const bookEventHandler = () => {
    if (!authContext.token) {
      setViewDetailModal(false);
      return;
    }

    const requestBody = {
      query: `
         mutation BookEvent($id: ID!) {
            bookEvent(eventId: $id) {
              _id
              createdAt
              updatedAt
          }
        }
      `,
      variables: {
        id: selectedEvent._id,
      },
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
        console.log(resData);
        setViewDetailModal(false);
      })
      .catch((err) => {
        console.log(err);
      });
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
            confirmText="Confirm"
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
      {viewDetailModal && (
        <Modal
          title={selectedEvent.title}
          canCancel
          canConfirm
          onCancel={() => setViewDetailModal(false)}
          onConfirm={bookEventHandler}
          confirmText={authContext.token ? "Book" : "Confirm"}
        >
          <h1>{selectedEvent.title}</h1>
          <h3 className="py2">
            ${selectedEvent.price} -{" "}
            {new Date(selectedEvent.date).toLocaleDateString()}
          </h3>
          <p>{selectedEvent.description}</p>
        </Modal>
      )}
      {authContext.token && (
        <div className="events-control">
          <p className="mb2">Share your own Events!</p>
          <button className="btn" onClick={() => setCreating(true)}>
            Create Event
          </button>
        </div>
      )}
      {isLoading ? (
        <Spinner />
      ) : (
        <EventList
          events={events}
          authUserId={authContext.userId}
          onViewDetail={showDetailHandler}
        />
      )}
    </>
  );
};

export default Events;
