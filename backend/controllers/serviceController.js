import mongoose from "mongoose";
import services from "../models/services.js";

// Helper for sending errors


// CREATE SERVICE
// export const createService = async (req, res, next) => {
//   try {
//     const {
//       title,
//       description,
//       actualPrice,
//       discountPrice,
//       category,
//       keyBenefits,
//       keyIngredients,
//       disclaimer,
//       images,
//     } = req.body;

//     let validatedImages = [];
//     if (Array.isArray(images)) {
//       validatedImages = images.slice(0, 3);
//     }

//     const newService = await services.create({
//       title,
//       description,
//       actualPrice,
//       discountPrice,
//       category,
//       keyBenefits,
//       keyIngredients,
//       disclaimer,
//       images: validatedImages,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Service created successfully",
//       data: newService,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

export const createService = async (req, res, next) => {
  try {
    const {
      title,
      description,
      actualPrice,
      discountPrice,
      category,
      keyBenefits,
      keyIngredients,
      disclaimer,
      subServices,
    } = req.body;

    // ✅ READ FILES FROM MULTER
    const images = req.files
      ? req.files.map((file) => `/uploads/services/${file.filename}`)
      : [];

          let parsedSubServices = subServices ? JSON.parse(subServices) : [];

    const newService = await services.create({
      title,
      description,
      actualPrice,
      discountPrice,
      category,
      keyBenefits,
      keyIngredients,
      disclaimer,
      subServices: parsedSubServices,
      images, // ✅ REAL IMAGE PATHS
    });

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      data: newService,
    });
  } catch (error) {
    next(error);
  }
};



// UPDATE SERVICE
export const updateService = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service ID",
      });
    }

    let updateData = { ...req.body };

    // ✅ HANDLE NEW IMAGES IF UPLOADED
    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map(
        (file) => `/uploads/services/${file.filename}`
      );
    }

     if (updateData.subServices) {
      updateData.subServices = JSON.parse(updateData.subServices);
    }
    
    const updatedService = await services.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedService) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Service updated successfully",
      data: updatedService,
    });
  } catch (error) {
    next(error);
  }
};


// DELETE SERVICE
export const deleteService = async (req, res, next) => {
  try {
    const { id } = req.params;    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service ID",
      });
    } 
    const deletedService = await services.findByIdAndDelete(id);
    if (!deletedService) {
      return res.status(404).json({
        success: false,   
        message: "Service not found",
      });
    } 
    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};  
// GET ALL SERVICES
export const getAllServices = async (req, res, next) => {
  try {
    const allServices = await services.find();  
    res.status(200).json({
      success: true,
      data: allServices,
    });
  } catch (error) {
    next(error);
  } 
};

//get service by id 

// GET SINGLE SERVICE
export const getServiceById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service ID",
      });
    }

    const service = await services.findById(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    next(error);
  }
};


