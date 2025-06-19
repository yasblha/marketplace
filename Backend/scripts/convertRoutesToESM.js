import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routesDir = path.join(__dirname, '../routes/api');

async function convertFileToESM(filePath) {
    try {
        let content = await fs.promises.readFile(filePath, 'utf8');
        
        // Remplacer les require par des imports
        content = content.replace(
            /const\s+\{\s*(.*?)\s*\}\s*=\s*require\s*\(\s*['"](.*?)['"]\s*\)/g, 
            'import { $1 } from \'$2.js\''
        );
        
        content = content.replace(
            /const\s+(\w+)\s*=\s*require\s*\(\s*['"](.*?)['"]\s*\)/g, 
            'import $1 from \'$2.js\''
        );
        
        // Remplacer module.exports par export default
        content = content.replace(
            /module\.exports\s*=\s*(\w+);?/g, 
            'export default $1;'
        );
        
        // Ajouter l'extension .js aux imports locaux
        content = content.replace(
            /from\s+['"](?:\.\.?\/)*([^.'"\/]+)(?<!\.js)['"]/g, 
            'from \'./$1.js\''
        );
        
        await fs.promises.writeFile(filePath, content, 'utf8');
        console.log(`Converted: ${filePath}`);
        return true;
    } catch (error) {
        console.error(`Error converting ${filePath}:`, error);
        return false;
    }
}

async function main() {
    try {
        const files = await fs.promises.readdir(routesDir);
        
        for (const file of files) {
            if (!file.endsWith('.js')) continue;
            
            const filePath = path.join(routesDir, file);
            await convertFileToESM(filePath);
        }
        
        console.log('Conversion des routes en ESM terminée !');
    } catch (error) {
        console.error('Erreur lors de la conversion :', error);
        process.exit(1);
    }
}

main();
