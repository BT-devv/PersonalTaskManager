import React from "react";

const Notification = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center p-8 bg-white shadow-md rounded-md">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Coming Soon</h1>
        <p className="text-lg text-gray-600">
          We're working hard to finish the development of this feature. Stay
          tuned!
        </p>
      </div>
    </div>
  );
};

export default Notification;
