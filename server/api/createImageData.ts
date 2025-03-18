import axios from 'axios'
import * as dotenv from 'dotenv'
dotenv.config();
const STRAPI_BASEURL = process.env.BASE_URL

export default defineEventHandler(async (event) => {
  try {
    const body = await  readBody(event);
    const myPayload =  {
      img_name: body.img_name,
      img_desc: body.img_desc,
      img_url: body.img_url,
      img_id: body.img_id
    };

    const result = await axios.post(`${STRAPI_BASEURL}/api/upload-image/create`, myPayload)
    if (result) {
      return result.data
    }
  } catch (err) {
    console.log(err)
  }
})
