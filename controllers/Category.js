const Tag = require("../models/tags");

exports.createTag = async (req, res) => {
  try {
    //fetching the data
    const { name, description } = req.body;

    //validation
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required,",
      });
    }

    // create entry in database
    const tagDetails = await Tag.create({
      name: name,
      description: description,
    });

    //return response
    res.status(200).json({
      success: true,
      message: "Tag created successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//getAllTags handler function

exports.showAllTags = async (req, res) => {
  try {
    const allTags = await Tag.find({}, {name:true, description:true});
    res.status(200).json({
        success:true,
        message:"All Tags returned successfully",
        allTags,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
