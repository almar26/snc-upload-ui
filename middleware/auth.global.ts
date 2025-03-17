export default defineNuxtRouteMiddleware((to, from) => {
  const { authenticated } = storeToRefs(useMyAuthStore());
  const { userInfo } = storeToRefs(useMyAuthStore());
  const token = useCookie("token");

  const user_info = JSON.parse(localStorage.getItem("user-info"));


  if (token.value) {
    // check if value exists
    authenticated.value = true; // update the state to authenticated
    userInfo.value = user_info; // update the userInfo state
    
  } 

  // if token exist and layout is auth, redirect to homepage
  if (token.value && to?.name === "auth-signin") {
    return navigateTo('/')
  }

  // if token doesn't exist redirect to login page
  if (!token.value && to?.name !== "auth-signin") {
    abortNavigation();
    return navigateTo("/auth/signin")
  }


});
