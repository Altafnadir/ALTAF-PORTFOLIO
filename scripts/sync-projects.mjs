import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Directories
const myProjectsDir = path.join(rootDir, 'My Projects');
const projectsFallbackDir = path.join(rootDir, 'Projects');
const publicProjectsDir = path.join(rootDir, 'public', 'projects');
const projectsDataFile = path.join(rootDir, 'src', 'data', 'projects.ts');
const outputJsonFile = path.join(rootDir, 'src', 'data', 'project-images.json');

const VALID_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp']);

// Natural comparator for filenames (e.g. 1.png, 2.png, 10.png)
function naturalSort(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

// Normalize a string into a URL-friendly slug
function toSlug(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w-]+/g, '');
}

// Extract slugs defined in src/data/projects.ts
function getRegisteredProjects() {
  if (!fs.existsSync(projectsDataFile)) {
    console.warn(`⚠️  [sync-projects] Projects data file not found at ${projectsDataFile}`);
    return [];
  }

  const content = fs.readFileSync(projectsDataFile, 'utf-8');
  // Match slug: "..." or slug: '...'
  const matches = [...content.matchAll(/slug:\s*["']([^"']+)["']/g)];
  const slugs = Array.from(new Set(matches.map((m) => m[1])));
  return slugs;
}

// Find source directory
function getSourceDirectory() {
  if (fs.existsSync(myProjectsDir)) {
    return myProjectsDir;
  }
  if (fs.existsSync(projectsFallbackDir)) {
    console.log(`ℹ️  [sync-projects] "My Projects" not found, using fallback "Projects" folder.`);
    return projectsFallbackDir;
  }
  return null;
}

function sync() {
  console.log('🔄 [sync-projects] Starting project images sync...');

  const registeredSlugs = getRegisteredProjects();
  if (registeredSlugs.length === 0) {
    console.warn('⚠️  [sync-projects] No registered slugs found in src/data/projects.ts');
  } else {
    console.log(`📋 [sync-projects] Found ${registeredSlugs.length} registered project(s): ${registeredSlugs.join(', ')}`);
  }

  const sourceDir = getSourceDirectory();
  if (!sourceDir) {
    console.warn('⚠️  [sync-projects] Neither "My Projects" nor "Projects" folder exists in root.');
  }

  // Ensure output directories exist
  if (!fs.existsSync(publicProjectsDir)) {
    fs.mkdirSync(publicProjectsDir, { recursive: true });
  }
  const outputDataDir = path.dirname(outputJsonFile);
  if (!fs.existsSync(outputDataDir)) {
    fs.mkdirSync(outputDataDir, { recursive: true });
  }

  // Initialize mapping with empty arrays for all registered projects
  const projectImages = {};
  for (const slug of registeredSlugs) {
    projectImages[slug] = [];
  }

  if (sourceDir && fs.existsSync(sourceDir)) {
    const entries = fs.readdirSync(sourceDir, { withFileTypes: true });
    const subfolders = entries.filter((e) => e.isDirectory()).map((e) => e.name);

    for (const folder of subfolders) {
      // Find matching slug
      const folderSlug = toSlug(folder);
      let matchedSlug = registeredSlugs.find(
        (s) => s.toLowerCase() === folder.toLowerCase() || s.toLowerCase() === folderSlug
      );

      // Support common aliases if needed
      if (!matchedSlug) {
        if (folderSlug === 'school-management') matchedSlug = 'school-management-portal';
        else if (folderSlug === 'ai-scam-detection') matchedSlug = 'scamshield-ai';
        else if (folderSlug === 'ai-interview') matchedSlug = 'ai-interview-website';
      }

      if (!matchedSlug) {
        console.warn(
          `⚠️  [sync-projects] Warning: Folder "${folder}" does not match any registered project slug. Skipping.`
        );
        continue;
      }

      const folderPath = path.join(sourceDir, folder);
      const allFiles = fs.readdirSync(folderPath);

      // Filter images and sort naturally
      const imageFiles = allFiles
        .filter((file) => {
          const ext = path.extname(file).toLowerCase();
          return VALID_EXTENSIONS.has(ext);
        })
        .sort(naturalSort);

      if (imageFiles.length === 0) {
        console.warn(`⚠️  [sync-projects] Folder "${folder}" contains no valid images.`);
        continue;
      }

      // Target folder in public/projects/<matchedSlug>
      const targetDir = path.join(publicProjectsDir, matchedSlug);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      const copiedPaths = [];

      for (const img of imageFiles) {
        const srcFile = path.join(folderPath, img);
        const destFile = path.join(targetDir, img);

        try {
          fs.copyFileSync(srcFile, destFile);
          // Public URL relative to website root
          copiedPaths.push(`/projects/${matchedSlug}/${img}`);
        } catch (err) {
          console.error(`❌ [sync-projects] Failed to copy ${srcFile} to ${destFile}:`, err);
        }
      }

      projectImages[matchedSlug] = copiedPaths;
      console.log(`✅ [sync-projects] Synced ${copiedPaths.length} image(s) for "${matchedSlug}"`);
    }
  }

  // Check for projects with no images and inform
  for (const slug of registeredSlugs) {
    if (!projectImages[slug] || projectImages[slug].length === 0) {
      console.log(
        `ℹ️  [sync-projects] Note: Project "${slug}" has no images. Fallback placeholder will be used.`
      );
    }
  }

  // Write mapping JSON
  fs.writeFileSync(outputJsonFile, JSON.stringify(projectImages, null, 2), 'utf-8');
  console.log(`💾 [sync-projects] Generated ${path.relative(rootDir, outputJsonFile)} successfully.\n`);
}

sync();
