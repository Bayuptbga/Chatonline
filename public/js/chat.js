// Frequency — client logic: media capture, WebRTC peer connection, text chat, matchmaking UI

const socket = io();

const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");
const remoteTag = document.getElementById("remoteTag");
const statusText = document.getElementById("statusText");
const freqText = document.getElementById("freqText");
const skipBtn = document.getElementById("skipBtn");
const chatLog = document.getElementById("chatLog");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");
const typingIndicator = document.getElementById("typingIndicator");

let localStream = null;
let pc = null;
let currentPartnerCallsign = "";
let typingTimeout = null;

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    // For production, add a TURN server here too — many users are behind
    // NATs/firewalls that STUN alone can't traverse. Example:
    // { urls: "turn:your-turn-server:3478", username: "user", credential: "pass" }
  ],
};

function addSystemMessage(text) {
  const el = document.createElement("div");
  el.className = "msg system";
  el.textContent = text;
  chatLog.appendChild(el);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function addChatMessage(text, who) {
  const el = document.createElement("div");
  el.className = `msg ${who}`;
  el.textContent = text;
  chatLog.appendChild(el);
  chatLog.scrollTop = chatLog.scrollHeight;
}

async function initMedia() {
  try {
    localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    localVideo.srcObject = localStream;
  } catch (err) {
    addSystemMessage("Tidak bisa mengakses kamera/mic. Kamu tetap bisa chat teks.");
    localStream = new MediaStream(); // empty stream fallback
  }
}

function createPeerConnection(initiator) {
  pc = new RTCPeerConnection(ICE_SERVERS);

  localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

  pc.ontrack = (event) => {
    remoteVideo.srcObject = event.streams[0];
  };

  pc.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("signal", { type: "ice", candidate: event.candidate });
    }
  };

  pc.onconnectionstatechange = () => {
    if (pc.connectionState === "connected") {
      statusText.textContent = "Terhubung";
    }
  };

  if (initiator) {
    pc.onnegotiationneeded = async () => {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit("signal", { type: "offer", sdp: pc.localDescription });
    };
  }
}

async function handleSignal(data) {
  if (!pc) return;
  if (data.type === "offer") {
    await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    socket.emit("signal", { type: "answer", sdp: pc.localDescription });
  } else if (data.type === "answer") {
    await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
  } else if (data.type === "ice") {
    try {
      await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
    } catch (e) {
      /* benign if candidate arrives after close */
    }
  }
}

function teardownPeer() {
  if (pc) {
    pc.close();
    pc = null;
  }
  remoteVideo.srcObject = null;
}

function findPartner() {
  statusText.textContent = "Mencari lawan bicara…";
  freqText.textContent = "";
  remoteTag.textContent = "menunggu…";
  chatLog.innerHTML = "";
  addSystemMessage("Mencari kanal acak…");
  teardownPeer();
  socket.emit("find-partner");
}

socket.on("waiting", () => {
  statusText.textContent = "Menunggu lawan bicara…";
});

socket.on("matched", ({ initiator, callsign, frequency }) => {
  currentPartnerCallsign = callsign;
  statusText.textContent = "Terhubung ke";
  freqText.textContent = `${frequency} MHz`;
  remoteTag.textContent = callsign;
  addSystemMessage(`Tersambung dengan ${callsign} di ${frequency} MHz`);
  createPeerConnection(initiator);
});

socket.on("signal", (data) => {
  handleSignal(data);
});

socket.on("chat-message", ({ text }) => {
  addChatMessage(text, "them");
});

socket.on("typing", (isTyping) => {
  typingIndicator.textContent = isTyping ? `${currentPartnerCallsign} sedang mengetik…` : "";
});

socket.on("partner-left", () => {
  addSystemMessage("Lawan bicara memutuskan koneksi. Mencari kanal baru…");
  teardownPeer();
  statusText.textContent = "Terputus — mencari ulang…";
  freqText.textContent = "";
  remoteTag.textContent = "menunggu…";
  socket.emit("find-partner");
});

skipBtn.addEventListener("click", () => {
  addSystemMessage("Mengganti kanal…");
  teardownPeer();
  socket.emit("skip");
  statusText.textContent = "Mencari lawan bicara…";
  freqText.textContent = "";
  remoteTag.textContent = "menunggu…";
});

function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;
  socket.emit("chat-message", text);
  addChatMessage(text, "me");
  chatInput.value = "";
  socket.emit("typing", false);
}

sendBtn.addEventListener("click", sendMessage);
chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
  else {
    socket.emit("typing", true);
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => socket.emit("typing", false), 1200);
  }
});

(async function start() {
  await initMedia();
  findPartner();
})();
