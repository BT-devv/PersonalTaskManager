/* eslint-disable react/prop-types */
import { useState } from "react";

const AddStatusModal = ({ isOpen, onClose, handleAddStatus }) => {
  const [statusName, setStatusName] = useState("");

  const handleSubmit = () => {
    handleAddStatus(statusName);
    setStatusName("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Add Status</h2>
        <input
          type="text"
          value={statusName}
          onChange={(e) => setStatusName(e.target.value)}
          placeholder="Status Name"
        />
        <button onClick={handleSubmit}>Add</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default AddStatusModal;
