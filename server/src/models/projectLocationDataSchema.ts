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
  mapData: {
    formattedAddress: {
      type: String,
      required: true,
    },
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true
    },
    googleLocationID: {
      type: String,
      required: true,
    },
  },
  noteData: {
    customName: {
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
    priority: {
      type: String,
      enum: {
        values: ["High", "Medium", "Low"],
        messsage: `{VALUE} is not supported`
      },
      required: false,
    }
  },
  scheduleData: {
    scheduleDate: {
      type: Date,
      required: false,
    },
    scheduleStart: {
      type: Date,
      required: false,
    },
    scheduleEnd: {
      type: Date,
      required: false,
    }
  }
}, { versionKey: false })

const ProjectLocationDataSchema = mongoose.model('ProjectLocationDataSchema', projectLocationDataSchema);

module.exports = ProjectLocationDataSchema;
