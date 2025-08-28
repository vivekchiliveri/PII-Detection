
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MODEL_CONFIG = {
  name: 'piiranha-v1-detect-personal-information',
  baseUrl: 'https://huggingface.co/iiiorg/piiranha-v1-detect-personal-information/resolve/main',
  localPath: path.join(__dirname, '..', 'public', 'models', 'piiranha'),
  files: [
    'config.json',
    'tokenizer.json', 
    'tokenizer_config.json',
    'special_tokens_map.json'
  ]
};

function downloadFile(url, localPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(localPath);
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve(localPath);
        });
      } else if (response.statusCode === 302 || response.statusCode === 301) {
        downloadFile(response.headers.location, localPath)
          .then(resolve)
          .catch(reject);
      } else {
        reject(new Error(`HTTP ${response.statusCode}`));
      }
    }).on('error', reject);
  });
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

async function downloadModel() {
  console.log('🚀 Downloading Piiranha v1 Model...');
  
  ensureDir(MODEL_CONFIG.localPath);
  
  for (const file of MODEL_CONFIG.files) {
    const url = `${MODEL_CONFIG.baseUrl}/${file}`;
    const localPath = path.join(MODEL_CONFIG.localPath, file);

    try {
      if (fs.existsSync(localPath)) {
        console.log(`⏭️  Skipping ${file} (already exists)`);
        continue;
      }

      console.log(`📥 Downloading ${file}...`);
      await downloadFile(url, localPath);
      console.log(`✅ Downloaded ${file}`);
      
    } catch (error) {
      console.error(`❌ Failed to download ${file}:`, error.message);
    }
  }

  console.log('\n🎉 Model download completed!');
}

downloadModel().catch(console.error);
