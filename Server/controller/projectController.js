import Project from "../models/project.js";

export const createProject = async (req, res) => {
  try {
    const { name, description, workspaceId } = req.body;
    const project = await Project.create({
      name,
      description,
      workspace: workspaceId,
    });
    res.status(201).json(project);
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, message: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const project = await Project.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );
    res.status(200).json(project);
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, message: error.message });
  }
};

export const getProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id).populate(
      "workspace",
      "_id name description"
    );
    res.status(200).json(project);
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, message: error.message });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate(
      "workspace",
      "_id name description"
    );
    res.status(200).json(projects);
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    await Project.findByIdAndDelete(id);
    res
      .status(200)
      .json({ status: true, message: "Project deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, message: error.message });
  }
};
