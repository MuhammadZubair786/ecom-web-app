document.getElementById("sidebar-container").innerHTML = getSidebar();
var userPanel = document.getElementById("user-panel");
var select = document.getElementById("select");
var unselect = document.getElementById("unselect");
var selectUserImage = document.getElementById("selectUserImage");
var selectUserName = document.getElementById("selectUserName");

var message = document.getElementById("messages");
var messageInput = document.getElementById("messageInput");

var conservationRef = null;
var currentChatRef = null;

var adminid = "gOXcAXpZhYcNvVHeEerKzKD1Dat1";

var chatList = [];

var selectedId = "";
var selectRoomId = "";

async function getAllConsversation() {
  var conservationRef = await firebase.database().ref("chatList");
  userPanel.innerHTML = "";
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

function chatUser(index) {
  console.log(index);
  select.style.display = "flex";
  unselect.style.display = "none";
  console.log(chatList);
  selectUserName.innerText = chatList[index]["name"];
  selectUserImage.src = chatList[index]["userImage"];
  currentChatRef = null;
  selectRoomId = chatList[index]["roomid"];
  console.log(chatList[index]);
  getCurrentChat(chatList[index]["roomid"], index);
  getFirstTimeAllRoomMessage(chatList[index]["roomid"], index)
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

async function getFirstTimeAllRoomMessage(roomId,index) {
  await firebase
    .database()
    .ref("chats")
    .child(roomId)
    .get()
    .then((snap) => {
      if (snap.val() == null) {
        return;
      }
      console.log(snap.val());
      var data = Object.values(snap.val());
      console.log(data);
      message.innerHTML = "";
      for (var val of data) {
        console.log(val);
        var checkSender = val["senderid"] == adminid ? true : false; //tenary op
        if (checkSender) {
          message.innerHTML += `
         <div class="message sent">${val["message"]}</div>
        `;
        } else {
          message.innerHTML += `
         <div class="message received">${val["message"]}</div>
        `;
        }
      }
    })
    .catch((e) => {});
}

async function getCurrentChat(roomId, index) {
  console.log(roomId, index);
  selectedId = index;

  currentChatRef = await firebase.database().ref("chats").child(roomId);
  message.innerHTML = "";

  await currentChatRef.on("value", (snap) => {
    if (snap.val() == null) {
      return;
    }
    console.log(snap.val());
    var data = Object.values(snap.val());
    console.log(data);
    message.innerHTML = "";
    for (var val of data) {
      console.log(val);
      var checkSender = val["senderid"] == adminid ? true : false; //tenary op
      if (checkSender) {
        message.innerHTML += `
         <div class="message sent">${val["message"]}</div>
        `;
      } else {
        message.innerHTML += `
         <div class="message received">${val["message"]}</div>
        `;
      }
    }
  });
}

async function sendMessage() {
  //   RecieverId
  // :
  // "gOXcAXpZhYcNvVHeEerKzKD1Dat1"
  // message
  // :
  // "ok"
  // messageKey
  // :
  // "-Okvi_qrmQoilhuKQVcP"
  // senderid
  // :
  // "9eLenUqn0GfpFQohucuXJlUoU652"
  console.log(chatList[selectedId]);

  var RecieverId =
    chatList[selectedId]["RecieverId"] == adminid
      ? chatList[selectedId]["senderId"]
      : chatList[selectedId]["RecieverId"];

  var messageKey = firebase
    .database()
    .ref("chats")
    .child(selectRoomId)
    .push()
    .getKey();
  var object = {
    RecieverId: RecieverId,
    senderid: adminid,
    message: messageInput.value,
    messageKey: messageKey,
  };
  console.log(object);
  await firebase
    .database()
    .ref("chats")
    .child(selectRoomId)
    .child(messageKey)
    .set(object);
}
