import express from "express";
import cors from "cors";
import path from "path";
import url, { fileURLToPath } from "url";
import ImageKit from "imagekit";
import mongoose from "mongoose";
import Chat from "./models/chat.js";
import UserChats from "./models/userChats.js";
import { ClerkExpressRequireAuth ,ClerkExpressWithAuth,requireAuth } from "@clerk/clerk-sdk-node";

// import {ClerkExpressWithAuth, requireAuth } from "@clerk/express";

// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
// dotenv.config(); // ✅ loads the env vars
const port=process.env.PORT||3001;
const app=express();

const __filename=fileURLToPath(import.meta.url)
const __dirname=path.dirname(__filename);
// app.use(cookieParser());
app.use(cors({
  origin:process.env.CLIENT_URL,
  credentials:true,
  
}))
app.use(express.json());
// app.use(require('@clerk/express').ClerkExpressWithAuth({}));
app.use(
  ClerkExpressWithAuth({
    secretKey: process.env.CLERK_SECRET_KEY,
  })
);



const connect =async ()=>{
  try{
   await mongoose.connect(process.env.MONGO)
    console.log("Connected to MongoDB");
  }
  catch(err){
    console.log(err)
  }
}

const imagekit = new ImageKit({
  urlEndpoint:process.env.IMAGE_KIT_ENDPOINT, // https://ik.imagekit.io/your_imagekit_id
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY
});



app.get("/api/upload",(req,res)=>{
 const result = imagekit.getAuthenticationParameters();
 res.send(result);
})


app.post("/api/chats",ClerkExpressRequireAuth(),async(req,res)=>{
  const userId=req.auth.userId;
  const {text}=req.body
  
 try{
  // create a new Chat
  const newChat =new Chat({
    userId:userId,
    history:[{role:"user",parts:[{text}]}]
  });
  const savedChat = await newChat.save();

  //  check if the userCHta exist
  const userChats= await UserChats.find({userId:userId});
// If doesnot exist create a new one and add in the chats array

  if(!userChats.length){
    const newUserChats=new UserChats({
      userId:userId,
      chats:[
        {
        _id:savedChat._id,
        title:text.substring(0,40),
        
        },
      ],
    })
    await newUserChats.save();
    res.status(201).send(newChat._id); // ! adding chatgbt:
  }else{
    // if exists ,push the chats to the existing array
    await UserChats.updateOne({userId:userId},{
      $push:{
        chats:{
          _id:savedChat._id,
          title:text.substring(0,40)
        }
      }
    })
    res.status(201).send(newChat._id);

  }
 }
 catch(err){
  console.log(err)
  res.status(500).send("Error creating chat!");
 }
})
//THIS GET METHOD BY YOUTUBER FACING ERROR WHEN USERCHAT IS EMPTY
// app.get("/api/userchats",ClerkExpressRequireAuth(),async(req,res)=>{
//   const userId =req.auth.userId;
//   try{
//   const userChats= await UserChats.find({userId});
//   res.status(200).send(userChats[0].chats||[])
//   }
//   catch(err){
//     console.log(err);
//     res.status(500).send("Error fetching userchats!");
//   }

// })
 
// CHATGBT SUJJECTION HERE 
app.get("/api/userchats", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;

  try {
    let userChats = await UserChats.findOne({ userId });

    // If not found, create a blank one
    if (!userChats) {
      userChats = new UserChats({
        userId,
        chats: [],
      });
      await userChats.save();
    }

    res.status(200).send(userChats.chats);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching userchats!");
  }
});
//end to userchat
app.get("/api/chats/:id",ClerkExpressRequireAuth(),async(req,res)=>{
  const userId =req.auth.userId;
  try{
  const chat= await Chat.findOne({_id:req.params.id,userId});
  res.status(200).send(chat)
  }
  catch(err){
    console.log(err);
    res.status(500).send("Error fetching chat!");
  }

})

app.put("/api/chats/:id",ClerkExpressRequireAuth(),async(req,res)=>{
  const userId =req.auth.userId;
  const {question,answer,img}=req.body;
  const newItems=[
    ...(question ?[{role:"user",parts:[{text:question}],...(img&&{img}) }]:[]),
   {role:"model",parts:[{text:answer}]},
  ];
  try{
    const updatedChat=await Chat.updateOne({_id:req.params.id ,userId},
    { $push:{
  history:{
   $each:newItems,
     }
   }}
  ); 
  res.status(200).send(updatedChat)
  }
  catch(err){
    console.log(err);
    res.status(500).send("Error adding conversation!");
  }
})
app.use((err,req,res,next)=>{
  console.error(err.stack);
  res.status(401).send('Unauthenticated!');
});
app.use(express.static(path.join(__dirname,"../client")))
// instide of "*" i use "/" because error : path-to-regexp\
app.get("/",(req,res)=>{
  res.sendFile(path.join(__dirname,"../client","index.html"));
})



// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../client", "index.html"));
// });
app.listen(port,()=>{
  connect()
  console.log(`Serveris running on http://localhost:${port}`);
});
