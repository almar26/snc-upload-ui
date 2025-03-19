<template>
  <div>
    <v-app>
      <v-app-bar prominent>
        <v-btn @click="$router.back()" icon="mdi-arrow-left" variant="text">
        </v-btn>





        <v-spacer></v-spacer>
        <div class="mr-5 text-uppercase">
          {{ imageDetails.name }}
        </div>
        <v-spacer></v-spacer>
        <v-avatar class="mr-5" size="50">
          <v-img alt="SNC Logo" src="/SNC-Logo.png"></v-img>
        </v-avatar>
      </v-app-bar>
      <v-main>
        <v-container fluid>
          <div v-if="isEmpty" class="d-flex align-center justify-center" style="height: 80vh;">
            <v-empty-state icon="mdi-magnify"
              text="Try adjusting your search terms or filters. Sometimes less specific terms or broader queries can help you find what you're looking for."
              title="We couldn't find a match."></v-empty-state>
          </div>
          <div v-else class="d-flex align-center justify-center" style="height: 88vh;">
            <v-img :src="baseUrl + imageDetails.image_url"></v-img>
          </div>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>

<script setup>
import { useTheme } from 'vuetify';
const theme = useTheme();
const route = useRoute();
const router = useRouter()
const config = useRuntimeConfig();

definePageMeta({
  layout: "blank",
});


const imageDetails = ref([]);
const baseUrl = config.public.baseURL
const isDark = ref(false);
const isEmpty = ref(false);
theme.global.name.value = 'dark'

async function initialize() {
  try {
    let result = await $fetch(`/api/upload-image/${route.params.id}`);

    if (result) {
      if (result.length == 0) {
        isEmpty.value = true;
      } else {
        console.log(result);
        imageDetails.value = result[0]
      }

    }

  } catch (err) {
    console.error("Failed to fetch data: ", err)
    throw err;
  }
}


onMounted(async () => {
  await initialize()
})

onUnmounted(() => {
  theme.global.name.value = 'light'
})

</script>

<style></style>