// Generates the static badge SVGs used by README.md into assets/badges/.
// Run with `npm run badges` after editing the BADGES list below.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { makeBadge } from 'badge-maker'
import * as simpleIcons from 'simple-icons'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'assets', 'badges')
const localIconsDir = join(root, 'scripts', 'icons')

// Icons are looked up in simple-icons first, then in scripts/icons/ for the
// ones simple-icons no longer ships (AWS, LinkedIn, Adobe) or never had (Kanban).
const iconsBySlug = Object.fromEntries(
  Object.values(simpleIcons).map(icon => [icon.slug, icon.svg]),
)

function loadIcon(slug) {
  if (iconsBySlug[slug]) return iconsBySlug[slug]
  return readFileSync(join(localIconsDir, `${slug}.svg`), 'utf8').trim()
}

function logoBase64(slug, color) {
  const svg = loadIcon(slug).replace('<svg', `<svg fill="${color}"`)
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}

const flat = { style: 'flat', logoColor: 'white' }
const big = { style: 'for-the-badge', logoColor: 'white' }

const BADGES = [
  // Header links
  { id: 'portfolio', label: 'Portfolio', message: 'andresgmg.github.io', color: '#4f46e5', logo: 'astro', ...flat },
  { id: 'cv-en', label: 'CV', message: 'English', color: '#2b3a55', logo: 'adobeacrobatreader', ...flat },
  { id: 'cv-es', label: 'CV', message: 'Español', color: '#2b3a55', logo: 'adobeacrobatreader', ...flat },
  { id: 'linkedin', message: 'LinkedIn', color: '#0077B5', logo: 'linkedin', ...flat },
  { id: 'instagram', message: 'Instagram', color: '#E4405F', logo: 'instagram', ...flat },
  { id: 'whatsapp', message: 'WhatsApp', color: '#25D366', logo: 'whatsapp', ...flat },

  // Languages
  { id: 'python', message: 'python', color: '#3670A0', logo: 'python', ...big, logoColor: '#ffdd54' },
  { id: 'typescript', message: 'typescript', color: '#323330', logo: 'typescript', ...big, logoColor: '#3178C6' },
  { id: 'javascript', message: 'javascript', color: '#323330', logo: 'javascript', ...big, logoColor: '#F7DF1E' },
  { id: 'go', message: 'go', color: '#00ADD8', logo: 'go', ...big },
  { id: 'rust', message: 'rust', color: '#000000', logo: 'rust', ...big },
  { id: 'cpp', message: 'C/C++', color: '#00599C', logo: 'cplusplus', ...big },

  // Backend & AI
  { id: 'fastapi', message: 'FastAPI', color: '#005571', logo: 'fastapi', ...big, logoColor: '#009688' },
  { id: 'django', message: 'django', color: '#092E20', logo: 'django', ...big },
  { id: 'django-rest', label: 'DJANGO', message: 'REST', labelColor: 'gray', color: '#ff1709', logo: 'django', ...big },
  { id: 'flask', message: 'flask', color: '#000000', logo: 'flask', ...big },
  { id: 'nodejs', message: 'node.js', color: '#6DA55F', logo: 'nodedotjs', ...big },
  { id: 'serverless', message: 'serverless', color: '#000000', logo: 'serverless', ...big, logoColor: '#DD0031' },
  { id: 'langchain', message: 'LangChain', color: '#1C3C3C', logo: 'langchain', ...big },
  { id: 'google-gemini', message: 'Google Gemini', color: '#8E75B2', logo: 'googlegemini', ...big },
  { id: 'jwt', message: 'JWT', color: 'black', logo: 'jsonwebtokens', ...big },

  // Frontend
  { id: 'nextjs', message: 'Next', color: 'black', logo: 'nextdotjs', ...big },
  { id: 'react', message: 'React', color: '#1572B6', logo: 'react', ...big },
  { id: 'angular', message: 'angular', color: '#DD0031', logo: 'angular', ...big },
  { id: 'ionic', message: 'ionic', color: '#0A0FFF', logo: 'ionic', ...big },
  { id: 'astro', message: 'astro', color: '#2C2052', logo: 'astro', ...big },
  { id: 'html5', message: 'html5', color: '#E34F26', logo: 'html5', ...big },
  { id: 'css3', message: 'css3', color: '#1572B6', logo: 'css', ...big },

  // Cloud & DevOps
  { id: 'aws', message: 'aws', color: '#FF9900', logo: 'amazonwebservices', ...big },
  { id: 'google-cloud', message: 'Google Cloud', color: '#4285F4', logo: 'googlecloud', ...big },
  { id: 'docker', message: 'docker', color: '#0db7ed', logo: 'docker', ...big },
  { id: 'kubernetes', message: 'kubernetes', color: '#326ce5', logo: 'kubernetes', ...big },
  { id: 'terraform', message: 'terraform', color: '#7B42BC', logo: 'terraform', ...big },
  { id: 'github-actions', message: 'GitHub Actions', color: '#2088FF', logo: 'githubactions', ...big },
  { id: 'vercel', message: 'vercel', color: '#000000', logo: 'vercel', ...big },
  { id: 'render', message: 'render', color: '#005571', logo: 'render', ...big },
  { id: 'railway', message: 'railway', color: '#000000', logo: 'railway', ...big },
  { id: 'linux', message: 'Linux', color: '#FCC624', logo: 'linux', ...big, logoColor: 'black' },

  // Databases
  { id: 'postgres', message: 'postgres', color: '#316192', logo: 'postgresql', ...big },
  { id: 'mysql', message: 'mysql', color: '#0000ff', logo: 'mysql', ...big },
  { id: 'mariadb', message: 'MariaDB', color: '#003545', logo: 'mariadb', ...big },
  { id: 'sqlite', message: 'sqlite', color: '#07405e', logo: 'sqlite', ...big },
  { id: 'mongodb', message: 'MongoDB', color: '#4ea94b', logo: 'mongodb', ...big },
  { id: 'dynamodb', message: 'DynamoDB', color: '#4053D6', logo: 'amazondynamodb', ...big },

  // Tools & Methodologies
  { id: 'jira', message: 'jira', color: '#0A0FFF', logo: 'jira', ...big },
  { id: 'confluence', message: 'confluence', color: '#172BF4', logo: 'confluence', ...big },
  { id: 'postman', message: 'Postman', color: '#FF6C37', logo: 'postman', ...big },
  { id: 'swagger', message: 'Swagger', color: '#85EA2D', logo: 'swagger', ...big, logoColor: 'black' },
  { id: 'trello', message: 'Trello', color: '#026AA7', logo: 'trello', ...big },
  { id: 'notion', message: 'notion', color: '#000000', logo: 'notion', ...big },
  { id: 'pandas', message: 'pandas', color: '#150458', logo: 'pandas', ...big },
  { id: 'scrum', message: 'Scrum', color: '#009FDA', logo: 'scrumalliance', ...big },
  { id: 'kanban', message: 'Kanban', color: '#0052CC', logo: 'kanban', ...big },
]

rmSync(outDir, { recursive: true, force: true })
mkdirSync(outDir, { recursive: true })

for (const { id, logo, logoColor, ...format } of BADGES) {
  const svg = makeBadge({ ...format, logoBase64: logoBase64(logo, logoColor), idSuffix: id.replace(/[^\w-]/g, '') })
  writeFileSync(join(outDir, `${id}.svg`), `${svg}\n`)
}

console.log(`Generated ${BADGES.length} badges in ${outDir}`)
