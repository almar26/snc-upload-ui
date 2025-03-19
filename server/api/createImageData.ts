import axios from 'axios'
const BASE_URL = process.env.BASE_URL

export default defineEventHandler(async (event) => {
  const cookies = parseCookies(event);
  const token = cookies?.token;
  try {
    const body = await  readBody(event);
    const myPayload =  {
      img_name: body.img_name,
      img_desc: body.img_desc,
      img_url: body.img_url,
      img_id: body.img_id
    };

    const result = await axios.post(`${BASE_URL}/api/upload-image/create`, myPayload, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    if (result) {
      return result.data
    }
  } catch (err) {
    console.log(err)
  }
})
