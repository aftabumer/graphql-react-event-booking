import React, { useState } from "react";
import Backdrop from "../components/Backdrop";
import Modal from "../components/Modal";

const Events = () => {
  const [creating, setCreating] = useState(false);
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
            onConfirm={() => setCreating(false)}
          >
            <p>Modal Conent</p>
          </Modal>
        </>
      )}
      <div className="events-control">
        <button className="btn" onClick={() => setCreating(true)}>
          Create Event
        </button>
      </div>
    </>
  );
};

export default Events;
