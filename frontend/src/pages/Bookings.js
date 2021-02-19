import React, { useContext, useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import AuthContext from "../context/auth-context";

const Bookings = () => {
  const authContext = useContext(AuthContext);

  const [bookings, setBookings] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
        const bookings = resData.data.bookings;
        setBookings(bookings);
        setIsLoading(false);
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
        <ul>
          {bookings &&
            bookings.map((booking) => (
              <li key={booking._id}>
                {booking.event.title} -{" "}
                {new Date(booking.createdAt).toLocaleDateString()}
              </li>
            ))}
        </ul>
      )}
    </>
  );
};

export default Bookings;
