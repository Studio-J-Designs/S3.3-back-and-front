
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcryptjs = require('bcryptjs');
const config = require('./config.json');
const Post = require('./models/post.js');
const User = require('./models/user.js');

const port = 3000;


// const mongodbURI = `mongodb+srv://${config.MONGO_USER}:${config.MONGO_PASSWORD}@${config.MONGO_CLUSTER_NAME}.mongodb.net/?retryWrites=true&w=majority`
// mongoose.connect(mongodbURI, {useNewUrlParser: true, useUnifiedTopology: true})

.then(()=> console.log('DB connected'))
.catch(err =>{
  console.log(`DBConnectionError: ${err.message}`);
});

// test connection
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
  console.log('We are connected to MongoDB');
});

// connect endpoints
app.use((req,res,next)=>{
  console.log(`${req.method} request for ${req.url}`);
  next();//include this to go to the next middleware
});

// include body-parser, cors, bcryptjs
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(cors());



// View User -- done
// Add User -- done
// Delete User -- done
// Update User - don't need / im an idiot and don't know how to do it

// Login User -- done
// Logout User - not done in back-end

// View All Posts -- done
// View A Specific Post -- done
// Add Post -- done
// Delete Post -- done
// Update Post -- done


// Test/Developer Code Start

//get all User
app.get('/allUser', (req,res)=>{
  User.find().then(result =>{
    res.send(result);
  })
});

// Test/Developer Code End

// View User
app.get('/user/:id', (req,res) =>{
  const idParam = req.params.id;
  User.findOne({_id:idParam}).then(userResult =>{
      res.send(userResult);
  }).catch(err => res.send(err)); //refers to mogodb id
});

// Add User
app.post('/addUser', (req,res)=>{
  User.findOne({username:req.body.username},(err,userResult)=>{
    if (req.body.username === ""){
      res.send('Please fill in all areas');
    } else if (userResult){
      res.send('Username taken already. Please try another one');
    } else{
      const hash = bcryptjs.hashSync(req.body.password);
      const user = new User({
        _id : new mongoose.Types.ObjectId,
        username : req.body.username,
        password :hash,
        email : req.body.email,
        avatar : 'defaultAvatar.png'
      });
      user.save().then(result =>{
        res.send(result);
      }).catch(err => res.send(err));
    }
  })
});

// DELETE User
app.delete('/deleteUser/:id',(req,res)=>{
  const idParam = req.params.id;
  User.findOne({_id:idParam}, (err,user)=>{
    if (user){
      User.deleteOne({_id:idParam},err=>{
        res.send('deleted');
      });
    } else {
      res.send('not found');
    }
  }).catch(err => res.send(err)); //refers to mogodb id
});

//Login User
app.post('/loginUser', (req, res) =>{
  User.findOne({username:req.body.username},(err, userResult) =>{
    if (userResult) {
      if (bcryptjs.compareSync(req.body.password, userResult.password)){
        res.send(userResult);
      } else {
        res.send('Not Authorized');
      }
    } else if (req.body.username === "") {
      res.send('Please fill in all areas');
    } else {
      res.send('User not found. Please register');
    }
  });
});

// View all Posts
app.get('/allPosts', (req,res) =>{
  Post.find().then(result =>{
    res.send(result);
  }).catch(err => res.send(err));
});

// View a specific Post
app.get('/posts/:id', (req,res) =>{
  const idParam = req.params.id;
  Post.findOne({_id:idParam}).then(postResult =>{
      res.send(postResult);
  }).catch(err => res.send(err)); //refers to mogodb id
});

// ADD a Post
app.post('/addPost', (req,res) =>{
  Post.findOne({image:req.body.title},(err,postResult)=>{
    if (postResult){
      res.send('Post already added');
    } else{
      const post = new Post({
        _id : new mongoose.Types.ObjectId,
        username : req.body.username,
        userId : req.body.userId,
        description: req.body.description,
        imageUrl : req.body.image,
        date : req.body.title
      });
      post.save().then(result =>{
        res.send(result);
      }).catch(err => res.send(err));
    }
  })
});

// DELETE a Post
app.delete('/deleteProject/:id',(req,res)=>{
  const idParam = req.params.id;
  Post.findOne({_id:idParam}, (err,post)=>{
    if (post){
      Post.deleteOne({_id:idParam},err=>{
        res.send('deleted');
      });
    } else {
      res.send('not found');
    }
  }).catch(err => res.send(err)); //refers to mogodb id
});

// UPDATE a Post
app.patch('/updatePost/:id',(req,res)=>{
  const idParam = req.params.id;
  Post.findById(idParam,(err,post)=>{
    if(!post){
      res.send('post not found');
      return;
    }
    const updatedPost ={
      _id:idParam,
      username : req.body.username,
      userId : req.body.userId,
      description: req.body.description,
      imageUrl : req.body.image,
      date : req.body.title
    };
    Post.updateOne({_id:idParam}, updatedPost).then(result=>{
      res.send(result);
    }).catch(err=> res.send(err));

  }).catch(err=>res.send('Error'));
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
