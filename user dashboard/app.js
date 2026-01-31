async function getAllCategory() {
  var category = document.getElementById("category");
  console.log(category);
  await firebase
    .database()
    .ref("category")
    .get()
    .then((db) => {
      var data = Object.values(db.val()); // convert into array (human read)
      category.innerHTML = "";

      for (var i = 0; i < data.length; i++) {
        console.log(data[i]);
        category.innerHTML += `
                <div class="col col-lg-4 col-md-4 col-sm-6 col-12 mt-3">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${data[i]["categoryName"]}</h5>
                            <a
                          
                            href="./product.html?category_Name=${data[i]["categoryName"]}&cat_key=${data[i]["categoryKey"]}" class="btn btn-primary">View Products</a>
                        </div>
                    </div>
                
                </div>
              

        `;
      }
    })
    .catch((e) => {
      console.log(e);
    });
  console.log("jdhsfjsdjhf");
}

function setData() {
  localStorage.setItem("category_name");
}

function checkUser() {
  var userLogin = localStorage.getItem("userLogin");
  console.log(userLogin);
  if (userLogin == "false" || userLogin == null) {
    window.location.href = "../login.html";
  }
}

checkUser();

var logout = document.getElementById("logout");

logout.addEventListener("click", function () {
  localStorage.clear();
  window.location.replace("../login.html");
});

// alert()

// console.log()

//   onclick="setData('${data[i]["categoryName"]}','${data[i]["categorykey"]}')"
//

// function setData(catname, catkey) {
//   console.log(catname);
//   console.log(catkey);
//   localStorage.setItem("category_name", catname);
//   localStorage.setItem("category_key", catkey);
//   window.location.href = "./product.html";
// }

// window.onload()
getAllCategory();

function setEmailJsConfigure() {
  console.log(emailjs);
}

async function SendEmailForOrder(data) {
  data["tax"]=(data["totalPrice"]*20/100)
  data["email"]= "newsmit@yopmail.com"  //user order => admin send 
  data["totalOrderPrice"]= Number(data["totalPrice"])+Number(data["tax"])
  console.log(data);
  console.log(emailjs);
  emailjs.init({
    publicKey: "publickey",
  });



 await emailjs.send("service_id","templateid",data)
  .then((data)=>{
    console.log(data)
  })
  .catch((e)=>{
    console.log(e)
  })
}

setEmailJsConfigure();


{/*  */}

