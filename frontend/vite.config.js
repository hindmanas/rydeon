import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';
import path from 'path';

// Helper to safely copy files
const copyIfExists = (src, dest) => {
  try {
    if (fs.existsSync(src)) {
      const destDir = path.dirname(dest);
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      fs.copyFileSync(src, dest);
      console.log(`Copied ${path.basename(src)} -> ${dest}`);
    }
  } catch (err) {
    console.error('Copy note:', err.message);
  }
};

const brainDir = 'C:/Users/ASUS/.gemini/antigravity-ide/brain/f4779113-ecbc-4f04-af8c-fa186fc810a7';
const logoSource = `${brainDir}/.user_uploaded/media_1788810739202.jpg`;

copyIfExists(logoSource, path.resolve(__dirname, 'public/logo.png'));
copyIfExists(logoSource, path.resolve(__dirname, 'public/favicon.png'));
copyIfExists(logoSource, path.resolve(__dirname, 'public/favicon.ico'));
copyIfExists(logoSource, path.resolve(__dirname, 'src/assets/logo.png'));

// Copy generated photos
copyIfExists(`${brainDir}/student_driver_1788811307441.jpg`, path.resolve(__dirname, 'src/assets/student_driver.jpg'));
copyIfExists(`${brainDir}/campus_students_waiting_1788811357072.jpg`, path.resolve(__dirname, 'src/assets/campus_students_waiting.jpg'));
copyIfExists(`${brainDir}/student_carpool_chat_1788811403578.jpg`, path.resolve(__dirname, 'src/assets/student_carpool_chat.jpg'));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
});
