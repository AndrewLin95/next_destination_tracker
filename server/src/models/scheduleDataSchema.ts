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
    totalPages: {
      type: Number,
      required: true,
    },
    projectID: {
      type: String,
      required: true,
    },
    segments: {
      type: Number,
      required: true,
    },
  },
  headerData: [
    {
      date: {
        type: String,
        required: true,
      },
      dateUnix: {
        type: Number,
        required: true,
      },
      dayOfWeek: {
        type: String,
        required: true,
      },
      enabled: {
        type: Boolean,
        required: true,
      }
    }
  ],
  timeData: {
    type: Map,
    of: String,
    required: true,
  },
  timeValueData: {
    type: Map,
    of: String,
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
          required: true,
        }
      }
    ],
    required: true,
  }
})

const ScheduleDataSchema = mongoose.model('ScheduleDataSchema', scheduleDataSchema);

module.exports = ScheduleDataSchema;