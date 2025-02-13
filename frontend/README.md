- create frontend project:  npm create vite@latest ./
- select react and javascript
- install vite cli:  npm install -D vite
- run project: npm run dev
- install tailwindcss: npm install tailwindcss @tailwindcss/vite
- Configure the Vite plugin:
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
})
- Import Tailwind CSS: @import "tailwindcss";
- install react router dom: npm install react-router-dom
- sử dụng react router bao bọc ứng dụng
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";  // ✅ Đúng

import App from "./App";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
