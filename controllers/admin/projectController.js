const Project = require("../../model/projectModel");

const { validationResult } = require("express-validator");

const addProject = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Validation errors",
        errors: errors.array(),
      });
    }

    const {
      projectname,
      clientid,
      description,
      technologies,
      reciveddate,
      deadline,
      status,
      assignto,
    } = req.body;

    const isExist = await Project.findOne({ projectname });

    if (isExist) {
      return res.status(400).json({
        success: false,
        msg: "Use Different Project Name",
      });
    }

    const newProjectData = new Project({
      projectname,
      clientid,
      description,
      technologies,
      reciveddate,
      deadline,
      status,
      assignto,
    });

    const projectData = await newProjectData.save();

    return res.status(200).json({
      success: true,
      msg: "New Project Added Successfully",
      data: projectData,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

const updateProject = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Validation errors",
        errors: errors.array(),
      });
    }

    const {
      id,
      projectname,
      clientid,
      description,
      technologies,
      reciveddate,
      deadline,
      status,
      assignto,
    } = req.body;

    const isExist = await Project.findOne({ _id: id });

    if (!isExist) {
      return res.status(400).json({
        success: false,
        msg: "Project is not Exist",
      });
    }

    const updateProjectData = await Project.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          projectname,
          clientid,
          description,
          technologies,
          reciveddate,
          deadline,
          status,
          assignto,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      msg: "Project data Updated Successfully",
      data: updateProjectData,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

const viewPorject = async (req, res) => {
  try {
    const ProjectData = await Project.find({}).populate("clientid assignto");

    return res.status(200).json({
      success: true,
      msg: "Project Fetched successfully",
      data: ProjectData,
    });
  } catch (error) {
    console.error("Error saving Project:", error);
    return res.status(500).json({
      success: false,
      msg: "Failed to add Project data",
      error: error.message,
    });
  }
};

// clientid
// projectname
// description
// technologies
// reciveddate
// deadline
// status
// assignto

module.exports = { addProject, viewPorject, updateProject };
