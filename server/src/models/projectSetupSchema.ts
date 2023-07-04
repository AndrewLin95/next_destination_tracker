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
  deleteFlag: {
    type: Boolean,
    required: false,
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
      type: Number,
      required: true
    },
    projectEndDate: {
      type: Number,
      required: true,
    },
    projectImage: {
      type: String,
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
  },
  scheduleConfig: {
    startingTime: {
      type: String,
      required: true,
    },
    endingTime: {
      type: String,
      required: true,
    }, 
    segments: {
      type: Number, 
      enum: {
        values: [3, 1, 0.5, 0.25],
        message: `{VALUE} is not supported`,
      },
      required: true,
    },
  }
}, { versionKey: false })

const ProjectSetupSchema = mongoose.model('ProjectSetupSchema', projectSetupSchema);

module.exports = ProjectSetupSchema;