import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const indexPath = join(__dirname, 'index.html');

try {
  // Read index.html
  let content = readFileSync(indexPath, 'utf8');
  
  // Generate new version hash (timestamp)
  const newVersion = Date.now().toString(36);
  
  // Replace BUILD_HASH
  content = content.replace(
    /<!-- BUILD_HASH: [\w\.]+ -->/,
    `<!-- BUILD_HASH: ${newVersion} -->`
  );
  
  // Write back
  writeFileSync(indexPath, content, 'utf8');
  
  console.log(`✅ Updated BUILD_HASH to: ${newVersion}`);
} catch (error) {
  console.error('❌ Error updating BUILD_HASH:', error);
  process.exit(1);
}