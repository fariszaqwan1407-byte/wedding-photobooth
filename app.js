const API_URL = "https://script.google.com/macros/s/AKfycbyEB4R1SM2iGm9R5EJth1Qu1SfqhysZdnJiTO93SI4RXh1T12EK95NljiwUAogcZuez/exec";

let stream;
let imageData = "";
let currentFacing = "user";

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

  if (!imageData) {
    alert("Sila capture gambar dulu");
    return;
  }

  const base64 = imageData.split(",")[1];

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain"
    },
    body: JSON.stringify({
      image: base64,
      name: name,
      message: message
    })
  });

  const data = await res.json();
  console.log(data);

  if (data.success) {
    alert("Upload berjaya 💖");
  } else {
    alert("Upload gagal");
  }
}