const Section = require("../models/Section");
const Course = require("../models/Course");

exports.createSection = async (req, res) => {
  try {
    //data fetch
    const { sectionName, courseId } = req.body;
    //data validation
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Missing Properties",
      });
    }
    //create section
    const newSection = await Section.create({ sectionName });

    //update course with section objectID
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      {
        new: true,
      }
    )
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    //return response
    return res.status(200).json({
        success:true,
        message:"Section Created Successfully!",
        updatedCourseDetails,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to create section, please try again!",
      error: error.message,
    });
  }
};


exports.UpdateSection = async(req,res) => {
    try{
        
        const {sectionName, sectionId} = req.body;
        
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success:false,
                message:"Missing properties",
            });
        }

        const section = await Section.findByIdAndUpdate(sectionId, {sectionName},{new:true});

        return res.status(200).json({
            success:true,
            message:"Section updated successfully!",
        }); 

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable to update section, please try again.",
            error:error.message,
        });

    }
};


//delete section

exports.deleteSection = async(req,res) =>{
    try{

        //fetching id, assuming that sectionId was sent through params
        const {sectionId} = req.params;

        await Section.findByIdAndDelete(sectionId);

        // do we need to delete the entry from course schema? [testing]

        return res.status(200).json({
            success:true,
            message:"Section Deleted Successfully",
        });

    }
    catch(error)
    {
        return res.status(500).json({
            success:false,
            message:"Unable to delete section, please try again.",
            error:error.message,
        });
    }
}