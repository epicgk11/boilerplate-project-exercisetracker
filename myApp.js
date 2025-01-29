const express = require("express");

const appRouter = express.Router();

let data = {};
let dataCount = 0;
let dataReverse = {}


appRouter.post("",(req,res)=>{
    const username = req.body.username;
    if(!username){
        res.json({"error":"please enter username"});
    }
    if(username in dataReverse){
        res.json({"error":"already exists"});
    }
    const newObject = {"username":username,"log":[],"count":0};
    data[++dataCount] = newObject;
    dataReverse[username] = dataCount;
    res.send({"username":username,"_id":dataCount});
})

appRouter.get("",(req,res)=>{
    returnData = [];
    for(userId in data){
        returnData.push({_id:userId,username:data[userId]['username']})
    }
    res.send(returnData);
});

appRouter.post("/:_id/exercises",(req,res)=>{
    if(!(req.params["_id"] in data)){
        res.json({error:"user Not found"});
    }
    const newExercise = {
        description:req.body['description'],
        duration:Number(req.body['duration']),
        date:req.body['date']?new Date(req.body['date']).toDateString():new Date().toDateString(),
    };
    data[req.params['_id']]['log'].push(newExercise);
    data[req.params["_id"]]['count'] = data[req.params["_id"]]['log'].length;
    
    res.send({
        _id: req.params['_id'],
        username: data[req.params['_id']]['username'],
        description: newExercise.description,
        duration: newExercise.duration,
        date: newExercise.date
    });
})

appRouter.get("/:_id/logs",(req,res)=>{
    const from = req.query['from']?new Date(req.query.from):null;
    const to = req.query['to']?new Date(req.query.to):null;

    const needed_id = req.params['_id'];
    if(!needed_id || !(needed_id in data)){
        res.send({message:"Error in id"});
    }
    let filteredLog = data[needed_id].log.filter((item)=>{
        const date = new Date(item['date']);
        if (from && date<from) return false;
        if (to && date>to) return false;
        return true; 
    })
    const limit = req.query['limit'] ? req.query['limit']:data[needed_id]['log'].length;
    const {username,count} = data[needed_id];
    res.send({username,count,log:filteredLog.slice(0,limit),_id:needed_id});
})

module.exports = {appRouter}