import path from "path";

// ─── Types ───

export interface ParsedCV {
  summary: string | null;
  skills: string[];
  strengths: { area: string; description: string }[];
  experience: { title: string; company: string; location: string; duration: string; description: string }[];
  projects: { name: string; role: string; year: string; technologies: string; description: string; achievements: string }[];
  education: { degree: string; field: string; institution: string; year: string }[];
  certifications: { name: string; issuer: string; year: string }[];
  awards: { title: string; issuer: string; year: string }[];
  research: { title: string; publisher: string; year: string; description: string }[];
  volunteering: { organization: string; role: string; duration: string; responsibilities: string }[];
  languages: { language: string; proficiency: string }[];
  interests: string[];
  phone: string | null;
  email: string | null;
  location: string | null;
  linkedin: string | null;
  portfolio: string | null;
}

// ─── Section Registry ───

interface SectionDef {
  id: string;
  aliases: RegExp;
  category: string;
  priority: number;
  active: "yes" | "skip-only";
}

const SECTIONS: SectionDef[] = [
  {
    id: "contact",
    aliases: /^(contact\s*(information|info|details)|personal\s*(information|details|info)|bio\s*data|candidate\s*info|profile\s*header|identity|about|coordinates)/i,
    category: "personal",
    priority: 110,
    active: "yes",
  },
  {
    id: "skills",
    aliases: /^(skills|technical\s*skills|core\s*(competencies|skills)|tech\s*stack|technologies|capabilities|expertise|areas?\s*of\s*expertise|tool\s*stack|frameworks|strengths|software\s*skills|competencies|programming\s*languages)/i,
    category: "career",
    priority: 85,
    active: "yes",
  },
  {
    id: "summary",
    aliases: /^(professional\s*summary|executive\s*summary|profile|career\s*objective|overview|synopsis|highlights|about\s*me|professional\s*profile|career\s*profile|background|personal\s*statement)/i,
    category: "career",
    priority: 60,
    active: "yes",
  },
  {
    id: "strengths",
    aliases: /^(career\s*strengths|core\s*competencies|key\s*competencies|specializations|value\s*proposition|professional\s*strengths)/i,
    category: "career",
    priority: 58,
    active: "yes",
  },
  {
    id: "experience",
    aliases: /^(professional\s*experience|work\s*experience|employment\s*(history|record)|career\s*(history|background)|experience|positions?\s*held|appointments|service|industry\s*experience|teaching\s*experience|clinical\s*experience|research\s*experience|volunteer\s*experience|freelance\s*experience|contract\s*experience|internship\s*experience)/i,
    category: "career",
    priority: 100,
    active: "yes",
  },
  {
    id: "projects",
    aliases: /^(projects|portfolio|case\s*studies|featured\s*projects|open\s*source|academic\s*projects|research\s*projects|technical\s*projects|personal\s*projects|deliverables|contributions|showcase|works)/i,
    category: "career",
    priority: 90,
    active: "yes",
  },
  {
    id: "education",
    aliases: /^(education|academic\s*(background|qualifications)|qualifications|educational\s*qualifications|degrees|higher\s*education|university\s*education|training|courses|learning\s*&?\s*development)/i,
    category: "learning",
    priority: 95,
    active: "yes",
  },
  {
    id: "certifications",
    aliases: /^(certifications?\s*(&?\s*training)?|professional\s*(certifications?|training|qualifications\s*&?\s*training)|courses|licenses|credentials|professional\s*development|workshops|seminars|bootcamps|conferences|designations)/i,
    category: "learning",
    priority: 88,
    active: "yes",
  },
  {
    id: "awards",
    aliases: /^(honou?rs?|awards?|achievements?|recognition|distinctions|scholarships|merit\s*awards|accomplishments|performance\s*highlights|wins)/i,
    category: "personal",
    priority: 87,
    active: "yes",
  },
  {
    id: "research",
    aliases: /^(research|publications|academic\s*publications|research\s*papers|journals|articles|scientific\s*publications|conference\s*papers|thesis|dissertation)/i,
    category: "learning",
    priority: 80,
    active: "yes",
  },
  {
    id: "volunteering",
    aliases: /^(volunteer(ing)?|community\s*service|leadership|professional\s*affiliations|memberships|organizations|committees|associations|governance|student\s*leadership|outreach)/i,
    category: "personal",
    priority: 75,
    active: "yes",
  },
  {
    id: "languages",
    aliases: /^(languages?|language\s*skills|language\s*proficiency|linguistic\s*skills|spoken\s*languages|foreign\s*languages)/i,
    category: "personal",
    priority: 70,
    active: "yes",
  },
  {
    id: "interests",
    aliases: /^(interests?|hobbies|personal\s*interests|activities|extracurricular\s*activities|leisure\s*activities|passions)/i,
    category: "personal",
    priority: 50,
    active: "yes",
  },
  {
    id: "references",
    aliases: /^(references|referees|professional\s*references|academic\s*references|recommendation\s*contacts|testimonials|endorsements)/i,
    category: "personal",
    priority: 40,
    active: "skip-only",
  },
];

// ─── File Extraction ───

export async function extractTextFromCV(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = file.name.split(".").pop()?.toLowerCase();

  if (ext === "pdf") {
    return extractFromPDF(buffer);
  } else if (ext === "docx") {
    return extractFromDOCX(buffer);
  } else if (ext === "doc") {
    return extractFromDOC(buffer);
  }

  throw new Error("Unsupported file type: " + ext);
}

async function extractFromPDF(buffer: Buffer): Promise<string> {
  const pdfjsLib: any = await import("pdfjs-dist/legacy/build/pdf.mjs");

  // Resolve worker path for pdfjs-dist v5 (uses .mjs extension)
  let workerPath: string | null = null;
  const candidates = [
    () => path.join(process.cwd(), "node_modules", "pdfjs-dist", "legacy", "build", "pdf.worker.mjs"),
    () => path.join(__dirname, "..", "..", "..", "..", "node_modules", "pdfjs-dist", "legacy", "build", "pdf.worker.mjs"),
  ];

  for (const getCandidate of candidates) {
    try {
      const candidate = getCandidate();
      if (candidate && require("fs").existsSync(candidate)) {
        workerPath = candidate;
        break;
      }
    } catch {
      continue;
    }
  }

  if (workerPath) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerPath;
  }

  // Suppress font-related warnings that don't affect text extraction
  const params: Record<string, unknown> = {
    data: new Uint8Array(buffer),
    useWorkerFetch: false,
    isEvalSupported: false,
    isPureFetch: false,
    disableFontFace: true,
    verbosity: 0,
  };

  // If we couldn't find the worker file, explicitly disable worker
  if (!workerPath) {
    params["disableWorker"] = true;
    pdfjsLib.GlobalWorkerOptions.workerSrc = "";
  }

  const doc = await pdfjsLib.getDocument(params).promise;

  const pages: string[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const items = content.items as Array<{
      str: string;
      transform: number[];
      hasEOL: boolean;
      width: number;
      height: number;
    }>;

    if (items.length === 0) continue;

    // Use Y-coordinate (transform[5]) to detect line breaks.
    // Items on the same Y are on the same line; a significant Y shift means a new line.
    // PDF Y-axis goes bottom-to-top, so a smaller Y means further down the page.
    const LINE_THRESHOLD = 2; // pixels tolerance for same-line detection
    const lines: string[] = [];
    let currentLine = "";
    let lastY: number | null = null;
    let lastX: number | null = null;
    let lineHeight: number | null = null;

    for (let j = 0; j < items.length; j++) {
      const item = items[j];
      const text = item.str;
      if (!text) continue;

      const y = item.transform[5];
      const x = item.transform[4];
      const h = item.height || 12;

      // Detect line height from first multi-item line
      if (lastY !== null && Math.abs(y - lastY) > LINE_THRESHOLD) {
        const gap = Math.abs(y - lastY);
        if (!lineHeight || gap < lineHeight * 3) {
          lineHeight = gap > h ? gap : h;
        }
      }

      if (lastY !== null) {
        const yDiff = Math.abs(y - lastY);

        if (yDiff > LINE_THRESHOLD) {
          // Y changed — this is a new line
          // Add extra newline for paragraph breaks (larger Y gaps)
          const isParagraphBreak = lineHeight && yDiff > lineHeight * 1.8;
          if (isParagraphBreak) {
            currentLine = currentLine.trim();
            if (currentLine) lines.push(currentLine);
            lines.push(""); // blank line = paragraph break
            currentLine = text;
          } else {
            currentLine = currentLine.trim();
            if (currentLine) lines.push(currentLine);
            currentLine = text;
          }
        } else {
          // Same line — check if we need a space based on X gap
          if (lastX !== null) {
            const xGap = x - (lastX || 0);
            // If there's a significant gap, add a space
            // (handles cases where items should be separated)
            if (xGap > 1) {
              currentLine += " ";
            }
          }
          currentLine += text;
        }
      } else {
        currentLine = text;
      }

      lastY = y;
      lastX = x + (item.width || 0);
    }

    // Push remaining text
    currentLine = currentLine.trim();
    if (currentLine) lines.push(currentLine);

    pages.push(lines.join("\n"));
  }

  return pages.join("\n\n");
}

async function extractFromDOCX(buffer: Buffer): Promise<string> {
  const mammoth = await import("mammoth");
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

async function extractFromDOC(buffer: Buffer): Promise<string> {
  const mammoth = await import("mammoth");
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

// ─── Section Splitting ───

interface SectionContent {
  id: string;
  title: string;
  content: string;
  priority: number;
  active: "yes" | "skip-only";
}

function splitIntoSections(text: string): SectionContent[] {
  // Pre-processing: some PDFs produce text as one continuous string with no line breaks.
  // We build a combined regex from all section aliases and insert newlines around
  // inline section headers (those surrounded by spaces, not already on their own line).
  // Important: strip the ^ anchor from each alias since we're matching inline, not at line start.
  const allAliasParts = SECTIONS.map(s => `(?:${s.aliases.source.replace(/^\^/, "")})`).join("|");
  const inlineSectionRe = new RegExp(`\\s{2,}(${allAliasParts})\\s{2,}`, "gi");
  let normalized = text.replace(inlineSectionRe, "\n\n$1\n\n");

  // Also handle the edge case where a section header is at start of a line already
  // but without a trailing newline (header followed immediately by content text)
  const headerAtStartRe = new RegExp(`^(${allAliasParts})\\s{2,}`, "gim");
  normalized = normalized.replace(headerAtStartRe, "$1\n");

  const lines = normalized.split(/\r?\n/);
  const sections: SectionContent[] = [];
  let currentSection: SectionContent | null = null;
  let preamble: string[] = [];

  function pushCurrent() {
    if (currentSection) {
      currentSection.content = currentSection.content.trim();
      sections.push(currentSection);
      currentSection = null;
    }
  }

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip empty lines
    if (!trimmed) continue;

    // Check if this line is a section header (short lines only — headers are rarely long)
    if (trimmed.length < 60) {
      // Check against all section aliases
      let matched = false;
      for (const sec of SECTIONS) {
        if (sec.aliases.test(trimmed)) {
          pushCurrent();
          currentSection = {
            id: sec.id,
            title: trimmed,
            content: "",
            priority: sec.priority,
            active: sec.active,
          };
          preamble = [];
          matched = true;
          break;
        }
      }

      if (matched) continue; // don't add the header line as content
    }

    // Append to current section or preamble
    if (currentSection) {
      currentSection.content += (currentSection.content ? "\n" : "") + trimmed;
    } else {
      preamble.push(trimmed);
    }
  }

  pushCurrent();

  // If there's preamble with no sections, treat everything as unparsed
  if (sections.length === 0 && preamble.length > 0) {
    sections.unshift({
      id: "_preamble",
      title: "",
      content: preamble.join("\n"),
      priority: 0,
      active: "yes",
    });
  } else if (preamble.length > 0) {
    // Prepend preamble as a pseudo-section for contact extraction
    sections.unshift({
      id: "_preamble",
      title: "",
      content: preamble.join("\n"),
      priority: 0,
      active: "yes",
    });
  }

  return sections;
}

// ─── Contact Extraction ───

function extractContact(sections: SectionContent[], rawText: string): Pick<ParsedCV, "phone" | "email" | "location" | "linkedin" | "portfolio"> {
  const result: Pick<ParsedCV, "phone" | "email" | "location" | "linkedin" | "portfolio"> = {
    phone: null,
    email: null,
    location: null,
    linkedin: null,
    portfolio: null,
  };

  // Gather text from contact section + preamble + first 10 lines
  const textParts: string[] = [];

  const preamble = sections.find(s => s.id === "_preamble");
  if (preamble) textParts.push(preamble.content);

  const contactSection = sections.find(s => s.id === "contact");
  if (contactSection) textParts.push(contactSection.content);

  const firstLines = rawText.split(/\r?\n/).slice(0, 10).join("\n");
  textParts.push(firstLines);

  const allText = textParts.join("\n");

  // Email
  const emailMatch = allText.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) result.email = emailMatch[0].toLowerCase();

  // Phone - Kenyan formats
  const phonePatterns = [
    /(?:\+254|0)(7\d|1\d)\s*[\d\s\-]{6,10}/g,
    /(\+?\d{1,4}[\s\-]?)?\(?\d{2,4}\)?[\s\-]?\d{3,4}[\s\-]?\d{3,4}/g,
  ];
  for (const pattern of phonePatterns) {
    const match = pattern.exec(allText);
    if (match) {
      result.phone = match[0].trim().replace(/\s+/g, " ");
      break;
    }
  }

  // LinkedIn
  const linkedinMatch = allText.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[\w\-]+/i);
  if (linkedinMatch) result.linkedin = linkedinMatch[0];

  // Portfolio / GitHub / personal website
  const portfolioMatch = allText.match(/(?:https?:\/\/)?(?:www\.)?(?:github\.com\/[\w\-]+|[\w\-]+\.(?:dev|io|com|net|co|me)(?:\/[\w\-]*)?)/i);
  if (portfolioMatch) {
    const url = portfolioMatch[0];
    if (!url.includes("linkedin.com")) {
      result.portfolio = url;
    }
  }

  // Location - look for patterns like "Nairobi, Kenya"
  const locationPatterns = [
    /([A-Z][a-zA-Z\s]+,\s*[A-Z][a-zA-Z\s]+)/,
    /([A-Z][a-zA-Z\s]+,\s*[A-Z][a-zA-Z\s]+)/,
  ];
  for (const pattern of locationPatterns) {
    const match = pattern.exec(allText);
    if (match) {
      const loc = match[1].trim();
      // Filter out false positives
      if (loc.length > 3 && loc.length < 100 && !loc.includes("@")) {
        result.location = loc;
        break;
      }
    }
  }

  return result;
}

// ─── Summary Extraction ───

function extractSummary(sections: SectionContent[]): string | null {
  const section = sections.find(s => s.id === "summary");
  if (!section) return null;

  const cleaned = section.content
    .replace(/\s+/g, " ")
    .trim();

  return cleaned.length > 500 ? cleaned.substring(0, 500) + "..." : cleaned || null;
}

// ─── Skills Extraction ───

const TECH_SKILLS = [
  "javascript", "typescript", "python", "java", "c++", "c#", "ruby", "go", "rust", "swift",
  "kotlin", "php", "html", "css", "sql", "nosql", "react", "angular", "vue", "node.js",
  "next.js", "express", "django", "flask", "spring", "docker", "kubernetes", "aws", "azure",
  "gcp", "git", "linux", "mongodb", "postgresql", "mysql", "redis", "elasticsearch",
  "graphql", "rest", "api", "figma", "sketch", "adobe", "photoshop", "tailwind", "bootstrap",
  "sass", "less", "webpack", "vite", "jest", "cypress", "selenium", "jenkins", "ci/cd",
  "terraform", "ansible", "nginx", "apache", "rabbitmq", "kafka", "firebase", "supabase",
  "vercel", "netlify", "heroku", "flutter", "react native", "ios", "android", "xcode",
  "tensorflow", "pytorch", "pandas", "numpy", "r", "matlab", "tableau", "power bi",
  "excel", "word", "powerpoint", "sharepoint", "sap", "salesforce", "hubspot",
  "jira", "confluence", "slack", "trello", "asana", "notion",
  "machine learning", "deep learning", "nlp", "computer vision", "data science",
  "blockchain", "web3", "solidity", "agile", "scrum", "kanban", "devops", "sre",
];

const BUSINESS_SKILLS = [
  "project management", "product management", "stakeholder management", "team leadership",
  "strategic planning", "business development", "financial analysis", "budgeting",
  "risk management", "change management", "process improvement", "vendor management",
  "client relations", "account management", "contract negotiation", "procurement",
  "supply chain", "logistics", "operations management", "quality assurance",
  "compliance", "audit", "reporting", "data analysis", "market research",
  "digital marketing", "content marketing", "social media", "seo", "sem",
  "email marketing", "copywriting", "branding", "public relations",
  "human resources", "recruiting", "talent acquisition", "onboarding",
  "training", "coaching", "mentoring", "performance management",
];

function extractSkills(sections: SectionContent[]): string[] {
  const section = sections.find(s => s.id === "skills");
  if (!section) return [];

  const skills: Set<string> = new Set();

  const content = section.content;

  // Try comma-separated
  const commaParts = content.split(/[,;•|]/).map(s => s.trim()).filter(Boolean);
  for (const part of commaParts) {
    const cleaned = part.replace(/^[-•*·]\s*/, "").trim();
    if (cleaned.length > 0 && cleaned.length < 60) {
      skills.add(cleaned);
    }
  }

  // Try bullet items (lines starting with - or *)
  const bulletItems = content.split(/\r?\n/).filter(line => /^[-•*·]\s/.test(line));
  for (const item of bulletItems) {
    const cleaned = item.replace(/^[-•*·]\s*/, "").trim();
    if (cleaned.length > 0 && cleaned.length < 60) {
      skills.add(cleaned);
    }
  }

  // Keyword scan
  const lowerContent = content.toLowerCase();
  for (const skill of [...TECH_SKILLS, ...BUSINESS_SKILLS]) {
    if (lowerContent.includes(skill)) {
      // Capitalize properly
      const capitalized = skill.split(" ").map(w =>
        w.charAt(0).toUpperCase() + w.slice(1)
      ).join(" ");
      skills.add(capitalized);
    }
  }

  return Array.from(skills).slice(0, 50);
}

// ─── Strengths Extraction ───

function extractStrengths(sections: SectionContent[]): { area: string; description: string }[] {
  const section = sections.find(s => s.id === "strengths");
  if (!section) return [];

  const strengths: { area: string; description: string }[] = [];
  const content = section.content;

  // Split by bullet markers (•) to handle both line-broken and blob text
  const items = content.split(/[•]/).map(s => s.trim()).filter(Boolean);

  for (const item of items) {
    // Match patterns like "Area – Description" or "Area : Description" or "Area - Description"
    const match = item.match(/^(.+?)\s*[—–:-]\s*(.+)$/);
    if (match) {
      strengths.push({
        area: match[1].trim(),
        description: match[2].trim(),
      });
    } else if (item.length > 0 && item.length < 200) {
      strengths.push({
        area: item.replace(/^[-*·]\s*/, "").trim(),
        description: "",
      });
    }
  }

  return strengths.slice(0, 20);
}

// ─── Experience Extraction ───

function extractExperience(sections: SectionContent[]): ParsedCV["experience"] {
  const section = sections.find(s => s.id === "experience");
  if (!section) return [];

  const jobs: ParsedCV["experience"] = [];
  const content = section.content;

  // Pre-process: split blob text at job boundaries.
  // Each job in a Kenyan CV typically follows this pattern:
  //   Title – Subtitle | Month Year – Present  Company (Rating) – City  Key Contributions: • bullets
  // We split on patterns like: capitalized word(s) followed by " | " and a date
  const jobSplitRe = /(?=\b[A-Z][a-zA-Z\s&']{2,}(?:\s*[-–—]\s*[A-Z][a-zA-Z\s&']+)?\s*[|]\s*(?:[A-Za-z]{3}\s*\d{4}|\d{4}))/g;
  const rawSegments = content.split(jobSplitRe).filter(s => s.trim().length > 5);
  
  // Process each segment
  for (const segment of rawSegments) {
    const trimmed = segment.trim();
    
    // Extract bullets from the segment
    const bulletRe = /[•]\s*([^\n•]+?)(?=\s*[•]|$)/g;
    const bullets: string[] = [];
    let bMatch;
    while ((bMatch = bulletRe.exec(trimmed)) !== null) {
      const text = bMatch[1].trim();
      if (text.length > 10) bullets.push(text);
    }

    // Remove bullets and "Key Contributions:" from the header part
    const headerPart = trimmed.replace(/[•][^\n]*/g, "").replace(/\s*Key\s*Contributions?:?\s*/gi, " ").trim();

    // Try "Title | Date | Company – Location" pattern
    const pipeMatch = headerPart.match(/^(.+?)\s*[|]\s*((?:[A-Za-z]{3}\s*\d{4}|\d{4})(?:\s*[-–—to]+\s*(?:Present|Current|\d{4}|[A-Za-z]{3}\s*\d{0,4}))?)\s+(.+)$/);
    
    if (pipeMatch) {
      const title = pipeMatch[1].trim();
      const duration = pipeMatch[2].trim();
      let companyRemainder = pipeMatch[3].trim();
      
      // Clean remainder: remove trailing "Key Contributions" etc
      companyRemainder = companyRemainder.replace(/\s*Key\s*Contributions?:?.*/i, "").trim();
      
      // Split company and location (last " – City" pattern)
      let company = companyRemainder;
      let location = "";
      const locMatch = companyRemainder.match(/^(.+?)\s*[-–—]\s*([A-Z][a-zA-Z\s]{1,25})\s*$/);
      if (locMatch) {
        company = locMatch[1].trim();
        location = locMatch[2].trim();
      }

      jobs.push({ title, company, location, duration, description: bullets.join("\n") });
    }
  }

  // Fallback: if no jobs found with pipe pattern, try line-by-line
  if (jobs.length === 0) {
    const lines = content.split(/\r?\n/).filter(l => l.trim());
    let current: Partial<ParsedCV["experience"][0]> | null = null;
    const bullets: string[] = [];
    const datePattern = /(\d{4}|\w+ \d{4})/i;

    function flushJob() {
      if (current && (current.title || current.company)) {
        jobs.push({
          title: current.title || "", company: current.company || "",
          location: current.location || "", duration: current.duration || "",
          description: bullets.join("\n"),
        });
      }
      current = null; bullets.length = 0;
    }

    for (const line of lines) {
      const t = line.trim();
      if (!t || t.length < 2) continue;
      if (/^(key\s*contributions?|responsibilities?|duties?):/i.test(t)) continue;

      if (/^[-•*·]\s/.test(t)) {
        if (current) bullets.push(t.replace(/^[-•*·]\s*/, "").trim());
        continue;
      }

      const dashMatch = t.match(/^(.+?)\s*[-–—]\s*(.+?)\s*[-–—]\s*(.+)$/);
      if (dashMatch && t.length < 150) {
        flushJob();
        current = { title: dashMatch[1].trim(), company: dashMatch[2].trim(), duration: dashMatch[3].trim(), location: "" };
        continue;
      }

      if (current && datePattern.test(t)) { flushJob(); current = { duration: t }; continue; }

      const isHeader = t.length < 80 && /^[A-Z]/.test(t);
      if (isHeader && !current) current = { title: t };
      else if (isHeader && current && !current.company) current.company = t;
      else if (current && t.length > 10) bullets.push(t);
      else if (isHeader) { flushJob(); current = { title: t }; }
    }
    flushJob();
  }

  return jobs.slice(0, 20);
}

// ─── Projects Extraction ───

function extractProjects(sections: SectionContent[]): ParsedCV["projects"] {
  const section = sections.find(s => s.id === "projects");
  if (!section) return [];

  const projects: ParsedCV["projects"] = [];
  const blocks = section.content.split(/\r?\n\s*\r?\n/).filter(Boolean);

  for (const block of blocks) {
    const lines = block.split(/\r?\n/).filter(l => l.trim());
    if (lines.length === 0) continue;

    const firstLine = lines[0].replace(/^[-•*·]\s*/, "").trim();

    // Try to parse "Project Name | Role | Year" or "Project Name — Role — Year"
    const pipeMatch = firstLine.match(/^(.+?)\s*[|—–]\s*(.+?)\s*[|—–]\s*(.+)$/);
    const dashMatch = firstLine.match(/^(.+?)\s*[-–—]\s*(.+?)\s*[-–—]\s*(.+)$/);

    let name = firstLine;
    let role = "";
    let year = "";
    let technologies = "";
    let description = "";
    let achievements = "";

    if (pipeMatch) {
      name = pipeMatch[1].trim();
      role = pipeMatch[2].trim();
      year = pipeMatch[3].trim();
    } else if (dashMatch) {
      name = dashMatch[1].trim();
      role = dashMatch[2].trim();
      year = dashMatch[3].trim();
    }

    // Extract from remaining lines
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].replace(/^[-•*·]\s*/, "").trim();
      if (!line) continue;

      const lower = line.toLowerCase();
      if (lower.startsWith("tech") || lower.startsWith("stack") || lower.includes("technologies")) {
        technologies = line.replace(/^.*?:\s*/i, "").trim();
      } else if (lower.startsWith("achievement") || lower.startsWith("result") || lower.startsWith("impact")) {
        achievements += (achievements ? "\n" : "") + line.replace(/^.*?:\s*/i, "").trim();
      } else {
        description += (description ? " " : "") + line;
      }
    }

    // Extract year from name or description if not found
    if (!year) {
      const yearMatch = name.match(/(\d{4})/) || description.match(/(\d{4})/);
      if (yearMatch) year = yearMatch[1];
    }

    projects.push({ name, role, year, technologies, description, achievements });
  }

  return projects.slice(0, 20);
}

// ─── Education Extraction ───

function extractEducation(sections: SectionContent[]): ParsedCV["education"] {
  const section = sections.find(s => s.id === "education");
  if (!section) return [];

  const entries: ParsedCV["education"] = [];
  const lines = section.content.split(/\r?\n/).filter(l => l.trim());

  // Degree patterns
  const degreePattern = /(?:Ph\.?D|Doctorate|Master'?s|M\.?Sc|M\.?A|MBA|Bachelor'?s|B\.?Sc|B\.?A|B\.?Com|B\.?Tech|Diploma|Certificate|Associate'?s|Advanced Diploma|Higher Diploma)/i;

  let current: Partial<ParsedCV["education"][0]> | null = null;

  for (const line of lines) {
    const trimmed = line.replace(/^[-•*·]\s*/, "").trim();
    if (!trimmed) continue;

    const hasDegree = degreePattern.test(trimmed);
    const yearMatch = trimmed.match(/(\d{4})/);

    if (hasDegree) {
      if (current && current.degree) {
        entries.push({
          degree: current.degree || "",
          field: current.field || "",
          institution: current.institution || "",
          year: current.year || "",
        });
      }
      // Try to separate degree from institution
      const parts = trimmed.split(/[–—|,]/).map(s => s.trim());
      current = {
        degree: parts[0] || trimmed,
        field: "",
        institution: parts.length > 1 ? parts[parts.length - 1] : "",
        year: yearMatch ? yearMatch[1] : "",
      };
    } else if (current) {
      // Non-degree line under current education
      if (/^\d{4}/.test(trimmed)) {
        current.year = trimmed.match(/(\d{4})/)?.[1] || "";
      } else if (trimmed.length < 80 && !current.institution) {
        current.institution = trimmed;
      } else if (!current.field) {
        current.field = trimmed;
      }
    } else {
      // First line without degree - might be institution
      current = {
        degree: "",
        field: "",
        institution: trimmed,
        year: yearMatch ? yearMatch[1] : "",
      };
    }
  }

  if (current) {
    entries.push({
      degree: current.degree || "",
      field: current.field || "",
      institution: current.institution || "",
      year: current.year || "",
    });
  }

  return entries.slice(0, 20);
}

// ─── Certifications Extraction ───

function extractCertifications(sections: SectionContent[]): ParsedCV["certifications"] {
  const section = sections.find(s => s.id === "certifications");
  if (!section) return [];

  const certs: ParsedCV["certifications"] = [];
  const lines = section.content.split(/\r?\n/).filter(l => l.trim());

  for (const line of lines) {
    const trimmed = line.replace(/^[-•*·]\s*/, "").trim();
    if (!trimmed) continue;

    const yearMatch = trimmed.match(/(\d{4})/);

    // Try "Name — Issuer — Year" or "Name | Issuer | Year"
    const sepMatch = trimmed.match(/^(.+?)\s*[-–—|]\s*(.+?)\s*[-–—|]\s*(.+)$/);
    if (sepMatch) {
      certs.push({
        name: sepMatch[1].trim(),
        issuer: sepMatch[2].trim(),
        year: sepMatch[3].trim(),
      });
    } else {
      // Try "Name — Issuer" (year in same line)
      const simpleMatch = trimmed.match(/^(.+?)\s*[-–—|]\s*(.+)$/);
      if (simpleMatch) {
        const second = simpleMatch[2].trim();
        const yearInSecond = second.match(/(\d{4})/);
        certs.push({
          name: simpleMatch[1].trim(),
          issuer: yearInSecond ? second.replace(/\d{4}/, "").trim() : second,
          year: yearInSecond ? yearInSecond[1] : (yearMatch ? yearMatch[1] : ""),
        });
      } else {
        certs.push({
          name: trimmed,
          issuer: "",
          year: yearMatch ? yearMatch[1] : "",
        });
      }
    }
  }

  return certs.slice(0, 20);
}

// ─── Awards Extraction ───

function extractAwards(sections: SectionContent[]): ParsedCV["awards"] {
  const section = sections.find(s => s.id === "awards");
  if (!section) return [];

  const awards: ParsedCV["awards"] = [];
  const lines = section.content.split(/\r?\n/).filter(l => l.trim());

  for (const line of lines) {
    const trimmed = line.replace(/^[-•*·]\s*/, "").trim();
    if (!trimmed) continue;

    const yearMatch = trimmed.match(/(\d{4})/);
    const sepMatch = trimmed.match(/^(.+?)\s*[-–—|]\s*(.+?)\s*[-–—|]\s*(.+)$/);

    if (sepMatch) {
      awards.push({
        title: sepMatch[1].trim(),
        issuer: sepMatch[2].trim(),
        year: sepMatch[3].trim(),
      });
    } else {
      const simpleMatch = trimmed.match(/^(.+?)\s*[-–—|]\s*(.+)$/);
      if (simpleMatch) {
        awards.push({
          title: simpleMatch[1].trim(),
          issuer: simpleMatch[2].trim(),
          year: yearMatch ? yearMatch[1] : "",
        });
      } else {
        awards.push({
          title: trimmed,
          issuer: "",
          year: yearMatch ? yearMatch[1] : "",
        });
      }
    }
  }

  return awards.slice(0, 20);
}

// ─── Research Extraction ───

function extractResearch(sections: SectionContent[]): ParsedCV["research"] {
  const section = sections.find(s => s.id === "research");
  if (!section) return [];

  const papers: ParsedCV["research"] = [];
  const blocks = section.content.split(/\r?\n\s*\r?\n/).filter(Boolean);

  for (const block of blocks) {
    const lines = block.split(/\r?\n/).filter(l => l.trim());
    if (lines.length === 0) continue;

    const firstLine = lines[0].replace(/^[-•*·]\s*/, "").trim();
    const yearMatch = firstLine.match(/(\d{4})/);

    let title = firstLine;
    let publisher = "";
    let year = yearMatch ? yearMatch[1] : "";
    let description = "";

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].replace(/^[-•*·]\s*/, "").trim();
      if (!line) continue;

      const lower = line.toLowerCase();
      if (lower.includes("journal") || lower.includes("conference") || lower.includes("publisher") || lower.includes("university")) {
        publisher = line;
      } else {
        description += (description ? " " : "") + line;
      }
    }

    papers.push({ title, publisher, year, description });
  }

  return papers.slice(0, 20);
}

// ─── Volunteering Extraction ───

function extractVolunteering(sections: SectionContent[]): ParsedCV["volunteering"] {
  const section = sections.find(s => s.id === "volunteering");
  if (!section) return [];

  const entries: ParsedCV["volunteering"] = [];
  const blocks = section.content.split(/\r?\n\s*\r?\n/).filter(Boolean);

  for (const block of blocks) {
    const lines = block.split(/\r?\n/).filter(l => l.trim());
    if (lines.length === 0) continue;

    const firstLine = lines[0].replace(/^[-•*·]\s*/, "").trim();

    let organization = firstLine;
    let role = "";
    let duration = "";
    let responsibilities = "";

    const datePattern = /(\d{4}|\w+ \d{4}|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s*\d{0,4})/i;
    const dashMatch = firstLine.match(/^(.+?)\s*[-–—|]\s*(.+)$/);

    if (dashMatch) {
      const secondPart = dashMatch[2].trim();
      if (datePattern.test(secondPart)) {
        organization = dashMatch[1].trim();
        duration = secondPart;
      } else {
        organization = dashMatch[1].trim();
        role = secondPart;
      }
    }

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].replace(/^[-•*·]\s*/, "").trim();
      if (!line) continue;

      if (datePattern.test(line) && !duration) {
        duration = line;
      } else if (!role && line.length < 60) {
        role = line;
      } else {
        responsibilities += (responsibilities ? "\n" : "") + line;
      }
    }

    entries.push({ organization, role, duration, responsibilities });
  }

  return entries.slice(0, 20);
}

// ─── Languages Extraction ───

function extractLanguages(sections: SectionContent[]): ParsedCV["languages"] {
  const section = sections.find(s => s.id === "languages");
  if (!section) return [];

  const langs: ParsedCV["languages"] = [];
  const content = section.content;

  // First, split by bullet markers to handle blob text like "• English – Proficient  • Swahili – Native"
  const items = content.split(/[•]/).map(s => s.trim()).filter(Boolean);

  for (const item of items) {
    // Try various formats: "English — Fluent", "English: Native", "English (Fluent)"
    const match = item.match(/^(.+?)\s*[-–—|:]\s*(.+)$/);
    if (match) {
      langs.push({
        language: match[1].trim(),
        proficiency: match[2].trim(),
      });
    } else if (item.length < 40) {
      langs.push({ language: item, proficiency: "" });
    }
  }

  // Fallback: try line-by-line if no items found
  if (langs.length === 0) {
    const lines = content.split(/\r?\n/).filter(l => l.trim());
    for (const line of lines) {
      const trimmed = line.replace(/^[-•*·]\s*/, "").trim();
      if (!trimmed) continue;
      const match = trimmed.match(/^(.+?)\s*[-–—|:]\s*(.+)$/);
      if (match) {
        langs.push({ language: match[1].trim(), proficiency: match[2].trim() });
      } else if (trimmed.length < 40) {
        langs.push({ language: trimmed, proficiency: "" });
      }
    }
  }

  return langs.slice(0, 20);
}

// ─── Interests Extraction ───

function extractInterests(sections: SectionContent[]): string[] {
  const section = sections.find(s => s.id === "interests");
  if (!section) return [];

  const interests: string[] = [];
  const content = section.content;

  // Try comma, semicolon, pipe separated
  const parts = content.split(/[,;•|]/).map(s => s.trim().replace(/^[-•*·]\s*/, "")).filter(Boolean);
  for (const part of parts) {
    if (part.length > 0 && part.length < 60) {
      interests.push(part);
    }
  }

  // Also try line-by-line
  if (interests.length <= 1) {
    const lines = content.split(/\r?\n/).filter(l => l.trim());
    for (const line of lines) {
      const trimmed = line.replace(/^[-•*·]\s*/, "").trim();
      if (trimmed.length > 0 && trimmed.length < 60) {
        interests.push(trimmed);
      }
    }
  }

  return interests.slice(0, 30);
}

// ─── Main Parser ───

export function parseCVManual(rawText: string): ParsedCV {
  const sections = splitIntoSections(rawText);

  // Filter out skip-only sections from the sections array
  const activeSections = sections.filter(s => s.active !== "skip-only");

  const contact = extractContact(activeSections, rawText);

  return {
    summary: extractSummary(activeSections),
    skills: extractSkills(activeSections),
    strengths: extractStrengths(activeSections),
    experience: extractExperience(activeSections),
    projects: extractProjects(activeSections),
    education: extractEducation(activeSections),
    certifications: extractCertifications(activeSections),
    awards: extractAwards(activeSections),
    research: extractResearch(activeSections),
    volunteering: extractVolunteering(activeSections),
    languages: extractLanguages(activeSections),
    interests: extractInterests(activeSections),
    phone: contact.phone,
    email: contact.email,
    location: contact.location,
    linkedin: contact.linkedin,
    portfolio: contact.portfolio,
  };
}
