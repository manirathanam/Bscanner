<template>
  <div class="q-pa-md">
    <q-form @submit.prevent="onSubmit">
      <q-input v-model="formData.Company" label="Company Name" required />
      <q-input v-model="formData.name" label="Name" required />
      <q-input v-model="formData.email" label="Email" type="email" required />
      <q-input v-model="formData.phone" label="Phone Number" mask="(+###) ###-####" />
      <q-input v-model="formData.website" label="Website" type="url" />
      <q-input v-model="formData.address" label="Address" multi-line />
      <div v-if="hasError" class="text-red">
        {{ errorMessage }}
      </div>
      <div class="">
        <q-btn type="submit" color="primary" label="Submit" class="q-ma-md" />
        <q-btn type="button" color="primary" label="Scan and Fill" class="q-ma-md" @click="selectFile" />
        <input type="file" id="fileInput" accept="image/*" capture="camera" :ref="fileInput" @change="handleFileChange">
      </div>

    </q-form>

    <!-- <q-dialog v-model="showDialog" :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down">
    <q-card>
        <q-bar>
          <q-space />

          <q-btn dense flat icon="minimize" @click="maximizedToggle = false" :disable="!maximizedToggle">
            <q-tooltip v-if="maximizedToggle" class="bg-white text-primary">Minimize</q-tooltip>
          </q-btn>
          <q-btn dense flat icon="crop_square" @click="maximizedToggle = true" :disable="maximizedToggle">
            <q-tooltip v-if="!maximizedToggle" class="bg-white text-primary">Maximize</q-tooltip>
          </q-btn>
          <q-btn dense flat icon="close" @click="closeDialog">
            <q-tooltip class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>
      <q-card-section>
        <h2 class="text-h5">Your Dialog Title</h2>
        <video id="video"></video>
<canvas id="canvas"></canvas>
<button id="capture-button" >Capture Image</button>
<input type="file" accept="image/*" capture="camera">

      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Close" @click="closeDialog" />
      </q-card-actions>
    </q-card>
  </q-dialog> -->
  </div>
</template>
<script setup>

import { nextTick, onMounted, ref } from "vue";
import { collection, addDoc } from "firebase/firestore";
import { db, storage } from "../firebase.js"; // Assuming your Firebase configuration is in a file named firebase.js
import { getStorage, ref as Fref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import axios from "axios";

console.log(axios);


let canvas$ = ref(null);
let video$ = ref(null);
let captureButton$ = ref(null);

let fileInput = ref("");

function handleFileChange(event) {
  const file = event.target.files[0];
  uploadFile(file);
}

function uploadFile(file) {
  const metadata = {
    contentType: 'image/png'
  };
  const storageRef = Fref(storage, 'images/' + file.name);
  const uploadTask = uploadBytesResumable(storageRef, file, metadata);

  uploadTask.on('state_changed',
    (snapshot) => {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case 'paused':
          console.log('Upload is paused');
          break;
        case 'running':
          console.log('Upload is running');
          break;
      }
    },
    (error) => {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          break;
        case 'storage/canceled':
          // User canceled the upload
          break;

        // ...

        case 'storage/unknown':
          // Unknown error occurred, inspect error.serverResponse
          break;
      }
    },
    () => {
      // Upload completed successfully, now we can get the download URL
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        let data = JSON.stringify({
          "file_url": downloadURL,
          "auto_delete": true
        });
        let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: 'https://api.veryfi.com/api/v7/partner/business-cards',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'CLIENT-ID': 'vrflxCklR18OjbvrDosMhmiE4cVD1ZajWSYx7V6',
            'AUTHORIZATION': 'apikey macjackbro.verify:09930046fb0c8a81d21825dbff98b6b7',
          },
          data: data,
        }


        axios(config).then((response) => {
          console.log(JSON.stringify(response.data));
        })
          .catch((error) => {
            console.log(error);

            console.log('File available at', downloadURL);
          });
      }
      );
    })
  }

  function selectFile() {
    let ele = document.getElementById("fileInput")
    ele.click();
  }


  let formData = ref({
    Company: "",
    name: "",
    email: "",
    phone: "",
    website: "",
    address: "",
  });

  let hasError = ref(false);
  let errorMessage = ref("");
  let showDialog = ref(false);


  async function onSubmit() {
    hasError.value = false;
    errorMessage.value = "";

    // Add your form submission logic here
    // For example, sending data to an API
    console.log("Submitted data:", formData.value);

    try {
      // Add data to Firestore collection
      const docRef = await addDoc(collection(db, "contacts"), formData.value);
      console.log("Document written with ID:", docRef.id);

      // You can reset the form after successful submission
      formData.value = {
        Company: "",
        name: "",
        email: "",
        phone: "",
        website: "",
        address: "",
      };
    } catch (error) {
      console.error("Error adding document:", error);
      hasError.value = true;
      errorMessage.value = "An error occurred while submitting the form.";
    }


  }

  function openDialog() {
    showDialog.value = true;
    nextTick(() => {
      handleCapture();
    })
  }

  function closeDialog() {
    showDialog.value = false;
  }

  function openCamera() {

  }

  async function handleCapture() {
    try {
      const video = document.getElementById('video');
      const canvas = document.getElementById('canvas');
      const captureButton = document.getElementById('capture-button');
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;

      captureButton.disabled = true; // Disable button to prevent multiple clicks

      const context = canvas.getContext('2d');

      captureButton.addEventListener('click', () => {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg'); // Change format if needed

        // Do something with the image data (e.g., display in an image tag)
        console.log(imageData);

        stream.getTracks().forEach(track => track.stop());
      });
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  }

  onMounted(() => {

  })
</script>