const API_URL = "https://script.google.com/macros/s/AKfycbyEB4R1SM2iGm9R5EJth1Qu1SfqhysZdnJiTO93SI4RXh1T12EK95NljiwUAogcZuez/exec";

let stream;
let currentFacing = "user";
let imageData = "";

async function startCamera() {
  stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: currentFacing }
  });
  document.getElementById("video").srcObject = stream;
}

startCamera();

function switchCamera() {
  currentFacing = currentFacing === "user" ? "environment" : "user";
  stream.getTracks().forEach(t => t.stop());
  startCamera();
}

function capture() {
  const video = document.getElementById("video");
  const canvas = document.getElementById("canvas");

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0);

  imageData = canvas.toDataURL("image/jpeg");

  document.getElementById("preview").src = imageData;
}

async function upload() {
  const name = document.getElementById("name").value;
  const message = document.getElementById("message").value;

  const base64 = imageData.split(",")[1];

  await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      image: base64,
      name: name,
      message: message,
      frame: "gold"
    })
  });

  alert("Uploaded 💖");
}