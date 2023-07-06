import mongoose from 'mongoose';

const scheduleDataSchema = new mongoose.Schema({
  config: {
    rangeStart: {
      type: Number,
      required: true,
    },
    rangeEnd: {
      type: Number,
      required: true,
    },
    page: {
      type: Number,
      required: true,
    },
    projectID: {
      type: String,
      required: true,
    },
  },
  scheduleData: {
    type: Map,
    of: [
      {
        noteName: {
          type: String,
          required: true,
        },
        timeFrom: {
          type: String,
          required: true,
        },
        timeTo: {
          type: String,
          required: true,
        },
        duration: {
          type: Number,
          required: true,
        },
        noteMessage: {
          type: String,
          required: true,
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
    required: false,
  },
})

const ScheduleDataSchema = mongoose.model('ScheduleDataSchema', scheduleDataSchema);

module.exports = ScheduleDataSchema;