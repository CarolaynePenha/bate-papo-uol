// declaração de variaveis globais
let userName = prompt("Qual o seu nome?");
let objectName = {
  name: userName,
};
let newMessage = {};

// declaração de funções
// Log in
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
  promise = axios.get("https://mock-api.driven.com.br/api/v4/uol/participants");
}
function otherNameUserToLogIn() {
  userName = prompt("Esse nome já está em uso! Por favor digite outro nome.");
  objectName = {
    name: userName,
  };
  logIn();
}

// ------------------------------------------- messages

function textarea(event) {
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

// others
logIn();
setInterval(getMessages, 3000);
setInterval(keepconection, 5000);
