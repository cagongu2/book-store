- create frontend project: ` npm create vite@latest ./`
- select react and javascript
- install vite cli: ` npm install -D vite`
- run project:` npm run dev`
- install tailwindcss: `npm install tailwindcss @tailwindcss/vite`
- Configure the Vite plugin:
``import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
})``
- Import Tailwind CSS: `@import "tailwindcss"`;
- install react router dom: `npm install react-router-dom`
- install react-icons: `npm install react-icons --save`
- install proptypes: `npm install prop-types`
- install swiper: `npm install swiper`
- install react-hook-form: `npm install react-hook-form`
- install redux toolkit: `npm install @reduxjs/toolkit react-redux` {quản lý trạng thái phổ biến trong các ứng dụng JavaScript, đặc biệt là React. Nó giúp quản lý dữ liệu của ứng dụng một cách nhất quán, dễ kiểm soát và dễ mở rộng. }
- install sweetalert2: `npm install sweetalert2`
- install firebase: `npm install firebase `{cần tạo một file firebase.config.js trong dự án để cấu hình. thông tin cấu hình sẽ xuất hiện khi bạn taọ dự án firebase mới.}
- install firebase-tools: `npm install -g firebase-tools`
- install axios: `npm install axios`
- install `npm i react-chartjs-2`