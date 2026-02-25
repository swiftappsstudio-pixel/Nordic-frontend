import mongoose from "mongoose";


const subServiceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // e.g. "Buy 3 Get 1 Free"
    },
    price: {
      type: Number,
      required: true, // final price you already calculated
    },
    discountPercent: {
      type: Number, // optional (10, 20, etc.)
    },
  },
  { _id: false }
);



const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,

    actualPrice: Number,
    discountPrice: Number,

    category: String,

    keyBenefits: [String],
    keyIngredients: [String],

    disclaimer: String,

    images: {
      type: [String],
      default: [],
    },

    subServices: {
      type: [subServiceSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Service", serviceSchema);







// const serviceSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//     },
//     description: {
//       type: String,
//     },
//     actualPrice: {
//       type: Number,
//     },
//     discountPrice: {
//       type: Number,
//     },
//     category: {
//       type: String,
//     },
//     keyBenefits: {
//       type: [String],
//     },
//     keyIngredients: {
//       type: [String],
//     },
//     disclaimer: {
//       type: String,
//     },
//     images: {
//       type: [String], // Array of image URLs or file paths
//             default: [],

//       },
//     },

//   {
//     timestamps: true,
//   }
// );

// export default mongoose.model("Service", serviceSchema);



