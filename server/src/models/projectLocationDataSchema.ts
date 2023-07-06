import mongoose from "mongoose";

const projectLocationDataSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true,
  },
  projectID: {
    type: String,
    required: true,
  },
  locationID: {
    type: String, 
    required: true,
  },
  deleteFlag: {
    type: Boolean,
    required: true,
  },
  mapData: {
    formattedAddress: {
      type: String,
      required: true,
    },
    googleLocationID: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
      required: false
    },
    noteName: {
      type: String,
      required: false,
    },
    position: {
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true
      }
    },
    label: {
      color: {
        type: String,
        enum: {
          values: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          message: `{VALUE} is not supported`
        },
        required: false,
      }
    }
  },
  noteData: {
    noteName: {
      type: String,
      required: false,
    },
    formattedAddress: {
      type: String,
      required: false,
    },
    customNote: {
      type: String,
      required: false,
    },
    openHours: {
      type: String,
      required: false,
    },
    closeHours: {
      type: String,
      required: false,
    },
    picture: {
      type: String,
      required: false
    },
    scheduleDate: {
      type: Date,
      required: false,
    },
    priority: {
      type: String,
      enum: {
        values: ["High", "Medium", "Low"],
        messsage: `{VALUE} is not supported`
      },
      required: false,
    }
  }
})

const ProjectLocationDataSchema = mongoose.model('ProjectLocationDataSchema', projectLocationDataSchema);

module.exports = ProjectLocationDataSchema;
