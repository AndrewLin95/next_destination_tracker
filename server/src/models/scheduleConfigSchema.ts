import mongoose from 'mongoose';

const scheduleConfigSchema = new mongoose.Schema({
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
})

const ScheduleConfigSchema = mongoose.model('ScheduleConfigSchema', scheduleConfigSchema);

module.exports = ScheduleConfigSchema;