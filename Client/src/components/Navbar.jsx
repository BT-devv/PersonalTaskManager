const Navbar = ({ projectName, onLayoutChange }) => {
  return (
    <nav className="w-full flex items-center justify-between p-4 bg-gray-800 text-white">
      <div className="text-xl font-bold">{projectName}</div>
      <div className="flex items-center gap-2">
        <button
          className="p-2 bg-blue-500 rounded"
          onClick={() => onLayoutChange("grid")}
        >
          Grid Layout
        </button>
        <button
          className="p-2 bg-blue-500 rounded"
          onClick={() => onLayoutChange("list")}
        >
          List Layout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
