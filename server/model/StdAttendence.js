const { default: mongoose } = require("mongoose");
const stdAttendanceSchema = new mongoose.Schema(
  {
    stdId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "Student",
    },
    date: {
      type: Date,
      required: true,
      default: new Date().getFullYear(),
    },
    attendance: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StdAttendance", stdAttendanceSchema);
