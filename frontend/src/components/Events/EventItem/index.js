import React from "react";

const EventItem = ({
  eventId,
  title,
  price,
  date,
  userId,
  creatorId,
  onDetail,
}) => {
  return (
    <li key={eventId} className="events__list-item">
      <div className="events__list-item-heading-section">
        <h1>{title}</h1>
        <h2>
          ${price} - {new Date(date).toLocaleDateString()}
        </h2>
      </div>
      <div className="events__list-item-action">
        {userId === creatorId ? (
          <p>Your the owner of this event.</p>
        ) : (
          <button className="btn" onClick={() => onDetail(eventId)}>
            View Details
          </button>
        )}
      </div>
    </li>
  );
};

export default EventItem;
