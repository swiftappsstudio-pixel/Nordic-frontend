import order from "../models/order.js";
export const createOrder = async (req,res,next) => {
  try{
    const{
      serviceName,
      price,
      date,
      time,
      paymentMethod
    }=req.body;
  
const newOrder=await order.create({
   serviceName,
    price,
    date,
    time,
    paymentMethod,

})
res.status(201).json({
  success:true,
  message: "order  created successfully ",
  data: newOrder,
});
  }
  catch(error){
    next(error);
  }

  };