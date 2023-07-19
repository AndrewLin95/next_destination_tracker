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
    locationID: {
      type: String,
      required: true,
    },
    noteName: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
      required: false
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
    scheduleDate: {
      type: Number,
      required: false,
    },
  },
  noteData: {
    noteName: {
      type: String,
      required: true,
    },
    locationID: {
      type: String,
      required: true,
    },
    formattedAddress: {
      type: String,
      required: true,
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
      type: Number,
      required: false,
    },
    priority: {
      type: String,
      enum: {
        values: ["High", "Medium", "Low"],
        messsage: `{VALUE} is not supported`
      },
      required: true,
    }
  }
})

const ProjectLocationDataSchema = mongoose.model('ProjectLocationDataSchema', projectLocationDataSchema);

module.exports = ProjectLocationDataSchema;
