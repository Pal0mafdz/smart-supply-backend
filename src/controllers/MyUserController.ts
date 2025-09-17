import {Request, Response} from "express";
import User from "../models/user";

const createCurrentUser = async (req: Request, res: Response)=>{
    try{
        const {auth0Id, email, name} = req.body;
        // const existingUser = await User.findOne({auth0: auth0Id});
        const existingUser = await User.findOne({
            $or: [{ auth0: auth0Id }, { email }],
          });
        //let user = await User.findOne({ auth0: auth0Id });

        if(existingUser){
            res.status(200).send();
            return;
        }

        

        const newUser = new User({auth0: auth0Id, email, name, role: "unauthorized"});
        await newUser.save();

        res.status(201).json(newUser.toObject());


    }catch(error){
        console.log(error);
        res.status(500).json({message: "Error creating user"});
    }

}






const getUsers = async (req: Request, res: Response) =>{
    try{
        const users = await User.find({}); 
        res.status(200).json(users);
    }catch(error){
        console.log(error);
        res.status(500).json({message: "Error fetching users"});
    }
}

const getCurrentUser = async( req: Request, res: Response) =>{
    try{
        const currentuser = await User.findById({ _id: req.userId});
        if(!currentuser){
            res.status(404).json({message: "User not found"});
            return
        }
        res.json(currentuser);

    }catch(error){
        console.log(error);
        res.status(500).json({message: "Error fetching user"});
    }

}




// const createAdminUser = async () => {
//     try {
//       const existingAdmin = await User.findOne({ role: "admin" });
//       if (existingAdmin) {
//         console.log("Admin ya existe.");
//         return;
//       }
  
//       const admin = new User({
//         auth0: "68c3d16322ab9b871455e669", 
//         email: "alu.22131401@correo.itlalaguna.edu.mx",
//         name: "Paloma",
//         role: "admin",
//       });
  
//       await admin.save();
//       console.log("Usuario admin creado correctamente.");
//     } catch (error) {
//       console.error("Error creando admin:", error);
//     }
//   };



export default {
     createCurrentUser,
     getUsers,
     getCurrentUser,
   
    
}