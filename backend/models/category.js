import mongoose from "mongoose";

const categorySchema=new mongoose.Schema(
  {
 name: { 
    type: String, 
    required: true,
    trim: true,
    unique: true,
    minlength: 2,
    maxlength: 100
  },
  description: { 
    type: String,
    trim: true,
    maxlength: 500
  },

  
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Admin" 
  }
}, { 
  timestamps: true 
});


export default mongoose.model("category", categorySchema);


