import Address from "../models/address.js"


//add address: /api/address/add
export const addAddress = async (req,res)=>{
    try {
        const { address } = req.body
        const userId = req.userId;
        await Address.create({...address, userId})
        res.json({success:true, message: "Address Added"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

//get address: /api/address/get
export const getAddress = async (req,res)=>{
    try {
        const userId = req.userId;
        const addresses = await Address.find({userId})
        res.json({success:true, addresses})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

