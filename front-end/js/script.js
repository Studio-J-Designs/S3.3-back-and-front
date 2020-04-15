console.log(sessionStorage);
console.log(sessionStorage['userId']);

let url;
sessionStorage;

//get url and port from config.json
$.ajax({
  url :'config.json',
  type :'GET',
  dataType :'json',
  success : function(configData){
    // console.log(configData);
    url = `${configData.SERVER_URL}:${configData.SERVER_PORT}`;
    // console.log(url);
  },//success
  error:function(){
    console.log('error: cannot call api');
  }//error
});//ajax

$(document).ready(function(){
  // console.log("js is working");

  // stuff needed:

  // View User --  done
  // Add User -- done
  // Delete User -- im an idiot and don't know how to do it
  // Update User - don't need / im an idiot and don't know how to do it

  // Login User -- done
  // Logout User -- done

  // View All Posts --
  // View A Specific Post --
  // Add Post -- done
  // Delete Post -- done
  // Update Post -- done




  if (sessionStorage['userName']) {
    console.log('You are logged in');
    showUserName(sessionStorage.userName);
  } else {
    console.log('Please login');
  }

  //logout button
  $('#logoutBtn').click(function(){
    sessionStorage.clear();
    // console.log(sessionStorage);
  });

  //View User JS and login
  $('#loginSubmitBtn').click(function(){
    let username = $('#inputUsernameLogin').val();
    let password = $('#inputPasswordLogin').val();
    $.ajax({
      url :`${url}/loginUser`,
      type :'POST',
      data:{
        username : username,
        password : password
      },
      success : function(loginData){
        console.log(loginData);
        if (loginData === 'Please fill in all areas') {
          alert('Please fill in all areas')
        }else if (loginData === 'User not found. Please register') {
          alert('Register please')
        } else if (loginData === 'Not Authorized') {
          alert('Incorrect Password')
        } else {
          sessionStorage.setPost('userId',loginData['_id']);
          sessionStorage.setPost('userName',loginData['username']);
          sessionStorage.setPost('userEmail',loginData['email']);
          console.log(sessionStorage);
        }
      },//success
      error:function(){
        console.log('error: cannot call api');
      }//error
    });//ajax
  });

  //Add User
  $('#signUpSubmitBtn').click(function(){
    let username = $('#inputUserNameSignup').val();
    let email = $('#inputEmailSignup').val();
    let password = $('#inputPasswordSignup').val();
    console.log(username,email, password);
    $.ajax({
      url :`${url}/addUser`,
      type :'POST',
      data:{
        username : username,
        email : email,
        password : password
      },
      success : function(loginData){
        console.log(loginData);
        if (loginData === 'Please fill in all areas') {
          alert('Please fill in all areas')
        } else if (loginData === 'Username taken already. Please try another one') {
          alert('Username taken already. Please try another one')
        } else {
          sessionStorage.setPost('userId',loginData['_id']);
          sessionStorage.setPost('userName',loginData['username']);
          sessionStorage.setPost('userEmail',loginData['email']);
          console.log(sessionStorage);
          showUserName(sessionStorage.userName);
        }
      },//success
      error:function(){
        console.log('error: cannot call api');
      }//error
    });//ajax
  });

  // View Post
  $.ajax({
    url :`${url}/allPosts`,
    type :'GET',
    dataType :'json',
    success : function(postsFromMongo){
      console.log(postsFromMongo);
      }
    },//success
    error:function(){
      console.log('error: cannot call api');
    }//error
  });//ajax

  // Add Post
  $('#postAddBtn').click(function(){
    let username = sessionStorage.userName;
    let description = $('#description').val();
    let imageURL= $('#imageurl').val();
    $.ajax({
      url :`${url}/addPost`,
      type :'POST',
      data:{
        username :username,
        description : description,
        imageURL: image,
        userId : sessionStorage.getPost('userId')
      },
      success : function(loginData){
        console.log(loginData);
      },//success
      error:function(){
        console.log('error: cannot call api');
      }//error
    });//ajax
  });
});

// Update Post
$('#postUpdateBtn').click(function(){
  console.log('button pressed');
  event.preventDefault();
  let postId = $('#updatePostId').val();
  let postUsername = $('#updatePostUsername').val();
  let userId = $('#updatePostUserId').val();
  let postDescription = $('#updatePostDescription').val();
  let postImage = $('#updatePostImage').val();

  $.ajax({
    url :`${url}/updatePost/${postId}`,
    type :'PATCH',
    data:{
      _id: postId,
      username : postUsername,
      userId : userId,
      description : postDescription,
      imageURL: postImage
    },
    success : function(data){
      console.log(data);
    },//success
    error:function(){
      console.log('error: cannot call api');
    }//error
  });//ajax
});


// Delete post

$('#postDeleteBtn').on('click',function(){
  // event.preventDefault();
  let postId = $('#deletePostId').val();
  console.log(postId);
    $.ajax({
    url :`${url}/deletePost/${postId}`,
    type :'DELETE',
    success : function(data){
      console.log(data);
      if (data=='deleted'){
        alert('deleted');
      } else {
        alert('Error while deleting post');
      }
    },//success
    error:function(){
      console.log('error: cannot call api');
    }//error
  });//ajax
});


function showUserName(name){
  document.getElementById('userName').innerHTML = "Hello " + name +"!";
}
