<template>
  <div class="d-flex align-center justify-center">
    <v-card elevation="1">
      <v-card-text>
        <v-file-upload density="comfortable" v-model="avatarImage" accept="image/png, image/jpeg, image/bmp"
          @change="onFileChange" clearable browse-text="Browse Files" divider-text="or choose locally" icon="mdi-upload"
          title="Drag and Drop Here">
        </v-file-upload>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" variant="tonal" size="large" :disabled="loading" :loading="loading"  @click="onSubmit" block prepend-icon="mdi-cloud-upload">upload</v-btn>
      </v-card-actions>

    </v-card>


  </div>
</template>

<script setup>
import { useUtils } from "~/composables/useUtils";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
const { uploadImage } = useUtils();
const avatarImage = ref(null);
const publicID = ref("");
const newImageName = ref(null);
const loading = ref(false);
const uploadResult = ref(null);

async function onFileChange(event) {
  if (event.target.files.length == 0) {
    console.log("Cancel Upload");
  } else {
    const image = event.target.files[0];
    const originalName = event.target.files[0].name;
    const ext = originalName.split(".").pop();
    const blob = image.slice(0, image.size);
    publicID.value = uuidv4();
    newImageName.value = new File([blob], `${publicID.value}.${ext}`, { type: `${image.type}` });

    console.log(newImageName.value)
  }
}

async function onSubmit() {
  loading.value = true;
  if(newImageName.value) {
    try {
      uploadResult.value = await uploadImage(newImageName.value)
      if (uploadResult.value) {
        const newUploadedImg = uploadResult.value[0].url
        console.log("Result: ", uploadResult.value)
        console.log("Uploaded Image: ", newUploadedImg);
        loading.value = false
      }
      
    } catch (error) {
      console.error(error);
      loading.value = false;
    }
  }
}
</script>

<style></style>