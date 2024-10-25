'use client';

import { 
  SiReact, SiNodedotjs, SiTypescript, SiVuedotjs, 
  SiTailwindcss, SiJavascript, SiPython, SiDjango,
  SiPostgresql, SiMongodb, SiDocker, SiGit,
  SiFirebase, SiRedux, SiGraphql, SiNextdotjs,
  SiHtml5, SiCss3, SiSass, SiAngular,
  SiPhp, SiLaravel, SiMysql, SiRust,
  SiGo, SiKubernetes, SiAmazon, SiGooglecloud,
  SiSwift, SiKotlin, SiFlutter, SiDart
} from 'react-icons/si';
import { BiCodeAlt } from 'react-icons/bi';

const techIconsMap = {
  'React': { icon: SiReact, color: '#61DAFB' },
  'Next.js': { icon: SiNextdotjs, color: '#000000' },
  'Node.js': { icon: SiNodedotjs, color: '#339933' },
  'TypeScript': { icon: SiTypescript, color: '#3178C6' },
  'Vue.js': { icon: SiVuedotjs, color: '#4FC08D' },
  'TailwindCSS': { icon: SiTailwindcss, color: '#06B6D4' },
  'JavaScript': { icon: SiJavascript, color: '#F7DF1E' },
  'Python': { icon: SiPython, color: '#3776AB' },
  'Django': { icon: SiDjango, color: '#092E20' },
  'PostgreSQL': { icon: SiPostgresql, color: '#4169E1' },
  'MongoDB': { icon: SiMongodb, color: '#47A248' },
  'Docker': { icon: SiDocker, color: '#2496ED' },
  'Git': { icon: SiGit, color: '#F05032' },
  'Firebase': { icon: SiFirebase, color: '#FFCA28' },
  'Redux': { icon: SiRedux, color: '#764ABC' },
  'GraphQL': { icon: SiGraphql, color: '#E10098' },
  'HTML': { icon: SiHtml5, color: '#E34F26' },
  'CSS': { icon: SiCss3, color: '#1572B6' },
  'SASS': { icon: SiSass, color: '#CC6699' },
  'Angular': { icon: SiAngular, color: '#DD0031' },
  'PHP': { icon: SiPhp, color: '#777BB4' },
  'Laravel': { icon: SiLaravel, color: '#FF2D20' },
  'MySQL': { icon: SiMysql, color: '#4479A1' },
  'Rust': { icon: SiRust, color: '#000000' },
  'Go': { icon: SiGo, color: '#00ADD8' },
  'Kubernetes': { icon: SiKubernetes, color: '#326CE5' },
  'AWS': { icon: SiAmazon, color: '#232F3E' },
  'Google Cloud': { icon: SiGooglecloud, color: '#4285F4' },
  'Swift': { icon: SiSwift, color: '#FA7343' },
  'Kotlin': { icon: SiKotlin, color: '#7F52FF' },
  'Flutter': { icon: SiFlutter, color: '#02569B' },
  'Dart': { icon: SiDart, color: '#0175C2' },
};

interface TechIconProps {
  name: string;
  className?: string;
  showBackground?: boolean;
}

export function CustomTechBadge({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex items-center justify-center w-6 h-6 rounded-md bg-primary/10 text-primary">
      <span className="text-xs font-semibold">{initials}</span>
    </div>
  );
}

export function TechIcon({ name, className = "h-4 w-4", showBackground = false }: TechIconProps) {
  const tech = techIconsMap[name as keyof typeof techIconsMap];
  
  if (!tech) {
    return <CustomTechBadge name={name} />;
  }
  
  const IconComponent = tech.icon;
  return (
    <div
      className={`flex items-center justify-center ${showBackground ? 'p-1 rounded' : ''}`}
      style={{
        color: tech.color,
        backgroundColor: showBackground ? `${tech.color}20` : 'transparent',
      }}
    >
      <IconComponent className={className} />
    </div>
  );
}

export function TechBadge({ name, onRemove }: { name: string; onRemove?: () => void }) {
  const tech = techIconsMap[name as keyof typeof techIconsMap];
  const bgColor = tech ? `${tech.color}20` : 'rgba(16, 185, 129, 0.1)'; // Use primary color for custom tech

  return (
    <div
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm"
      style={{ backgroundColor: bgColor }}
    >
      {tech ? <tech.icon className="h-4 w-4" style={{ color: tech.color }} /> : <CustomTechBadge name={name} />}
      <span className="text-foreground">{name}</span>
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          ×
        </button>
      )}
    </div>
  );
}

export const techList = Object.keys(techIconsMap);

export function isTechExists(name: string): boolean {
  return name in techIconsMap;
}
