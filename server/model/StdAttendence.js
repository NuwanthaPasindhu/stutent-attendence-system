const { default: mongoose } = require("mongoose");

const attendanceDate = () => {
  const Today = new Date();
  return `${Today.getFullYear()}-${Today.getMonth() + 1}-${Today.getDate()}`;
};
const stdAttendanceSchema = new mongoose.Schema(
  {
    stdId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "Student",
    },
    sectionId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "Section",
    },
    classId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "SectionClass",
    },
    date: {
      type: String,
      required: true,
      default: attendanceDate,
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
