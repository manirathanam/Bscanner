<template>
    <div class="q-pa-md">
        <q-table
    :rows="tableData"
    :columns="tableColumns"
    row-key="id"
  >
    <template #body-cell="props">
      <q-td :props="props">
        {{ props.row[props.col.name] }}
      </q-td>
    </template>
  </q-table>
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