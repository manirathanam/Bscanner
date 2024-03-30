<template>
    <q-page class="flex q-pa-xl">
        <q-card class="my-card" :style="{ width: '100%', height: 'fit-content' }">
            <q-card-section class="q-pa-xl">
                <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md q-pa-xl">
                    <q-input filled v-model="name" label="name" hint="Enter User name" lazy-rules
                        :rules="[val => val && val.length > 0 || 'Please type something']" />
                    <q-input filled v-model="password" label="Password" hint="Enter Password" lazy-rules
                        :rules="[val => val && val.length > 0 || 'Please type something']" />
                    <div>
                        <q-btn label="Login" type="submit" color="primary" />
                        <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
                    </div>
                </q-form>
            </q-card-section>
        </q-card>
    </q-page>
</template>
<script setup>
import { ref } from "vue";
import { auth } from "../firebase.js";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter} from "vue-router";


let name = ref(null);
let password = ref(null);
const router = useRouter();

function onSubmit() {
    signInWithEmailAndPassword(auth, name.value, password.value).then((res) => { 
        router.push("/home");
     }).catch((rej) => { console.log(rej) })
}

function onReset(e) {
    console.log(e);
}
</script>