import axios from 'axios';

function createBaseUrl(baseURL, options) {
  return axios.create(Object.assign({ baseURL: baseURL }), options);
}

console.log(import.meta.env.VITE_API_BASE_URL);

// export const canvasesUrl = createBaseUrl(
//   'https://json-server-vercel-roan-seven.vercel.app/canvases',
// );
export const canvasesUrl = createBaseUrl(
  `${import.meta.env.VITE_API_BASE_URL}/canvases/`,
);
