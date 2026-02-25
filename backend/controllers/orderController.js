import order from "../models/order.js";
export const createOrder = async (req,res,next) => {
  try{
    const{
      customerName,
      serviceName,
      price,
      phoneNumber,
      date,
      address,
      time,
      paymentMethod
    }=req.body;
  
const newOrder=await order.create({
  customerName,
   serviceName,
    price,
    date,
    address,
    phoneNumber,
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


export const getOrders = async (req, res, next) => {
  try {
    const orders = await order.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};
