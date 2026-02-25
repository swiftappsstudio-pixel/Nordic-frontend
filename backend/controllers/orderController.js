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
  userId: req.user || null,
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

export const deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedOrder = await order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    next(error);
  }
};
