<template>
  <div>
    <v-row dense>
      <v-col cols="12" md="4">
        <div class="d-flex justify-center">
          <v-card elevation="0" width="550">
            <v-card-text>
              <v-file-upload @click:clear="clearImg" density="comfortable" v-model="avatarImage"
                accept="image/png, image/jpeg, image/bmp" @change="onFileChange" clearable browse-text="Browse Files"
                divider-text="or choose locally" icon="mdi-upload" title="Drag and Drop Here">
                <!-- <v-file-input clearable v-model="file"></v-file-input> -->
              </v-file-upload>
              <v-form v-model="valid" ref="uploadForm" class="mt-2" lazy-validation>
                <v-text-field v-model="img_name" :rules="rules.name" label="Name"></v-text-field>
                <v-textarea rows="2" v-model="img_desc" :rules="rules.desc" label="Description"></v-textarea>
              </v-form>
            </v-card-text>
            <v-card-actions class="mx-4 mb-4">
              <v-btn color="primary" variant="tonal" size="large" :disabled="disabledBtn" :loading="loading"
                @click="onSubmit" block prepend-icon="mdi-cloud-upload">upload</v-btn>

            </v-card-actions>
          </v-card>
        </div>

      </v-col>
      <v-col cols="12" md="8">
        <v-card elevation="0">
          <v-card-text>
          <div class="d-flex align-center justify-center" style="height: 30vh;" v-if="loader">
              <VueSpinnerIos size="50"/>
          </div>
            <v-row v-else>
              <v-col cols="12" md="2" v-for="(item, i) in imageData" :key="i">
                <v-hover v-slot="{ isHovering, props }">
                  <v-card color="grey-lighten-4"  class="mx-auto" max-width="344" elevation="0" v-bind="props">
                    <v-img height="200px" :src="baseUrl + item.image_url">

                      <v-expand-transition>
                        <div v-if="isHovering" class="d-flex bg-orange-darken-2 v-card--reveal text-h6"
                          style="height: 100%;">
                          <v-btn variant="flat" icon :to="`/view/${item.documentId}`"> <v-icon>mdi-open-in-new</v-icon></v-btn>
                        </div>
                      </v-expand-transition>
                    </v-img>
                    <!-- <v-card-title>
                      {{ item.name }}
                    </v-card-title> -->
                    <v-divider ></v-divider>
                    <v-card-subtitle class="my-2 text-black text-center text-uppercase font-weight-bold">
                      {{ item.name }}
                    </v-card-subtitle>

                    <!-- <v-card-text class="pt-2">
                      <div class="font-weight-light text-orange">
                        {{ item.name }}
                      </div>



                      <div class="font-weight-light mb-2">
                        {{ item.description }}
                      </div>
                    </v-card-text> -->
                  </v-card>
                </v-hover>
              </v-col>
            </v-row>

          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- SNACKBAR -->
    <v-snackbar
      v-model="snackbar"
      :timeout="3000"
      location="top right"
    >
      {{ snackbarText }}

      <template v-slot:actions>
        <v-btn
          :color="snackbarColor"
          variant="text"
          @click="snackbar = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>




  </div>
</template>

<script setup>
import { useUtils } from "~/composables/useUtils";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
const { uploadImage } = useUtils();
const config = useRuntimeConfig();

const loader = ref(true);
const avatarImage = ref(null);
const valid = ref(true)
const publicID = ref("");
const newImageName = ref(null);
const loading = ref(false);
const uploadResult = ref(null);
const uploadDialog = ref(false);
const disabledBtn = ref(true)
const img_name = ref("");
const img_desc = ref("");
const uploadForm = ref(null)
const imageData = ref([]);
const baseUrl = config.public.baseURL
const snackbar = ref(false)
const snackbarText = ref("");
const snackbarColor = ref("")

const rules = ref({
  name:[(v) => !!v || "Name is required"]
})

async function onFileChange(event) {
  console.log("Image update")
  if (event.target.files.length == 0) {
    console.log("Cancel Upload");
    disabledBtn.value = false
  } else {
    disabledBtn.value = false
    const image = event.target.files[0];
    const originalName = event.target.files[0].name;
    const ext = originalName.split(".").pop();
    const blob = image.slice(0, image.size);
    publicID.value = uuidv4();
    newImageName.value = new File([blob], `${publicID.value}.${ext}`, { type: `${image.type}` });

    console.log(newImageName.value)
  }
}

// Upload image
async function onSubmit() {
  const { valid, errors } = await uploadForm.value?.validate();
  loading.value = true;
  if (valid) {
    if (newImageName.value) {
      try {
        uploadResult.value = await uploadImage(newImageName.value)
        if (uploadResult.value) {
          const newUploadedImg = uploadResult.value[0].url
          console.log("Result: ", uploadResult.value)
          console.log("Uploaded Image: ", newUploadedImg);
        }
        const payload = {
          img_name: img_name.value,
          img_desc: img_desc.value,
          img_url: uploadResult.value[0].url,
          img_id: uploadResult.value[0].id
        }

        await $fetch("/api/createImageData", {
          method: "POST",
          body: payload
        }).then(response => {
          loading.value = false
          disabledBtn.value = true
          avatarImage.value = null
          snackbar.value = true;
          snackbarText.value = response.message;
          snackbarColor.value = "green"
          getImageInfo();
          uploadForm.value?.reset()
          console.log("Response: ", response)
        })


        console.log(payload);

      } catch (error) {
        console.error(error);
        loading.value = false;
      }
    }
  } else {
    loading.value = false;
    console.log(errors[0].errorMessages[0])
  }

}

// Fetch Image Info
async function getImageInfo() {
  try {
    let result = await $fetch("/api/getImageData");
    if (result) {
      imageData.value = result.data;
      loader.value = false;
    }
  } catch (err) {
    console.error("Failed to fetch data: ", err);
    throw err;
  }
}

async function clearImg() {
  console.log("Image cleared")
  avatarImage.value = null
  // file.value = null
}

onMounted(async () => {
  await getImageInfo();
})
</script>

<style>
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: .9;
  position: absolute;
  width: 100%;
}
</style>