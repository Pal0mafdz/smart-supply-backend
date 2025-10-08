import {Request, Response} from "express";

import Movement from "../models/movement";


const getMovements = async(req: Request, res: Response) =>{
    try{
        const movements = await Movement.find({}).populate("product").populate("user");
        res.status(200).json(movements);

    }catch(error){
        console.log(error);
        res.status(500).json({message: "Unable to fetch all movements"});
    }
}

export default {
    getMovements,
    
}