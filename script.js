// declaração de variaveis globais
let userName = prompt("Qual o seu nome?");
let objectName = {
  name: userName,
};
let newMessage = {};
let participants = [];
let controler = 0;

// Declaração de funções
//--------------------------------------------- Log in
function logIn() {
  promise = axios.post(
    "https://mock-api.driven.com.br/api/v4/uol/participants",
    objectName
  );
  promise.then(successfulLogIn);
  promise.catch(otherNameUserToLogIn);
}
function keepconection() {
  promise = axios.post(
    "https://mock-api.driven.com.br/api/v4/uol/status",
    objectName
  );
  promise.then(successfulLogIn);
}
function successfulLogIn() {
  console.log("OK");
  getParticipants();
}
function otherNameUserToLogIn() {
  userName = prompt("Esse nome já está em uso! Por favor digite outro nome.");
  objectName = {
    name: userName,
  };
  logIn();
}

// ------------------------------------------- messages

function textarea() {
  let messageInTextArea = document.querySelector("footer textarea");
  newMessage = {
    from: userName,
    to: "Todos",
    text: messageInTextArea.value,
    type: "message",
  };
  sendMessages();
}
function includeMessages(response) {
  let infoMessage = response.data;
  let section = document.querySelector("main");
  section.innerHTML = "";
  for (let i = 0; i < infoMessage.length; i++) {
    if (infoMessage[i].type === "status") {
      section.innerHTML += `
        <div class="status">
        <small>${infoMessage[i].time}</small> <strong>${infoMessage[i].from}</strong>
        ${infoMessage[i].text}
     </div>`;
    }
    if (infoMessage[i].type === "message") {
      let section = document.querySelector("main");
      section.innerHTML += `
        <div class="message">
        <small>${infoMessage[i].time}</small> <strong>${infoMessage[i].from}</strong>
        ${infoMessage[i].text}
     </div>`;
    }
    if (
      infoMessage[i].type === "private_messages" &&
      userName === infoMessage.from
    ) {
      let section = document.querySelector("main");
      section.innerHTML += `
        <div class="private-messages">
        <small>${infoMessage[i].time}</small> <strong>${infoMessage[i].from}</strong>
        ${infoMessage[i].text}
     </div>`;
    }
  }
  let lastMessage = document.querySelector("main").lastChild;
  lastMessage.scrollIntoView();
}

function handleError(error) {
  console.log("Status code: " + error.response.status);
}
function reload() {
  window.location.reload();
}

function getMessages() {
  let promise = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
  promise.then(includeMessages);
  promise.catch(handleError);
}

function sendMessages() {
  let promise = axios.post(
    "https://mock-api.driven.com.br/api/v4/uol/messages",
    newMessage
  );
  promise.then(includeMessages);
  promise.catch(reload);
}

//------------------------------------------------- menu
function openNav() {
  let hide = document.querySelector(".background-nav");
  hide.classList.remove("hide");
  let fixed = document.querySelector("main");
  fixed.classList.add("fixed");
}
function closeNav() {
  let hide = document.querySelector(".background-nav");
  hide.classList.add("hide");
  let fixed = document.querySelector("main");
  fixed.classList.remove("fixed");
}

function getParticipants() {
  let promise = axios.get(
    "https://mock-api.driven.com.br/api/v4/uol/participants"
  );
  promise.then(printParticipants);
  promise.catch(handleError);
}
function printParticipants(response) {
  participants = response.data;
  let infos = document.querySelector(".contacts");
  // let namesIcons = document.querySelector(".names-icons");
  // let checkMarc = document.querySelector(".check-marc");
  infos.innerHTML = `
  <div class="user-infos">    
  <ion-icon name="people"></ion-icon> 
  <p>Todos</p> </div>`;
  for (let i = 0; i < participants.length; i++) {
    infos.innerHTML += `
    <div onclick="checkMarc('check${i}', 'info${i}')" class="user-infos info${i}">           
      <ion-icon name="person-circle"></ion-icon>
      <p>${participants[i].name}</p>
    </div>`;
  }
}

function checkMarc(checkElement, userElement) {
  console.log(checkElement, userElement);
  let check = document.querySelector(`.${checkElement}`);
  console.log(check);
  let userInfos = document.querySelector(`.${userElement}`);
  if (!check) {
    console.log(userInfos);
    userInfos.innerHTML += `
      <ion-icon class="${checkElement}" name="checkmark-outline"></ion-icon>`;
  } else {
    userInfos.classList.toggle("hide");
  }
}

// others
logIn();
setInterval(getMessages, 3000);
setInterval(keepconection, 5000);
setInterval(getParticipants, 10000);
