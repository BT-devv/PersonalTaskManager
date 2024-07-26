import { Segmented } from "antd";
import "../css/Navbar.css"; // Import the CSS file
import { CgBoard, CgViewComfortable } from "react-icons/cg";
import { LuGanttChartSquare } from "react-icons/lu";

const Navbar = ({ projectName, onLayoutChange }) => {
  const options = [
    {
      label: (
        <div className="flex items-center">
          <CgBoard className="mr-2" /> Board
        </div>
      ),
      value: "Board",
    },
    {
      label: (
        <div className="flex items-center">
          <CgViewComfortable className="mr-2" /> Table
        </div>
      ),
      value: "Table",
    },
    {
      label: (
        <div className="flex items-center">
          <LuGanttChartSquare className="mr-2" /> Gantt Chart
        </div>
      ),
      value: "Gantt Chart",
    },
  ];

  return (
    <nav className="w-full flex flex-col px-5 py-3 shadow-lg bg-white text-black">
      <div className="text-2xl font-bold pt-1 pb-4">{projectName}</div>

      <Segmented
        className="custom-segmented"
        options={options}
        onChange={(value) => {
          onLayoutChange(value); // Call the function passed via props
        }}
      />
    </nav>
  );
};

export default Navbar;
