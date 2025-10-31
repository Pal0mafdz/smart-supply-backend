import {Request, Response} from "express";
import Supplier from "../models/supplier";


const addSupplier = async(req: Request, res: Response) =>{
    try{

        const {supplierName, email, phone, website, leadTimeDays, minOrderValue} = req.body;
        const existingSupplier = await Supplier.findOne({supplierName});

        if(existingSupplier){
            res.status(409).json({message: "The supplier already exist"});
            return;
        }
        const supplier = new Supplier({supplierName, email, phone, website, leadTimeDays, minOrderValue });
        await supplier.save();
        res.status(200).json(supplier.toObject());

        
        
        
    }catch(error){
        console.log(error);
        res.status(200).json({message: "Unable to add Supplier"});
    }

}



const updateSupplier = async(req: Request, res: Response)=> {
    try{
        const { id } = req.params;
        // const supplier = await Supplier.findOne({name: req.body});
        const supplier = await Supplier.findById({id});

        if(!supplier){
            res.status(404).json({ message: "Supplier not found"});
            return
        }

        // supplier.supplierName = req.body.supplierName;
        supplier.email = req.body.email;
        supplier.phone = req.body.phone;
        supplier.website = req.body.website;
        supplier.leadTimeDays = req.body.leadTimeDays;
        supplier.minOrderValue = req.body.minOrderValue;

        await supplier.save();
        res.status(200).send(supplier);
        
   


    }catch(error){
        console.log(error);
        res.status(500).json({message: "Unable to update supplier"});
    }
}

const getSuppliers = async(req: Request, res: Response) => {
    try{

        const suppliers = await Supplier.find({});
        res.status(200).json(suppliers);

    }catch(error){
        console.log(error);
        res.status(500).json({message: "Unable to fetch suppliers"});

    }
}

const getSupplierById = async(req: Request, res: Response)=> {
    try{
        const { id } = req.body;
        const supplier = await Supplier.findById(id);
        if (!supplier) {
          return res.status(404).json({ message: "Supplier not found" });
        }
        res.status(200).json(supplier.toObject());


    }catch(error){
        console.log(error);
        res.status(500).json({message: "Unable to fetch supplier"});

    }
}

export default{
    addSupplier,
    updateSupplier,
    getSuppliers,
    getSupplierById,
}