import Workspace from "../models/workspace.js";

// Create a new Workspace
export const createWorkspace = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ status: false, message: "Name is required" });
    }

    const workspace = new Workspace({ name, description });
    await workspace.save();

    return res.status(201).json({ status: true, workspace });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Server Error" });
  }
};

// Update an existing Workspace
export const updateWorkspace = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid workspace ID" });
    }

    const workspace = await Workspace.findByIdAndUpdate(
      id,
      { name, description },
      { new: true, runValidators: true }
    );

    if (!workspace) {
      return res
        .status(404)
        .json({ status: false, message: "Workspace not found" });
    }

    return res.status(200).json({ status: true, workspace });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Server Error" });
  }
};

// Get a single Workspace by ID
export const getWorkspace = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid workspace ID" });
    }

    const workspace = await Workspace.findById(id);

    if (!workspace) {
      return res
        .status(404)
        .json({ status: false, message: "Workspace not found" });
    }

    return res.status(200).json({ status: true, workspace });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Server Error" });
  }
};

// Get all Workspaces
export const getAllWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find().sort({ createdAt: -1 });

    return res.status(200).json({ status: true, workspaces });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Server Error" });
  }
};

// Delete a Workspace by ID
export const deleteWorkspace = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid workspace ID" });
    }

    const workspace = await Workspace.findByIdAndDelete(id);

    if (!workspace) {
      return res
        .status(404)
        .json({ status: false, message: "Workspace not found" });
    }

    return res
      .status(200)
      .json({ status: true, message: "Workspace deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Server Error" });
  }
};
