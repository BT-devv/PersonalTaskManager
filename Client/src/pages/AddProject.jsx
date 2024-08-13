import { useState } from "react";

const AddProject = () => {
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");

  const handleAddProject = (e) => {
    e.preventDefault(); // Prevent form from submitting traditionally
    if (!projectName) return; // Basic validation

    const newProject = {
      id: projects.length + 1, // Simple unique id for key prop when rendering
      name: projectName,
      description: description,
    };

    setProjects([...projects, newProject]); // Add new project to the projects array
    setProjectName(""); // Reset the project name input
    setDescription(""); // Reset the description input
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
      <div className="w-full max-w-4xl p-10 bg-white shadow-xl rounded-lg transform transition duration-500 hover:scale-105">
        <h1 className="text-4xl font-extrabold text-blue-800 mb-8">
          Add a Project
        </h1>
        <form onSubmit={handleAddProject} className="space-y-6">
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Project Name"
            className="w-full p-4 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            className="w-full p-4 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <button
            type="submit"
            className="w-full p-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Add Project
          </button>
        </form>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {projects.map((project) => (
            <div
              key={project.id}
              className="p-6 bg-white border border-blue-100 rounded-lg shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-blue-700 mb-2">
                {project.name}
              </h3>
              <p className="text-gray-600">{project.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddProject;
