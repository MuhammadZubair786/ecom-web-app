const db = firebase.database();
var loadingimg = document.getElementById("loadingimg");
var submit = document.getElementById("submit");
var userImage = document.getElementById("image");
var ShowImage = document.getElementById("ShowImage");
var changeBg = document.getElementById("changeBg");
var body = document.getElementById("body");

var checkLast = "";

changeBg.addEventListener("click", function () {
  var bgcolors = ["red", "green", "yellow", "pink", "orange", "blue"];

  var checkStatus = false;
  console.log("match number", checkLast, randomNumber);
  while (checkStatus == false) {
    var randomNumber = (Math.random() * 6).toFixed();
    if (checkLast == randomNumber) {
      2 == 2;
      console.log("match number" + checkLast + randomNumber);
    } else {
      checkLast = randomNumber; //0,2
      checkStatus = true;
    }
  }
  var checkUser = false;

  console.log(checkLast);
  body.style.backgroundColor = bgcolors[checkLast];
  localStorage.setItem("setTheme", bgcolors[checkLast]);
});

var userProfileUrl = "";

userImage.addEventListener("change", function () {
  console.log(userImage.files.length);
  if (userImage.files.length > 0) {
    ShowImage.src = URL.createObjectURL(userImage.files[0]);
    console.log(ShowImage.src);
    ShowImage.setAttribute("class", "img");
  } else {
    ShowImage.src = "";
    ShowImage.removeAttribute("class");
  }
});

async function uploadImage() {
  // alert("test")
  console.log(userImage.files[0]);
  var size = userImage.files[0].size / 1024 / 1024;
  if (size > 2) {
    alert("select image less then 2 mb");
  } else {
    const formdata = new FormData();
    formdata.append("file", userImage.files[0]);
    formdata.append("upload_preset", "CLASSDATA");

    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };

    await fetch(
      "https://api.cloudinary.com/v1_1/dgbkoycyp/image/upload",
      requestOptions,
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result["secure_url"]);
        userProfileUrl = result.secure_url;
        return userProfileUrl;
      })
      .catch((error) => {
        console.log(error);
        return null;
      });
    return userProfileUrl;
  }
}

function ImageSizeCheck() {
  if (userImage.files[0] == null) {
    alert("please select image");
    return false;
  } else {
    var size = userImage.files[0].size / 1024 / 1024;

    if (size > 2) {
      alert("select image less then 2 mb");
      return false;
    } else {
      return true;
    }
  }
}

function signUp() {
  event.preventDefault();
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  var number = document.getElementById("number").value;
  var name = document.getElementById("name").value;
  var dateofBirth = document.getElementById("date").value;

  const auth = firebase.auth();

  if (
    email == "" ||
    password == "" ||
    number == "" ||
    name == "" ||
    dateofBirth == ""
  ) {
    alert("ENTER EMAIL AND PASSWORD");
  } else {
    var sizeCheck = ImageSizeCheck(); //true or false
    if (sizeCheck == false) {
      return;
    } else {
      loadingimg.style.display = "inline";
      submit.style.display = "none";

      auth
        .createUserWithEmailAndPassword(email, password)
        .then(async (userdata) => {
          var user = userdata;
          console.log(userdata.user.uid);

          var userProfileUrl = await uploadImage();

          var object = {
            email,
            password,
            name,
            dateofBirth,
            number: number,
            uid: userdata.user.uid,
            userImage: userProfileUrl,
          };

          await db.ref("Users").child(userdata.user.uid).set(object);

          alert("Sign up Successfully");

          window.location.href = "./login.html";
        })
        .catch((error) => {
          loadingimg.style.display = "none";
          submit.style.display = "inline";
          var errorCode = error.code; //200,201,404,401
          var errorMessage = error.message;
          alert(errorMessage);
        });
    }
  }
}

// function signUp(){
//   // try{ .then
//     console.log("test")
//     console.log("sghgshd sdghsghd dgshgdhsd")
//     console.log("smit ")

//     console.log(smit)
//   // }
//   // catch(e){ .catch
//   //   console.log(e)

//   // }
//   // finally{
//     console.log("ok")
//   // }
// }

function checkUser() {
  var userLogin = localStorage.getItem("userLogin");
  if (userLogin == "true") {
    window.location.href = "./user dashboard/index.html";
  }
}

checkUser();
