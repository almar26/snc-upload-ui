<template>
  <div class="d-flex align-center justify-center px-10" style="height: 100vh">
    <v-card width="400" color="transparent" elevation="0">
      <v-img src="\SNC-Logo.png" max-height="100" class="mb-5" contain></v-img>
      <div class="login-text">Sign In</div>
      <v-form class="mx-10 mt-4 mb-10" ref="loginForm" v-model="valid" lazy-validation @submit.prevent="login">

        <!-- <div class="text-subtitle-1 text-medium-emphasis">Username</div> -->
        <v-text-field placeholder="Enter your username" prepend-inner-icon="mdi-account-outline"
          v-model="user.identifier" density="default" :rules="usernameRules" variant="outlined"></v-text-field>

        <!-- <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
          Password
        </div> -->
        <v-text-field :append-inner-icon="visible ? 'mdi-eye' : 'mdi-eye-off'" :type="visible ? 'text' : 'password'"
          placeholder="Enter your password" prepend-inner-icon="mdi-lock-outline" variant="outlined"
          v-model="user.password" density="default" :rules="passwordRules" @click:append-inner="visible = !visible"></v-text-field>

        <v-btn :loading="loading" class="mb-8 mt-4 font-weight-bold" color="primary" variant="tonal" block
          type="submit">
          Log In
        </v-btn>
      </v-form>
    </v-card>

    <v-snackbar v-model="snackbar" location="top" color="red" variant="tonal">
      {{ text }}

      <template v-slot:actions>
        <v-btn variant="icon" @click="snackbar = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useMyAuthStore } from "~/stores/auth";
definePageMeta({
  layout: "auth",
});
useHead({
  title: "Log In",
});

const router = useRouter();
const { authenticateUser } = useMyAuthStore(); // use authenticateUser action from auth store
const { authenticated } = storeToRefs(useMyAuthStore()); // make authenticated state reactive with storeToRefs
const { userInfo } = storeToRefs(useMyAuthStore()); // make userInfo state reactive
const { errorLogin } = storeToRefs(useMyAuthStore()); // make errorLogin state reactive
const { errorMessage } = storeToRefs(useMyAuthStore()); // make errorMessage state reactive

const valid = ref(true);
const loading = ref(false);
const showPass = ref(false);
const visible = ref(false);
const user = ref({
  identifier: "",
  password: "",
});
const loginForm = ref(null);
const usernameRules = [
  (v) => !!v || "Username is required",
  // (v) => /.+@.+\..+/.test(v) || "E-mail must be valid"
];
const passwordRules = [(v) => !!v || "Password is required"];
const snackbar = ref(false);
const text = ref("");

async function login() {
  const { valid, errors } = await loginForm.value?.validate();
  loading.value = true;

  if (valid) {
    await authenticateUser(user.value); // call authenticateUser and pass the user object
    if (authenticated.value == true) {
      //console.log("authenticate: ", authenticated.value)
      loading.value = false;
      // Navigate to admin pagee
      router.push("/");
    }
    if (errorLogin.value == true) {
      loading.value = false;
      snackbar.value = true;
      if (errorMessage.value == "") {
        text.value = errorMessage.value;
      } else {
        text.value = errorMessage.value;
      }
    }
  } else {
    loading.value = false;
  }
}
</script>

<style scoped>
.login-text {
  font-size: 22px;
  text-align: center;
  font-weight: bold;
}
</style>