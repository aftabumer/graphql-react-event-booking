import React from "react";

const BookingList = ({ bookings, onDelete }) => {
  return (
    <ul className="bookings__list">
      {bookings &&
        bookings.map((booking) => {
          return (
            <li key={booking._id} className="bookings__item">
              <div>
                {booking.event.title} -{" "}
                {new Date(booking.createdAt).toLocaleDateString()}
              </div>
              <div className="bookings__item-actions">
                <button className="btn" onClick={() => onDelete(booking._id)}>
                  Cancel
                </button>
              </div>
            </li>
          );
        })}
    </ul>
  );
};

export default BookingList;
