var sendBtn = document.getElementById("sendBtn");
var chats = document.getElementById("chats");

var ROOMID = "";

var chatRef = "";

sendBtn.addEventListener("click", async function () {
  console.log(ROOMID);
  chatRef = await firebase.database().ref("chats").child(ROOMID);
  var input = document.getElementById("input");

  console.log(chatRef);

  var messageKey = await chatRef.push().getKey();

  var senderid = localStorage.getItem("userUid");
  var adminid = "gOXcAXpZhYcNvVHeEerKzKD1Dat1";

  var object = { senderid, adminid, messageKey, message: input.value };
  await chatRef.child(messageKey).set(object);
  alert("send message");
});

async function checkRoom(senderId, RecieverId) {
  console.log(senderId);
  console.log(RecieverId);

  await firebase
    .database()
    .ref("chatList")
    .get()
    .then(async (snap) => {
      console.log(snap.val()); //chat empty
      if (snap.val() == null) {
        var roomid = await firebase.database().ref("chatList").push().getKey();
        var object = {
          senderId,
          RecieverId,
          roomid,
        };
        await firebase.database().ref("chatList").child(roomid).set(object);

        alert("room create succesfully");
        ROOMID = roomid;
      } else {
        var chatlist = Object.values(snap.val());
        console.log(chatlist);
        for (var i = 0; i < chatlist.length; i++) {
          console.log(chatlist[i]);
          if (
            (chatlist[i]["RecieverId"] == RecieverId &&
              chatlist[i]["senderId"] == senderId) ||
            (chatlist[i]["RecieverId"] == senderId &&
              chatlist[i]["senderId"] == RecieverId)
          ) {
            console.log(chatlist[i]);
            ROOMID = chatlist[i]["roomid"];
            break;
          }
        }
      }
      if (ROOMID == "") {
        var roomid = await firebase.database().ref("chatList").push().getKey();
        var object = {
          senderId,
          RecieverId,
          roomid,
        };
        await firebase.database().ref("chatList").child(roomid).set(object);
        ROOMID = roomid;
      }
    })
    .catch((e) => {
      console.log(e);
    });
  return ROOMID;
}

async function loadfunction() {
  var senderid = localStorage.getItem("userUid");
  var adminid = "gOXcAXpZhYcNvVHeEerKzKD1Dat1"; //
  var roomChat = await checkRoom(senderid, adminid); //room create
  getRoomsChat(roomChat); //get all chats
}

async function getRoomsChat(roomChat) {
  var senderid = localStorage.getItem("userUid");
  await firebase
    .database()
    .ref("chats")
    .child(roomChat)
    .get()
    .then((snap) => {
      console.log(snap.val());
      if (snap.val() == null) {
        return;
      }
      var data = Object.values(snap.val());
      for (var i = 0; i < data.length; i++) {
        console.log(data[i]);
        if (senderid == data[i]["senderId"]) {
          chats.innerHTML += `
            <div class='col col-lg-6'>
            <h3 class="send">
            <b class="chatcontainer"> ${data[i]["message"]} </b>
          </h3>


            </div>
            `;
        }
        else{
              chats.innerHTML += `
            <div class='col'>
            <h3 class="recieve">
            <b class="chatcontainer"> ${data[i]["message"]} </b>
          </h3>


            </div>
            `;
        }
      }
    })
    .catch((e) => {
      console.log(e);
    });
}
