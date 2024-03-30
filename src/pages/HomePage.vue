<template>
    <div class="flex justify-center items-center ">
        <h3>B Scanner</h3>
    </div>
</template>
<script setup>

import { ref} from "vue";
import { db } from "../firebase.js";
import { collection, getDocs } from "firebase/firestore"; 

let tableColumns =  [
        { name: 'Company', label: 'Company Name', align: 'left' },
        { name: 'name', label: 'Name', align: 'left' },
        { name: 'email', label: 'Email', align: 'left' },
        { name: 'phone', label: 'Phone Number', align: 'left' },
        { name: 'website', label: 'Website', align: 'left' },
        { name: 'address', label: 'Address', align: 'left' },
      ];
let tableData  =ref([]);

async function  fetchData(){
    let userData = [];
    const querySnapshot = await getDocs(collection(db, "contacts"));
    querySnapshot.forEach((doc) => {
        userData.push(doc.data());
    });
    tableData.value = userData;
}

fetchData();
</script>