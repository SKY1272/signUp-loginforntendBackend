const express=require('express');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const cors=require('cors');
const bodyParser = require('body-parser');
const app=express();
const port=5000;
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(bodyParser.json());
let users=[];
const SECRET_KEY='Mysecret'

app.post('/signUp',async(req,res)=>{
  const{name,email,password}=req.body;
  const existingUser=users.find(user=>user.email===email);
  if(existingUser){
    console.log("User already exists:", email);
    res.status(500).json({message:'user already exist'});

  }
  const hashPassword=await bcrypt.hash(password,10);
  const newUser={id:Date.now(),name,email,password:hashPassword};
  users.push(newUser);
  res.status(200).json({message:"user registered successfully"})
})
app.post('/login',async(req,res)=>{
  const{email,password}=req.body;
  const user=users.find(user=>user.email===email);
  if(!user){
    res.status(500).json({message:"user creditional not found"})
  }
  const isMatch=await bcrypt.compare(password,user.password);
  if(!isMatch){
    req.status(500).json({message:'user creditional not macthed'})
  }
  const jwtToken=jwt.sign({id:user.id,email:user.email},SECRET_KEY,{expiresIn:'1h'});
  res.json({message:'login successful',jwtToken})
})
app.listen(port,()=>{
  console.log(`server running at http://localhost:${port}`);
})