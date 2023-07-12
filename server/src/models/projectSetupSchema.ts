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
  scheduleColors: {
    Monday: {
      type: String,
      required: true,
    },
    Tuesday: {
      type: String,
      required: true,
    },
    Wednesday: {
      type: String,
      required: true,
    },
    Thursday: {
      type: String,
      required: true,
    },
    Friday: {
      type: String,
      required: true,
    },
    Saturday: {
      type: String,
      required: true,
    },
    Sunday: {
      type: String,
      required: true,
    }
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
    minPerSegment: {
      type: Number,
      required: true,
    }
  }
})

const ProjectSetupSchema = mongoose.model('ProjectSetupSchema', projectSetupSchema);

module.exports = ProjectSetupSchema;