import React, { useContext, useEffect, useState } from "react";
import BookingList from "../components/Bookings/BookingList";
import Spinner from "../components/Spinner";
import AuthContext from "../context/auth-context";

const Bookings = () => {
  const authContext = useContext(AuthContext);

  const [bookings, setBookings] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const token = authContext.token;

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = () => {
    setIsLoading(true);

    const requestBody = {
      query: `
        query {
          bookings {
            _id
            createdAt
            event {
              _id
              title
              date
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
        const bookings = resData.data.bookings;
        setBookings(bookings);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const deleteBookingHandler = (bookingId) => {
    setIsLoading(true);

    const requestBody = {
      query: `
        mutation CancelBooking($id: ID!) {
          cancelBooking(bookingId: $id) {
            _id
            title
         }
      }
      `,
      variables: {
        id: bookingId,
      },
    };

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
        setBookings(() => {
          const updatedBooking = bookings.filter((booking) => {
            return booking._id !== bookingId;
          });
          return updatedBooking, setIsLoading(false);
        });
        fetchBookings();
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <BookingList bookings={bookings} onDelete={deleteBookingHandler} />
      )}
    </>
  );
};

export default Bookings;
