import { defineStore } from "pinia";
import axios from "axios";

interface UserPayloadInterface {
  identifier: string;
  password: string;
}

export const useMyAuthStore = defineStore("myAuthStore", {
  state: () => ({
    authenticated: false,
    loading: false,
    userInfo: {},
    errorLogin: false,
    errorMessage: "",
  }),
  actions: {
    // Login Function
    async authenticateUser({ identifier, password }: UserPayloadInterface) {
      const baseUrl = useRuntimeConfig().public.baseURL;
      const { data, pending, error }: any = await useFetch(
        `${baseUrl}/api/auth/local`,
        {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: {
            identifier,
            password,
          },
        }
      );
      this.loading = pending;

      if (data.value) {
        localStorage.setItem("user-info", JSON.stringify(data.value)); // set user-info data to local storage
        const token = useCookie("token"); // useCookie new hook in nuxt 3
        token.value = data?.value?.jwt; // set token to cookie
        this.authenticated = true; // set authenticated state value to true
        this.errorLogin = false; // set errorLogin state value to false
      } else {
        this.errorLogin = true; // set errorLogin state value to true
        this.errorMessage = error.value.data.error.message;
        //this.errorMessage = "Invalid username or password";
  
      }
    },

    // Logout function
    logUserOut() {
      const token = useCookie('token'); // useCookie new hook in nuxt 3
      token.value = null; // clear the token cookie
      this.authenticated = false; // set authenticated state value to false
      this.userInfo = {}; // set the userinfo state value to empty
      localStorage.removeItem("user-info"); // remove the user-info data to local storage
    }
  },
});
