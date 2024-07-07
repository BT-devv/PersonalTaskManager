import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useState } from "react";
import { Board } from "../data/board";
import { onDragEnd } from "../helpers/onDragEnd";
import { AddOutline } from "react-ionicons";
import AddModal from "../components/AddModal";
import Task from "../components/Task";
import TaskDetailModal from "../components/TaskDetailModal";
import { BLACK } from "../constants/color";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const [columns, setColumns] = useState(Board);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [taskDetailModalOpen, setTaskDetailModalOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState("");
  const [addingStatus, setAddingStatus] = useState(false);
  const [newStatusName, setNewStatusName] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [hoveredColumn, setHoveredColumn] = useState(null);
  const [layout, setLayout] = useState("grid"); // State for layout

  const openAddModal = (columnId) => {
    setSelectedColumn(columnId);
    setAddModalOpen(true);
  };

  const closeAddModal = () => {
    setAddModalOpen(false);
  };

  const openAddStatus = () => {
    setAddingStatus(true);
  };

  const cancelAddStatus = () => {
    setAddingStatus(false);
    setNewStatusName("");
  };

  const handleStatusNameChange = (e) => {
    setNewStatusName(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAddStatus(newStatusName);
    } else if (e.key === "Escape") {
      cancelAddStatus();
    }
  };

  const handleAddStatus = (statusName) => {
    const newColumnId = `column-${Object.keys(columns).length + 1}`;
    const newColumn = {
      name: statusName,
      items: [],
    };
    setColumns({
      ...columns,
      [newColumnId]: newColumn,
    });
    setAddingStatus(false);
    setNewStatusName("");
  };

  const handleAddTask = (taskData) => {
    const newBoard = { ...columns };
    newBoard[selectedColumn].items.push(taskData);
    setColumns(newBoard);
  };

  const handleOnDragEnd = (result) => {
    onDragEnd(result, columns, setColumns);
  };

  const openTaskDetail = (task) => {
    setSelectedTask(task);
    setTaskDetailModalOpen(true);
  };

  const handleMouseEnter = (columnId) => {
    setHoveredColumn(columnId);
  };

  const handleMouseLeave = () => {
    setHoveredColumn(null);
  };

  const handleLayoutChange = (layout) => {
    setLayout(layout);
  };

  return (
    <>
      <Navbar projectName="Project Name" onLayoutChange={handleLayoutChange} />

      <DragDropContext onDragEnd={handleOnDragEnd}>
        <div className="h-screen overflow-auto px-5 pb-8">
          <div
            className={`w-full h-screen flex items-start justify-start gap-5 ${
              layout === "list" ? "flex-col" : ""
            }`}
          >
            {Object.entries(columns).map(([columnId, column]) => (
              <div
                className="flex flex-col gap-5"
                key={columnId}
                onMouseEnter={() => handleMouseEnter(columnId)}
                onMouseLeave={handleMouseLeave}
              >
                <Droppable droppableId={columnId} key={columnId}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="flex flex-col md:w-[290px] w-[250px] gap-3 items-center py-5"
                    >
                      <div className="  flex items-center justify-start py-[5px] px-[10px] w-full bg-sky-500 rounded-lg shadow-md text-[#000] font-normal text-[15px]">
                        {column.name}
                      </div>
                      {column.items.map((task, index) => (
                        <Draggable
                          key={task.id.toString()}
                          draggableId={task.id.toString()}
                          index={index}
                        >
                          {(provided) => (
                            <div onClick={() => openTaskDetail(task)}>
                              <Task provided={provided} task={task} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {hoveredColumn === columnId && (
                        <div
                          onClick={() => openAddModal(columnId)}
                          className="flex cursor-pointer items-center justify-center gap-1 py-[5px] w-full opacity-90 bg-gray-300 rounded-lg shadow-sm text-[#000] font-medium text-[15px]"
                        >
                          <AddOutline color="#000" />
                          Add Task
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
            <div className="relative top-5 flex flex-col gap-5">
              {addingStatus ? (
                <input
                  type="text"
                  value={newStatusName}
                  onChange={handleStatusNameChange}
                  onKeyDown={handleKeyDown}
                  className="border p-2 rounded"
                  placeholder="Enter status name"
                  autoFocus
                />
              ) : (
                <div
                  onClick={openAddStatus}
                  className="absolute flex cursor-pointer items-center justify-center gap-1 py-[05px] md:w-[290px] w-[250px] opacity-90 bg-sky-200 rounded-lg shadow-sm text-[#000] font-medium text-[15px]"
                >
                  <AddOutline color={BLACK} />
                  Add Status
                </div>
              )}
            </div>
          </div>
        </div>
      </DragDropContext>

      {taskDetailModalOpen && selectedTask && (
        <TaskDetailModal
          isOpen={taskDetailModalOpen}
          onClose={() => setTaskDetailModalOpen(false)}
          task={selectedTask}
        />
      )}
      <AddModal
        isOpen={addModalOpen}
        onClose={closeAddModal}
        setOpen={setAddModalOpen}
        handleAddTask={handleAddTask}
      />
    </>
  );
};

export default Dashboard;
