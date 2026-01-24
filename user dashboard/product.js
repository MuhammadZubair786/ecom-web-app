const queryString = window.location.search;
console.log(queryString);

const urlParams = new URLSearchParams(queryString);
console.log(urlParams);

var category_name = urlParams.get("category_Name");
console.log(category_name);

var category_key = urlParams.get("cat_key");
console.log(category_key);

var categoryName = document.getElementById("categoryName");
categoryName.innerText = category_name;

var products = document.getElementById("products");

async function getAllproducts() {
    
  await firebase
    .database()
    .ref("Products")
    .get()
    .then((db) => {
      var data = Object.values(db.val());
        products.innerHTML=""
      console.log(data);
      var checkProduct = false
      for (var i = 0; i < data.length; i++) {

        console.log(data[i]["catKey"]);
        if (data[i]["catKey"] == category_key) {
            checkProduct=true;
          //SEARCH
          products.innerHTML += `
                <div class="col col-lg-4 col-md-4 col-sm-6 col-12 mt-3">
                    <div class="card">
                        <div class="card-body">
                            <img src="${data[i]["imageUrl"]}" class="card-img-top" style='height:200px'/>

                            <h5 class="card-title">${data[i]["productName"]}</h5>
                            <h5 class="card-title">Rs . ${data[i]["price"]}</h5>

                            <a class="btn btn-primary" onclick="setAddToCard('${data[i]["catKey"]}','${data[i]["productKey"]}','${data[i]["catValue"]}','${data[i]["productName"]}','${data[i]["price"]}','${data[i]["imageUrl"]}')">add to cart</a>
                        </div>
                    </div>
                
                </div>
                
                `;
        }
        
      }
      if(checkProduct==false){
         products.innerHTML ="No product found"

      }
    })
    .catch((e) => {
      console.log(e);
    });
}

getAllproducts();

function setAddToCard(
  catkey,
  productKey,
  catName,
  productName,
  price,
  imageUrl,
) {
  console.log(catkey);
  console.log(productKey);

  var userId = localStorage.getItem("userUid");
  var email = localStorage.getItem("email");
  var data = localStorage.getItem("addToCard");
  var localItems=[]
  if(data!=null){
      localItems = JSON.parse(localStorage.getItem("addToCard") || []);
  }
  

  //
  //empty
  console.log(localItems); // item add

  var check = false; //item set yes or no

  for (var i = 0; i < localItems.length; i++) {
    if (localItems[i]["productKey"] == productKey) {
      check = true;
      break;
    }
  }

  if (check == true) {
    alert("already add this item in add to cart");
  } else {
    var object = {
      categorykey: catkey,
      productKey: productKey,
      catName,
      productName,
      price,
      quantity: 1,
      userId,
      email,
      imageUrl,
    };
    console.log(object);

    localItems.push(object);
    localStorage.setItem("addToCard", JSON.stringify(localItems));
    alert("item add to cart successfully");
  }
}
