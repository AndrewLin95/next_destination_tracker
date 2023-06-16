import mongoose from "mongoose";

const projectSetupSchema = new mongoose.Schema({ 
  userID: {
    type: String,
    required: true,
  },
  projectID: {
    type: String,
    required: true,
  },
  project: {
    projectName: {
      type: String,
      required: true,
    },
    projectDescription: {
      type: String,
      required: true
    },
    projectStartDate: {
      type: Date,
      required: true
    },
    projectEndDate: {
      type: Date,
      required: true,
    },
    projectCoords: {
      destination: {
        type: String,
        required: true,
      },
      lat: {
        type: String,
        required: true,
      },
      lng: {
        type: String,
        required: true,
      } 
    }
  }
}, { versionKey: false })

const ProjectSetupSchema = mongoose.model('ProjectSetupSchema', projectSetupSchema);

module.exports = ProjectSetupSchema;