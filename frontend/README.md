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

