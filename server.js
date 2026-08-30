// Frequency — random stranger chat signaling server
// Node.js + Express + Socket.io
// Handles: matchmaking queue, WebRTC signaling relay, text chat relay, skip/disconnect logic.

const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

// ---- Matchmaking state ----
// waitingQueue: array of socket ids currently looking for a partner
// partners: map of socket id -> partner socket id (for active pairs)
let waitingQueue = [];
const partners = new Map();

function randomCallsign() {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `STRANGER-${num}`;
}

function randomFrequency() {
  return (87.5 + Math.random() * (108 - 87.5)).toFixed(1);
}

function removeFromQueue(socketId) {
  waitingQueue = waitingQueue.filter((id) => id !== socketId);
}

function breakPair(socketId) {
  const partnerId = partners.get(socketId);
  if (partnerId) {
    partners.delete(socketId);
    partners.delete(partnerId);
    const partnerSocket = io.sockets.sockets.get(partnerId);
    if (partnerSocket) {
      partnerSocket.emit("partner-left");
    }
  }
}

function tryMatch(socket) {
  // Remove self just in case, then look for someone else waiting
  removeFromQueue(socket.id);

  if (waitingQueue.length > 0) {
    const partnerId = waitingQueue.shift();
    const partnerSocket = io.sockets.sockets.get(partnerId);

    // Guard against stale/disconnected sockets sitting in the queue
    if (!partnerSocket || !partnerSocket.connected) {
      return tryMatch(socket);
    }

    partners.set(socket.id, partnerId);
    partners.set(partnerId, socket.id);

    const freq = randomFrequency();

    // One side is designated the WebRTC "initiator" (sends the offer)
    socket.emit("matched", {
      initiator: true,
      callsign: randomCallsign(),
      frequency: freq,
    });
    partnerSocket.emit("matched", {
      initiator: false,
      callsign: randomCallsign(),
      frequency: freq,
    });
  } else {
    waitingQueue.push(socket.id);
    socket.emit("waiting");
  }
}

io.on("connection", (socket) => {
  socket.on("find-partner", () => {
    breakPair(socket.id);
    tryMatch(socket);
  });

  socket.on("skip", () => {
    breakPair(socket.id);
    tryMatch(socket);
  });

  // Relay WebRTC signaling data (offer/answer/ICE candidates) to the current partner
  socket.on("signal", (data) => {
    const partnerId = partners.get(socket.id);
    if (partnerId) {
      io.to(partnerId).emit("signal", data);
    }
  });

  // Relay text chat messages to the current partner
  socket.on("chat-message", (text) => {
    const partnerId = partners.get(socket.id);
    if (partnerId) {
      io.to(partnerId).emit("chat-message", {
        text: String(text).slice(0, 1000),
        at: Date.now(),
      });
    }
  });

  socket.on("typing", (isTyping) => {
    const partnerId = partners.get(socket.id);
    if (partnerId) {
      io.to(partnerId).emit("typing", isTyping);
    }
  });

  socket.on("disconnect", () => {
    removeFromQueue(socket.id);
    breakPair(socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Frequency signaling server running on port ${PORT}`);
});
