import Project from "../models/project.js";

// Create a new Project
export const createProject = async (req, res) => {
  try {
    const { name, description, workspaceId } = req.body;
    const userId = req.user._id; // Extract userId from request

    // Ensure required fields are provided
    if (!name || !workspaceId) {
      return res
        .status(400)
        .json({ status: false, message: "Name and Workspace ID are required" });
    }

    const project = new Project({
      name,
      description,
      workspace: workspaceId,
      users: [userId], // Add the creator to the users list
    });
    await project.save();

    return res.status(201).json({ status: true, project });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Server Error" });
  }
};

// Update an existing Project
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid project ID" });
    }

    const project = await Project.findByIdAndUpdate(
      id,
      { name, description },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res
        .status(404)
        .json({ status: false, message: "Project not found" });
    }

    return res.status(200).json({ status: true, project });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Server Error" });
  }
};

// Get a Project by ID
export const getProject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid project ID" });
    }

    const project = await Project.findById(id).populate(
      "workspace",
      "_id name description"
    );

    if (!project) {
      return res
        .status(404)
        .json({ status: false, message: "Project not found" });
    }

    return res.status(200).json({ status: true, project });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Server Error" });
  }
};

// Get Projects associated with a specific User ID
export const getProjectsByUserId = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid user ID" });
    }

    const projects = await Project.find({ users: userId }).populate(
      "workspace",
      "_id name description"
    );

    return res.status(200).json({ status: true, projects });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Server Error" });
  }
};

// Get all Projects
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate(
      "workspace",
      "_id name description"
    );

    return res.status(200).json({ status: true, projects });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Server Error" });
  }
};

// Delete a Project by ID
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid project ID" });
    }

    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return res
        .status(404)
        .json({ status: false, message: "Project not found" });
    }

    return res
      .status(200)
      .json({ status: true, message: "Project deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Server Error" });
  }
};
