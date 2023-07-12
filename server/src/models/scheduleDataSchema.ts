import mongoose from 'mongoose';

const scheduleDataSchema = new mongoose.Schema({
  projectID: {
    type: String,
    required: true,
  },
  scheduleKeys: {
    type: Map,
    of: {
      key: {
        type: String,
        required: true,
      },
      duration: {
        type: Number,
        required: true,
      }
    },
    required: true,
  },
  scheduleData: {
    type: Map,
    of: [
      {
        scheduleID: {
          type: String,
          required: true,
        },
        locationID: {
          type: String,
          required: true,
        },
        dataSegment: {
          type: Boolean,
          required: true,
        },
        position: {
          type: Number,
          required: true,
        },
        numColumns: {
          type: Number,
          required: true,
        },
        noteName: {
          type: String,
          required: false,
        },
        timeFrom: {
          type: String,
          required: false,
        },
        timeTo: {
          type: String,
          required: false,
        },
        duration: {
          type: Number,
          required: false,
        },
        noteMessage: {
          type: String,
          required: false,
        },
        notePriority: {
          type: String,
          enum: {
            values: ["High", "Medium", "Low"],
            messsage: `{VALUE} is not supported`
          },
          required: false,
        }
      }
    ],
    required: true,
  }
})

const ScheduleDataSchema = mongoose.model('ScheduleDataSchema', scheduleDataSchema);

module.exports = ScheduleDataSchema;