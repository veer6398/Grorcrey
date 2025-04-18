import Order from "../models/order.js"
import Product from "../models/products.js"
import stripe from 'stripe'
import User from '../models/User.js'

//place order cod: /api/order/cod

export const placeOrderCOD = async (req, res)=>{
    try {
        const userId = req.userId;
        const { items, address } = req.body

        if(!address || items.length === 0){
            return res.json({success: false, message: "Invalid Data"})
        }
        let amount = await items.reduce(async(acc, item)=>{
            const product = await Product.findById(item.product);
            return (await acc) + product.offerPrice * item.quantity;
        },0)
        amount += Math.floor(amount * 0.02);

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "COD",
        });
        
      return  res.json({success: true, message: "Order placed successfully"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// get order by userId: /api/order/user

export const getUserOrders = async(req,res)=>{
    try {
        const userId = req.userId;
        const orders = await Order.find({
            userId,
            $or: [{paymentType: "COD"},{isPaid:true}]
        }).populate("items.product address").sort({createdAt: -1});
        res.json({success: true, orders});
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// all orders (for seller) :  /api/order/seller
export const getAllOrders = async(req,res)=>{
    try {
        const orders = await Order.find({
            $or: [{paymentType: "COD"},{isPaid:true}]
        }).populate("items.product address").sort({createdAt: -1});
        res.json({success: true, orders});
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

//place order stripe: /api/order/stripe
export const placeOrderStripe = async (req, res)=>{
    try {
        const userId = req.userId;
        const { items, address } = req.body
        const {origin} = req.headers;

        if(!address || items.length === 0){
            return res.json({success: false, message: "No Items In Cart"})
        }

        let productData = [];

        let amount = await items.reduce(async(acc, item)=>{
            const product = await Product.findById(item.product);
            productData.push({
                name: product.name,
                price: product.offerPrice,
                quantity: item.quantity,
            })
            return (await acc) + product.offerPrice * item.quantity;
        },0)
        amount += Math.floor(amount * 0.02);

    const order =    await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "Online",
        });

        //stripe gateway
        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

        //stripe line items

        const line_items = productData.map((item)=>{
            return{
                price_data:{
                    currency: 'SGD',
                    product_data:{
                        name: item.name
                    },
                    unit_amount: Math.floor(item.price + item.price * 0.02) * 100
                },
                quantity: item.quantity,
            }
        })

        //create session
        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode: 'payment',
            success_url: `${origin}/loader?next=my-orders`,
            cancel_url: `${origin}/cart`,
            metadata: {
                orderId: order._id.toString(),
                userId,
            }
        })
        
      return  res.json({success: true, url: session.url})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

//stripe verify : /stripe

export const stripeWebhooks = async (request, response)=>{
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    const sig = request.headers['Stripe-signature'];
    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(
            request.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        response.status(400).send(`Webhook error: ${error.message}`)
    }

    //event handle

    switch (event.type) {
        case "payment_intent.succeeded":{
            const payment_intent = event.data.object;
            const payment_intentId = payment_intent.id;

            //metadeta
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: payment_intentId,
            });

            const {orderId, userId} = session.data[0].metadata;

            //mark as paid

            await Order.findByIdAndUpdate(orderId, {isPaid: true})
            //clear cart

            await User.findByIdAndUpdate(userId, {cartItems: {}})
            break;
     }
     case "payment_intent.payment_failed":{
        const payment_intent = event.data.object;
            const payment_intentId = payment_intent.id;

            //metadeta
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: payment_intentId,
            });

            const {orderId} = session.data[0].metadata;
            await Order.findByIdAndDelete(orderId)
            break;
     }


        default:
            console.error(`Unhandled event type ${event.type}`)
            break;
    }
    response.json({recived: true})
}