const queryString = window.location.search;
console.log(queryString);

const urlParams = new URLSearchParams(queryString);
console.log(urlParams);

var order_key = urlParams.get("order_key");
console.log(order_key);

var ordersDetails = document.getElementById("ordersDetails");

async function getOrderDetails() {
  await firebase
    .database()
    .ref("Orders")
    .child(order_key)
    .get()
    .then((snap) => {
      console.log(snap.val());
      var values = Object.values(snap.val());
      console.log(values);

      for (var i = 0; i < values[0].length; i++) {
        ordersDetails.innerHTML += `
           
          <div class="col col-lg-4 col-md-4 col-sm-6 col-12">
                <div class="card" >
 
  <div class="card-body">
   <img src="${values[0][i]["imageUrl"]}" class="card-img-top" alt="..." style="height:200px;width:100%">
    <h5 class="card-title">Order Id # ${values[0][i]["productName"]}</h5>
    <p class="card-text">quantity : ${values[0][i]["quantity"]}</p>
    <p class="card-text">price : ${values[0][i]["price"] * values[0][i]["quantity"]}</p>



   
  </div>
</div>
</div>
                
            `;
      }
    })
    .catch((E) => {
      console.log(E);
    });
}

getOrderDetails();
