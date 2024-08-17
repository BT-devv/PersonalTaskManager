/* eslint-disable react/prop-types */
const StatusInput = ({ newStatusName, setNewStatusName, handleAddStatus }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAddStatus(newStatusName);
    } else if (e.key === "Escape") {
      setNewStatusName("");
    }
  };

  return (
    <div className="relative top-5 flex flex-col gap-5">
      <input
        type="text"
        value={newStatusName}
        onChange={(e) => setNewStatusName(e.target.value)}
        onKeyDown={handleKeyDown}
        className="border p-2 rounded"
        placeholder="Enter status name"
        autoFocus
      />
    </div>
  );
};

export default StatusInput;
