document.getElementById("sidebar-container").innerHTML = getSidebar();
var userPanel = document.getElementById("user-panel");
var select = document.getElementById("select");
var unselect = document.getElementById("unselect");
var selectUserImage = document.getElementById("selectUserImage");
var selectUserName = document.getElementById("selectUserName");


var conservationRef = "";
var adminid = "gOXcAXpZhYcNvVHeEerKzKD1Dat1";

var chatList = [];

var selectedId = "";

async function getAllConsversation() {
  var conservationRef = await firebase.database().ref("chatList");
  conservationRef.on("value", async function (snap) {
    var data = Object.values(snap.val()); //convert
    console.log(data);
    for (var val in data) {
      if (data[val]["senderId"] != undefined) {
        console.log(val);
        var userDetails = await getUserDetails(data[val]["senderId"]);
        if (userDetails != undefined) {
          console.log(userDetails);
          chatList.push({ ...userDetails, ...data[val] }); //sperator operator
          console.log(userDetails["userImage"]);
          userPanel.innerHTML += `
           <div class="user-item" onclick="chatUser(${val})">
      <img src=${userDetails["userImage"]} />
      <span>${userDetails["name"]}</span>
    </div>
          `;
        }
      }
    }
  });
}

getAllConsversation();

function chatUser(index){
    select.style.display="flex"
    unselect.style.display="none"
    selectUserName.innerText=chatList[index]["name"]
    selectUserImage.src=chatList[index]["userImage"]
    console.log(chatList[index])

}

async function getUserDetails(id) {
  var userDetails = {};
  await firebase
    .database()
    .ref("Users")
    .child(id)
    .get()
    .then((snap) => {
      //   console.log(snap.val());
      userDetails = snap.val();
    })
    .catch((e) => {
      console.log(e);
    });
  return userDetails;
}
