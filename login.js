var products = document.getElementById("products")
var body = document.getElementById("body")


function setTheme(){
 var color =  localStorage.getItem("setTheme")
  body.style.backgroundColor=color
}

setTheme()

function logIn() {
  event.preventDefault();
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;

  const auth = firebase.auth();
  var db = firebase.database();

  if (email == "" && password == "") {
    alert("ENTER EMAIL AND PASSWORD");
  } else {
    auth
      .signInWithEmailAndPassword(email, password)
      .then(async (userdata) => {
        var user = userdata;
           console.log(userdata.user.uid);

       await  db
          .ref("Users")
          .child(userdata.user.uid)
          .get()
          .then((DATA) => {
            console.log(DATA.val());
            localStorage.setItem("userLogin",true)
            localStorage.setItem("email",email)
            localStorage.setItem("userUid",userdata.user.uid)
            window.location.href="./user dashboard/index.html"
// firebase.auth().signout()

          })
          .catch((e) => {
            alert(e);
          });
          console.log("test")
      })
      .catch((error) => {
        var errorCode = error.code; //200,201,404,401
        var errorMessage = error.message;
        alert(errorMessage);
      });
  }
}

function checkUser(){
  var userLogin = localStorage.getItem("userLogin")
  if(userLogin=="true"){
    window.location.href="./user dashboard/index.html"

  }
}

checkUser()

// function GETProducts(){
//   const requestOptions = {
//   method: "GET",
//   redirect: "follow"
// };

// fetch("https://fakestoreapi.com/products", requestOptions)
//   .then((response) => response.text())
//   .then((result) =>{
//     var data = JSON.parse(result)
//     for(var i=0;i<data.length;i++){
//       console.log(data[i])
//       products.innerHTML+=`
//       <div>
//       <h1>${data[i]["title"]}</h1>
//       <img src="${data[i]["image"]}"/>
//       </div>
//       `
//     }
//   })
//   .catch((error) => console.error(error));
// }


// GETProducts()