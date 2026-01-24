var orders = document.getElementById("orders");

async function getAllorder() {
  await firebase
    .database()
    .ref("Orders")
    .get()
    .then((db) => {
      console.log(db.val());
      var values = Object.values(db.val());

      var userId = localStorage.getItem("userUid");
      console.log(userId);

      for (var i = 0; i < values.length; i++) {
        if (values[i]["userId"] == userId) {
          console.log(values[i]);
          orders.innerHTML += `
          <div class="col col-lg-4 col-md-4 col-sm-6 col-12">
                <div class="card" style="width: 18rem;">
 
  <div class="card-body">
    <h5 class="card-title">Order Id # ${values[i]["orderKey"]}</h5>
    <p class="card-text">total Price : ${values[i]["totalPrice"]}</p>
    <p class="card-text">order status : ${values[i]["orderStatus"]}</p>

    <a href="./order_details.html?order_key=${values[i]["orderKey"]}" class="btn btn-primary">Details</a>
  </div>
</div>
</div>
                `;
        }
      }
    })
    .catch((e) => {
      console.log(e);
    });
}

getAllorder();


