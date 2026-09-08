import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const brainDir = 'C:/Users/ASUS/.gemini/antigravity-ide/brain/f4779113-ecbc-4f04-af8c-fa186fc810a7';
const logoSource = `${brainDir}/.user_uploaded/media_1788810739202.jpg`;

const copy = (src, dest) => {
  try {
    if (fs.existsSync(src)) {
      const dir = path.dirname(dest);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.copyFileSync(src, dest);
      console.log('Copied:', src, '->', dest);
    }
  } catch (e) {
    console.error(e);
  }
};

copy(logoSource, path.resolve(__dirname, 'public/logo.png'));
copy(logoSource, path.resolve(__dirname, 'public/favicon.png'));
copy(logoSource, path.resolve(__dirname, 'public/favicon.ico'));
copy(logoSource, path.resolve(__dirname, 'src/assets/logo.png'));

copy(`${brainDir}/student_driver_1788811307441.jpg`, path.resolve(__dirname, 'src/assets/student_driver.jpg'));
copy(`${brainDir}/campus_students_waiting_1788811357072.jpg`, path.resolve(__dirname, 'src/assets/campus_students_waiting.jpg'));
copy(`${brainDir}/student_carpool_chat_1788811403578.jpg`, path.resolve(__dirname, 'src/assets/student_carpool_chat.jpg'));
