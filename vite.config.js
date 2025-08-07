import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react'; // <-- това ти липсва
import svgr from 'vite-plugin-svgr';

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  console.log('Loaded env:', env);
  return defineConfig({
    plugins: [
      react(),   // <-- добавен тук
      svgr()     // <-- и SVGR за SVG поддръжка
    ],
  });
};
