/* eslint-disable react/prop-types */
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { AddOutline } from "react-ionicons";
import Task from "./Task";

const Column = ({
  columnId,
  column,
  onTaskClick,
  onAddTaskClick,
  onEditStatusName,
}) => {
  return (
    <div className="flex flex-col gap-5">
      <Droppable droppableId={columnId}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex flex-col md:w-[290px] w-[250px] gap-3 items-center py-5"
          >
            <div
              className="flex items-center justify-start py-[5px] px-[10px] w-full bg-sky-500 rounded-lg shadow-md text-[#000] font-normal text-[15px] cursor-pointer"
              onClick={() => onEditStatusName(columnId)}
            >
              {column.name}
            </div>

            {column.items.map((task, index) => (
              <Draggable
                key={task.id.toString()}
                draggableId={task.id.toString()}
                index={index}
              >
                {(provided) => (
                  <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    onClick={() => onTaskClick(task)}
                  >
                    <Task task={task} />
                  </div>
                )}
              </Draggable>
            ))}

            {provided.placeholder}

            <div
              onClick={() => onAddTaskClick(columnId)}
              className="flex cursor-pointer items-center justify-center gap-1 py-[5px] w-full opacity-90 bg-gray-300 rounded-lg shadow-sm text-[#000] font-medium text-[15px]"
            >
              <AddOutline color="#000" />
              Add Task
            </div>
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;
