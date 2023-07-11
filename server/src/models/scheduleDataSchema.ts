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
    }
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