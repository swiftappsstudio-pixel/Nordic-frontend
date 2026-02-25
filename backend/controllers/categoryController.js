import mongoose from "mongoose";
import category from "../models/category.js";

export const createCategory=async(req,res ,next,)=>{
  try{
    const {
      name,
      description,
    }=req.body;

    const newCategory=new category({                                                                                   
      name,
      description,
    });

    await newCategory.save();

    res.status(201).json({
      success:true,
      message:"Category created successfully",
      data:newCategory,
    });
  }catch(error){
    next (error);
  }       
};

export const updateCategory=async(req,res,next)=>{
  try{
    const {id}=req.params;
    
    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(400).json({
        success:false,
        message:"Invalid category ID",
      });
    }   
    const updatedCategory=await category.findByIdAndUpdate(
      id,
      req.body,
      {new:true, runValidators:true}
    );    
    if(!updatedCategory){
      return res.status(404).json({
        success:false,    
        message:"Category not found",
      });
    } 
    res.status(200).json({
      success:true,
      message:"Category updated successfully",
      data:updatedCategory,
    });
  }catch(error){
    next(error);
  }     
};


export const getAllCategories=async(req,res,next)=>{
  try{
    const categories=await category.find();   
    res.status(200).json({
      success:true,
      message:"Categories retrieved successfully",
      data:categories,
    });
  }catch(error){  
    next(error);
  }     
};

export const getCategoryById=async(req,res,next)=>{
  try{
    const {id}=req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(400).json({
        success:false,
        message:"Invalid category ID",
      });
    }

    const categoryById=await category.findById(id);

    if(!categoryById){
      return res.status(404).json({
        success:false,
        message:"Category not found",
      });
    }

    res.status(200).json({
      success:true,
      message:"Category retrieved successfully",
      data:categoryById,
    });
  }catch(error){
    next(error);
  }     
};  


export const deleteCategory=async(req,res,next)=>{
  try{
    const {id}=req.params;  
    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(400).json({
        success:false,    
        message:"Invalid category ID",
      });
    }   
    const deletedCategory=await category.findByIdAndDelete(id);    

    if(!deletedCategory){
      return res.status(404).json({
        success:false,
        message:"Category not found",
      });
    }

    res.status(200).json({
      success:true,
      message:"Category deleted successfully",
    });
  }catch(error){
    next(error);
  }     
};    