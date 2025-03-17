<template>
  <v-app>
    <v-app-bar prominent scroll-behavior="elevate">
      <v-app-bar-nav-icon
        variant="text"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-toolbar-title>SNC Upload Files</v-toolbar-title>
      <v-spacer></v-spacer>
     
      <div class="mr-2">
        <v-menu min-width="200px" rounded>
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props" variant="tonal">
              <v-avatar color="#66BB6A" size="large">
                <v-icon icon="mdi-account-circle" color="white"></v-icon>
              </v-avatar>
            </v-btn>
          </template>
          <v-card>
            <v-card-text>
              <div class="mx-auto text-center">
                <v-avatar color="green">
                  <v-icon icon="mdi-account-circle"></v-icon>
                </v-avatar>
                <h4 class="mt-2">{{ userData.username }}</h4>
                <p class="text-caption mt-1">{{ userData.email }}</p>
                <v-divider class="my-3"></v-divider>
                
                <v-btn
                  prepend-icon="mdi-logout"
                  variant="text"
                  class="text-capitalize"
                  rounded
                  @click="logout()"
                
                >
                  Logout
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-menu>
      </div>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useMyAuthStore } from "~/stores/auth";

const router = useRouter();
const { logUserOut } = useMyAuthStore();
const { userInfo } = storeToRefs(useMyAuthStore());
const userData = ref(userInfo?.value.user);

const logout = () => {
  logUserOut();
  router.push("/auth/signin");
};

</script>

<style>

</style>