const dropArea = document.querySelector(".drop-zone");
const fileInput = document.querySelector("#fileInput");
const browseBtn = document.querySelector(".browseBtn");

const progressContainer = document.querySelector(".progress-container");
const bgProgress = document.querySelector(".bg-progress");
const percentDiv = document.querySelector("#percent");
const progressBar = document.querySelector(".progress-bar");

const renderApi = "rnd_U7fxEBfyoBrNEQDWUE68609sc0Am";
// const host = "https://sharein-webapp.herokuapp.com/"
// const host = "http://localhost:3000/";
// const host = "https://sharein.onrender.com/";
const host = "https://share-in-web-app.vercel.app/";
// const host = "https://caring-unruly-trumpet.glitch.me/";
// const host =
//   "https://63b3cfbc8592e6206e49e627--stellar-halva-3eac79.netlify.app/";
const uploadURL = `${host}api/files`;
const emailURL = `${host}api/files/send`;

const fileURL = document.querySelector("#fileURL");
const sharingContainer = document.querySelector(".sharing-container");
const copyBtn = document.querySelector("#copyBtn");
const emailForm = document.querySelector("#emailForm");
const copyMessage = document.querySelector(".copy-message");

const maxAllowedSize = 10 * 1024 * 1024;

fileInput.addEventListener("change", () => {
  uploadFile();
});

browseBtn.addEventListener("click", (e) => {
  fileInput.click();
});

dropArea.addEventListener("dragover", (event) => {
  event.preventDefault();
  !dropArea.classList.contains("dragged") && dropArea.classList.add("dragged");
});
dropArea.addEventListener("dragleave", (event) => {
  dropArea.classList.remove("dragged");
});
dropArea.addEventListener("drop", (event) => {
  event.preventDefault();
  dropArea.classList.remove("dragged");
  const files = event.dataTransfer.files;
  if (files.length) {
    fileInput.files = files;
    uploadFile();
  }
});

copyBtn.addEventListener("click", () => {
  fileURL.select();
  document.execCommand("copy");
  copyClip("Link Copied!");
});

const resetFileInput = () => {
  fileInput.value = "";
};

const uploadFile = () => {
  if (fileInput.files.length > 1) {
    copyClip("Only Upload 1 file");
    resetFileInput();
    return;
  }
  const file = fileInput.files[0];
  if (file.size > maxAllowedSize) {
    copyClip("Can't upload more than 100MB");
    resetFileInput();
    return;
  }
  progressContainer.style.display = "block";
  const formData = new FormData();
  formData.append("myfile", file);
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      console.log(xhr.response);
      showLink(JSON.parse(xhr.response));
    }
  };
  xhr.upload.onprogress = updateProgress;
  xhr.upload.onerror = () => {
    resetFileInput();
    copyClip(`Error in Upload : ${xhr.status}`);
  };
  console.log("About to Uploading File.");
  try {
    xhr.open("POST", uploadURL);
  } catch (error) {
    console.log("Error Tracked");
  }
  // xhr.open("POST", uploadURL);
  console.log("File Uploaded.");
  xhr.send(formData);
  console.log("File got sent");
};

const updateProgress = (e) => {
  const percent = Math.round((e.loaded / e.total) * 100);
  bgProgress.style.width = `${percent}%`;
  percentDiv.innerText = percent;
  progressBar.style.transform = `scaleX(${percent / 100})`;
};

const showLink = ({ file: url }) => {
  emailForm[2].removeAttribute("disabled");
  resetFileInput();
  progressContainer.style.display = "none";
  sharingContainer.style.display = "block";
  fileURL.value = url;
};

emailForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const url = fileURL.value;
  const formData = {
    uuid: url.split("/").splice(-1, 1)[0],
    emailTo: emailForm.elements["to-email"].value,
    emailFrom: emailForm.elements["from-email"].value,
  };
  emailForm[2].setAttribute("disabled", "true");
  fetch(emailURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((res) => res.json())
    .then(({ success }) => {
      if (success) {
        sharingContainer.style.display = "none";
        copyClip("Email Sent");
      }
    });
});

let popUp;
const copyClip = (msg) => {
  copyMessage.innerText = msg;
  copyMessage.style.transform = "translate(-50%, 0)";
  clearTimeout(popUp);
  popUp = setTimeout(() => {
    copyMessage.style.transform = "translate(-50%, 60px)";
  }, 2000);
};
