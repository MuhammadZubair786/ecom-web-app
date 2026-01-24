var tableBody = document.getElementById("table-body");

const modal = document.getElementById("modal");
const modalForm = document.getElementById("modal-form");
var btn = document.getElementsByClassName("save");

var ord_status = document.getElementById("ord-status");
console.log(btn[0]);

var selectedOrderkey = "";

async function getAllOrder() {
  await firebase
    .database()
    .ref("Orders")
    .get()
    .then((Snap) => {
      console.log(Snap.val());
      var data = Object.values(Snap.val()); //convert array
          tableBody.innerHTML=""

      for (var i = 0; i < data.length; i++) {
        tableBody.innerHTML += `
            <tr>
            <td>${i + 1}</td>
            <td>${data[i]["userEamil"]}</td>
            <td>${data[i]["totalPrice"]}</td>
            <td>${data[i]["orderStatus"]}</td>
            <td><button onclick="editBtn('${data[i]["orderKey"]}')">Update</button></td>

            </tr>

            `;
      }

      // crud
    })
    .catch((E) => {
      console.log(E);
    });
}

async function editBtn(key) {
  modal.classList.add("active"); // modal open
  console.log(key); //order

  selectedOrderkey = key;

  //get order with spefiecs order key
  await firebase
    .database()
    .ref("Orders")
    .child(key)
    .get()
    .then((snap) => {
      console.log(snap.val()); //firebase data convert into readable formate
      document.getElementById("ord-user").value = snap.val()["userEamil"];
      document.getElementById("ord-total").value = snap.val()["totalPrice"];
      document.getElementById("itemsDetails").innerHTML = "";
      var length = 4;

      if (snap.val()["items"].length > 4) {
        length = 4;
      } else {
        length = snap.val()["items"].length;
      }

      for (var i = 0; i < length; i++) {
        console.log(snap.val()["items"][i]);
        document.getElementById("itemsDetails").innerHTML += `
          <div class="div">
                        <img src="${snap.val()["items"][i]["imageUrl"]}"/>
                        <h1>Name : ${snap.val()["items"][i]["productName"]}</h1>
                        <p>price :${snap.val()["items"][i]["price"]}</p>
                        <p>Quantity : ${snap.val()["items"][i]["quantity"]}</p>


                    </div>
        `;
      }

      // document.getElementById('itemsDetails').value =``
    })
    .catch((E) => {
      console.log(E);
    });
}

function closeModal() {
  modal.classList.remove("active");
}

getAllOrder();

btn[0].addEventListener("click", async function () {
  // alert("hgsahghasgh")
  event.preventDefault();
  console.log(selectedOrderkey);

  await firebase
    .database()
    .ref("Orders")
    .child(selectedOrderkey)
    .get()
    .then(async (Snap) => {
      console.log(Snap.val());
      var data = Snap.val();
      console.log(ord_status.value);
      data["orderStatus"] = ord_status.value;
      console.log(data);

      await firebase.database().ref("Orders").child(selectedOrderkey).set(data);
      alert("order status update ")
      getAllOrder()
      closeModal()
      
      // cnors jobs
      // Snap.val()
    })
    .catch((e) => {});
});

async function deleteoRER(){
   await firebase.database().ref("Orders").remove()
}
