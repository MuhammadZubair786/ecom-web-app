var sendBtn = document.getElementById("sendBtn");
var chats = document.getElementById("chats");
var input = document.getElementById("input");

var ROOMID = "";

var chatRef = ""; // for run time chat show

input.addEventListener("keypress", function (e) {
  if (e.key == "Enter") {
    sendBtn.click()


  }
});

//send message
sendBtn.addEventListener("click", async function () {
  console.log(ROOMID);

  console.log(chatRef);

  var messageKey = await chatRef.push().getKey();

  var senderid = localStorage.getItem("userUid");
  var adminid = "gOXcAXpZhYcNvVHeEerKzKD1Dat1";

  var object = {
    senderid: senderid,
    RecieverId: adminid,
    messageKey,
    message: input.value,
  };
  await chatRef.child(messageKey).set(object);
  input.value=""
  // alert("send message");
});

async function createRoomiD(senderId, RecieverId) {
  var roomid = await firebase.database().ref("chatList").push().getKey();
  var object = {
    senderId,
    RecieverId,
    roomid,
  };

  await firebase.database().ref("chatList").child(roomid).set(object);
  return roomid;
}

async function returnRoomId(senderId, RecieverId, chatlist) {
  var roomid = "";
  for (var i = 0; i < chatlist.length; i++) {
    console.log(chatlist[i]);

    if (
      (chatlist[i]["RecieverId"] == RecieverId &&
        chatlist[i]["senderId"] == senderId) ||
      (chatlist[i]["RecieverId"] == senderId &&
        chatlist[i]["senderId"] == RecieverId)
    ) {
      console.log(chatlist[i]);
      roomid = chatlist[i]["roomid"]; //room create ho already
      break;
    }
  }
  return roomid;
}

//room check => exit=>return id,create room id ,create room id
async function checkRoom(senderId, RecieverId) {
  await firebase
    .database()
    .ref("chatList")
    .get()
    .then(async (snap) => {
      console.log(snap.val()); //chat empty
      if (snap.val() == null) {
        var roomid = await createRoomiD(senderId, RecieverId);
        console.log(roomid);
        ROOMID = roomid;
      } else {
        var chatlist = Object.values(snap.val());
        console.log(chatlist);
        var roomid = await returnRoomId(senderId, RecieverId, chatlist);
        ROOMID = roomid;
      }
      if (ROOMID == "") {
        var roomid = await createRoomiD(senderId, RecieverId);
        console.log(roomid);
        ROOMID = roomid;
      }
    })
    .catch((e) => {
      console.log(e);
    });
  console.log(ROOMID);
  return ROOMID;
}

async function loadfunction() {
  var senderid = localStorage.getItem("userUid");
  var adminid = "gOXcAXpZhYcNvVHeEerKzKD1Dat1"; //
  var roomChat = await checkRoom(senderid, adminid); //room create
  chatRef = await firebase.database().ref("chats").child(roomChat); // set room ref
  console.log(chatRef);

  getRoomsChat(roomChat); //get all chats
}

//get all chats
async function getRoomsChat(roomChat) {
  var senderid = localStorage.getItem("userUid");
  console.log(chatRef);
  // await firebase
  //   .database()
  //   .ref("chats")
  //   .child(roomChat)
  //   .get()
  //   .then((snap) => {
  chatRef.on("value", (snap) => {
    chats.innerHTML = "";

    console.log(snap.val());
    if (snap.val() == null) {
      return;
    }
    var data = Object.values(snap.val());
    for (var i = 0; i < data.length; i++) {
      console.log(data[i]);

      if (senderid == data[i]["senderid"]) {
        chats.innerHTML += `
          <div class='row'> 
          <div class='col col-lg-6'></div>
            <div class='col col-lg-6'>
            <h3 class="send">
            <b class="chatcontainer"> ${data[i]["message"]} </b>
          </h3>


            </div>
            </div>
            `;
      } else {
        chats.innerHTML += `
            <div class='row'> 
            <div class='col col-lg-6'>
            <h3 class="recieve">
            <b class="chatcontainer"> ${data[i]["message"]} </b>
          </h3>


            </div>
          <div class='col col-lg-6'></div>

            </div>
            `;
      }
    }
  });
  // .catch((e) => {
  //   console.log(e);
  // });
}
