const Selection = require("../model/Section");
module.exports.createSectionHead = async (request, response) => {
  response.status(200).json({
    status: 200,
    message: "hello",
  });
  return;
};
module.exports.getAllSections = async (request, response) => {
  const sections = await Selection.find();
   response.status(200).json({
     status: 200,
     sections,
   });
  return;
  console.log(sections);
};
module.exports.getSections = async (request, response) => {
  response.status(200).json({
    status: 200,
    message: "hello",
  });
  return;
};
