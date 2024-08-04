import Workspace from "../models/workspace.js";

export const createWorkspace = async (req, res) => {
  try {
    const { name, description } = req.body;
    const workspace = await Workspace.create({ name, description });
    res.status(201).json(workspace);
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, message: error.message });
  }
};

export const updateWorkspace = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const workspace = await Workspace.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );
    res.status(200).json(workspace);
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, message: error.message });
  }
};

export const getWorkspace = async (req, res) => {
  try {
    const { id } = req.params;
    const workspace = await Workspace.findById(id);
    res.status(200).json(workspace);
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, message: error.message });
  }
};

export const getAllWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find();
    res.status(200).json(workspaces);
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, message: error.message });
  }
};

export const deleteWorkspace = async (req, res) => {
  try {
    const { id } = req.params;
    await Workspace.findByIdAndDelete(id);
    res
      .status(200)
      .json({ status: true, message: "Workspace deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, message: error.message });
  }
};
