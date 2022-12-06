const { default: mongoose } = require("mongoose");
const tecAttendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "User",
    },
    date: {
      type: Date,
        required: true,
      default: new Date().getFullYear(),
    },
    attendance: {
      type: Boolean,
        default: true,
      required:true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TecAttendance", tecAttendanceSchema);
