/* eslint-disable react/prop-types */
import { TimeOutline } from "react-ionicons";

const TaskDetailModal = ({ isOpen, onClose, task }) => {
  if (!isOpen) return null;

  const { title, description, priority, deadline, image, alt, tags } = task;

  return (
    <div className="fixed right-0 top-0 h-full w-[400px] bg-white z-50 shadow-lg overflow-y-auto">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-gray-700 text-lg mb-2">{description}</p>
        <div className="flex items-center gap-2">
          {tags.map((tag) => (
            <span
              key={tag.title}
              className="px-[10px] py-[2px] text-[13px] font-medium rounded-md"
              style={{ backgroundColor: tag.bg, color: tag.text }}
            >
              {tag.title}
            </span>
          ))}
        </div>
        {image && alt && (
          <img
            src={image}
            alt={alt}
            className="w-full h-[250px] rounded-lg mt-4"
          />
        )}
        <div className="mt-4 border-t pt-4">
          <div className="flex items-center gap-1">
            <TimeOutline color={"#666"} width="19px" height="19px" />
            <span className="text-[13px] text-gray-700">{deadline} mins</span>
          </div>
          <div
            className={`w-[60px] rounded-full h-[5px] ${
              priority === "high"
                ? "bg-red-500"
                : priority === "medium"
                ? "bg-orange-500"
                : "bg-blue-500"
            }`}
          ></div>
        </div>
      </div>
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        Close
      </button>
    </div>
  );
};

export default TaskDetailModal;
