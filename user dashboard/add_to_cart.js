console.log(firebase.database());
var tdata = document.getElementById("tdata");
var totalAmount = document.getElementById("totalAmount");

function getAllAddTocard() {
  var items = JSON.parse(localStorage.getItem("addToCard")) || [];
  console.log(items);
  var calculatePrice = 0;
  tdata.innerHTML = "";
  

  for (var i = 0; i < items.length; i++) {
    console.log(items[i]);
    tdata.innerHTML += `
         <tr>
      <th scope="row">${i + 1}</th>
      <td>${items[i]["productName"]}</td>
      <td>${items[i]["catName"]}</td>
      <td><img style='width:50px;height:50px;border-radius:50px' src='${
        items[i]["imageUrl"]
      }'/></td>
      <td>${items[i]["price"]}</td>
      <td>
      <button onclick='increment("${items[i]["productKey"]}")'>+</button>
      <b>${items[i]["quantity"]}</b>
      <button onclick='decrement("${items[i]["productKey"]}")'>-</button>
      </td>

    </tr>
        
        `;
    calculatePrice += items[i]["quantity"] * items[i]["price"];
  }
  console.log(calculatePrice);
  totalAmount.innerText = calculatePrice;
}
getAllAddTocard();

function increment(key) {
  console.log(key);
  var items = JSON.parse(localStorage.getItem("addToCard")) || [];
  for (var i = 0; i < items.length; i++) {
    if (items[i]["productKey"] == key) {
      items[i]["quantity"] += 1;

      break;
    }
  }
  localStorage.setItem("addToCard", JSON.stringify(items));
  getAllAddTocard();
}

1;

function decrement(key) {
  console.log(key);
  var items = JSON.parse(localStorage.getItem("addToCard")) || [];
  for (var i = 0; i < items.length; i++) {
    if (items[i]["productKey"] == key) {
      if (items[i]["quantity"] > 1) {
        items[i]["quantity"] -= 1;
      } else {
        items.splice(i, 1);
      }

      break;
    }
  }
  localStorage.setItem("addToCard", JSON.stringify(items));
  getAllAddTocard();
}

async function orderPlace() {
  var items = JSON.parse(localStorage.getItem("addToCard")) || [];
  if (items.length > 0) {
    var orderKey = await firebase.database().ref("Orders").push().getKey();
    var object = {
      items,
      orderKey,
      orderStatus: "pending",
      userEamil: items[0]["email"],
      userId: items[0]["userId"],
      totalPrice: totalAmount.innerText,
    };
    console.log(object);

    await firebase.database().ref("Orders").child(orderKey).set(object);
    await SendEmailForOrder(object).then((snap) => {
      alert("order place successfully");
      localStorage.setItem("addToCard", JSON.stringify([]));
      tdata.innerHTML = "";
      totalAmount.innerText = "";
      window.location.href = "./index.html";
    });
  }
}

var data = {
  name: "test",
};
//
