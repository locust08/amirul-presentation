"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import {
  ArrowUpRight, Bot, BrainCircuit, BriefcaseBusiness, Check, ChevronLeft, ChevronRight,
  CirclePlay, Code2, Compass, GraduationCap, HeartHandshake, Lightbulb,
  LineChart, MonitorSmartphone, Rocket, ShoppingBag,
  Sparkles, Target, UserRound, WandSparkles, X,
} from "lucide-react";
import { Card } from "./ui/card";
import { cn } from "./utils";

type Icon = typeof Target;
type Slide = { id: string; title: string; element: ReactNode };
type ProjectTool = { label: string; href: string };
type Project = {
  id: string; number: string; title: string; eyebrow: string; icon: Icon; image: string; imageAlt: string;
  url: string; goal: string; role: string; deliverable: string; showTell: string; trailer: string; trailerVideo?: string; tags: string[]; tools?: ProjectTool[];
};

const projects: Project[] = [
  {
    id: "puma", number: "01", title: "Puma Landing Page", eyebrow: "Website redesign", icon: MonitorSmartphone,
    image: "/assets/showcase-web-01.png", imageAlt: "Puma landing page project preview", url: "https://puma-lp.vercel.app/",
    goal: "Turn design research into a polished, mobile-friendly campaign landing page.",
    role: "Researched the layout direction, built responsive sections with Codex, and tested the user journey before deployment.",
    deliverable: "A live Vercel landing page with a clear hero, content flow and call to action.",
    showTell: "Open the live page and trace the visitor journey from the hero section to the main call to action.",
    trailer: "A bold landing-page concept, from research to a live responsive experience.", trailerVideo: "/assets/puma-trailer.mp4", tags: ["Stitch", "ShadCN Studio", "Vercel"],
    tools: [{ label: "Stitch", href: "https://stitch.withgoogle.com/?pli=1" }, { label: "ShadCN Studio", href: "https://shadcnstudio.com/blocks" }],
  },
  {
    id: "originote", number: "02", title: "The Originote Landing Page", eyebrow: "Website redesign", icon: WandSparkles,
    image: "/assets/showcase-web-02.png", imageAlt: "The Originote landing page project preview", url: "https://theoriginote1.vercel.app/",
    goal: "Create a cleaner, more engaging product-story landing page with stronger visual hierarchy.",
    role: "Explored AI-assisted design directions, translated the selected structure into code, and refined the responsive layout.",
    deliverable: "A deployed landing page that presents the brand and its key actions in a more modern flow.",
    showTell: "Compare the visual hierarchy from the first impression through the product and CTA sections.",
    trailer: "A beauty-inspired page rebuilt around clarity, rhythm and a stronger first impression.", trailerVideo: "/assets/originote-trailer.mp4", tags: ["Stitch", "ShadCN Studio", "Vercel"],
    tools: [{ label: "Stitch", href: "https://stitch.withgoogle.com/?pli=1" }, { label: "ShadCN Studio", href: "https://shadcnstudio.com/blocks" }],
  },
  {
    id: "ptti", number: "03", title: "PTTI Landing Page", eyebrow: "Website redesign", icon: GraduationCap,
    image: "/assets/showcase-web-03.png", imageAlt: "PTTI landing page project preview", url: "https://ptti.vercel.app/",
    goal: "Make information easier to scan and guide prospective visitors toward the next step.",
    role: "Improved content structure, developed the responsive interface, and checked the experience across screen sizes.",
    deliverable: "A live responsive page with a clear information path and conversion-focused calls to action.",
    showTell: "Show how the page moves a visitor from an overview to the most important action.",
    trailer: "An information-heavy page reshaped into a clearer, more focused visitor journey.", trailerVideo: "/assets/ptti-trailer.mp4", tags: ["Stitch", "ShadCN Studio", "Vercel"],
    tools: [{ label: "Stitch", href: "https://stitch.withgoogle.com/?pli=1" }, { label: "ShadCN Studio", href: "https://shadcnstudio.com/blocks" }],
  },
  {
    id: "dashboard", number: "04", title: "LOCUS-T Ads Dashboard", eyebrow: "Reporting workflow", icon: LineChart,
    image: "/assets/showcase-dashboard.png", imageAlt: "LOCUS-T Ads Dashboard preview", url: "https://automated-report-iota.vercel.app/",
    goal: "Create a clearer reporting alternative for Google Ads and Meta Ads campaign review.",
    role: "Helped redesign the dashboard flow, organise reporting sections, and connect AI-assisted reporting workflows.",
    deliverable: "A live dashboard for monthly reports, campaign review, media-plan generation and PDF-ready reporting.",
    showTell: "Open a report view, point out how campaign information is organised, then show the automation workflow below.",
    trailer: "From manual reporting to a clearer campaign-review workflow with room for automation.", tags: ["OpenAI Platform", "Google Ads", "Meta Ads"],
    tools: [{ label: "OpenAI Platform", href: "https://platform.openai.com/chat/edit?prompt=pmpt_6a2a1ad15e148190af2a58292b6e6186085ff75e3c6e2cf6&version=2" }],
  },
  {
    id: "clef", number: "05", title: "Clef E-commerce Website", eyebrow: "Final internship project", icon: ShoppingBag,
    image: "/assets/showcase-clef.png", imageAlt: "Clef e-commerce website preview", url: "https://clef-ecommerce.easondev.workers.dev/",
    goal: "Understand how a storefront, editable content and e-commerce backend connect as one complete product.",
    role: "Structured the storefront with Shuffle, explored Payload CMS and MedusaJS, and planned the product-to-checkout flow.",
    deliverable: "An e-commerce concept with storefront screens, editable CMS content and a mapped commerce workflow.",
    showTell: "Walk through the storefront screenshot, then explain how content, product data, cart and checkout connect.",
    trailer: "A final project that connected design, CMS content and commerce thinking in one storefront.", tags: ["Shuffle", "Payload CMS", "MedusaJS", "Aiven – Valkey"],
    tools: [{ label: "Shuffle", href: "https://shuffle.dev/editor?project=6fb48a03fbf8bf9e36f18c917c673f67c9eac42d" }, { label: "Payload CMS", href: "https://clef-payload-preview.easondev.workers.dev/clef-login?redirect=%2Fadmin" }, { label: "MedusaJS", href: "https://clef-medusa.easondev.workers.dev/app/products" }, { label: "Aiven – Valkey", href: "https://console.aiven.io/account/a5ce7b6a3a00/project/clefproject2026/services/clef-medusa-valkey/overview" }],
  },
];

const overviewProjects: Project[] = projects;

const navItems = [
  { number: "01", target: "why", label: "Opening", title: "Why DigitalBee", description: "My starting point, expectations and the internship journey ahead." },
  { number: "02", target: "overview", label: "Project framing", title: "The project overview", description: "Five practical builds, the role I played and the intended outcomes." },
  { number: "03", target: "project-puma", label: "Live showcase", title: "Five projects in action", description: "Puma, Originote, PTTI, Ads Dashboard and Clef." },
  { number: "04", target: "exciting", label: "Reflection", title: "Growth through challenges", description: "The moments, pressure and practical process that moved me forward." },
  { number: "05", target: "conclusion", label: "Closing", title: "What I take forward", description: "My human strengths, final video and an open Q&A." },
];

export function AccentShape({ variant = "right" }: { variant?: "right" | "cover" }) {
  return <div aria-hidden className={cn("accent-shape", variant)}><i /><b /></div>;
}

export function SlideShell({ children, number, className }: { children: ReactNode; number?: string; className?: string }) {
  return <main className={cn("slide-shell", "refresh-slide", number && `accent-${number}`, className)}><AccentShape variant={number === "00" ? "cover" : "right"} /><div className="grain" /><div className="slide-glow" aria-hidden />{children}</main>;
}

function Title({ children }: { children: ReactNode }) { return <><h1 className="slide-title">{children}</h1><div className="title-rule"><i /></div></>; }
function Section({ number, label }: { number: string; label: string }) {
  // Timings stay in speaker notes so the on-screen labels remain clean and reusable.
  const sectionLabel = label.split(/\s*·\s*/)[0].trim();
  return <div className="section-badge"><strong>{number}</strong><span>{sectionLabel}</span></div>;
}
function TagList({ tags, tools = [] }: { tags: string[]; tools?: ProjectTool[] }) { return <div className="refresh-tags">{tags.map(tag => { const tool = tools.find(item => item.label === tag); return tool ? <a className="project-tool-link" href={tool.href} key={tag} target="_blank" rel="noreferrer" aria-label={`Open ${tag}`}><span>{tag}</span><ArrowUpRight /></a> : <span key={tag}>{tag}</span>; })}</div>; }

function PresentationVideoModal({ onClose, label, title, source }: { onClose: () => void; label: string; title: string; source: string }) { return <div className="opening-trailer-modal" role="dialog" aria-modal="true" aria-label={label}><div className="opening-trailer-player"><button type="button" className="opening-trailer-close" onClick={onClose} aria-label={`Close ${label}`}><X /></button><div className="opening-trailer-label"><span>{label}</span><b>{title}</b></div><video controls autoPlay playsInline preload="metadata" aria-label={title}><source src={source} type="video/mp4" />Your browser does not support embedded video.</video></div></div>; }

function Cover() { const [isTrailerOpen, setTrailerOpen] = useState(false); return <SlideShell number="00" className="cover-slide"><div className="cover-brandbar"><Image src="/assets/locus-t-logo.webp" alt="LOCUS-T" width={250} height={64} priority /><span /><Image src="/assets/digitalbee-logo.png" alt="DigitalBee" width={262} height={72} priority /></div><div className="cover-ambient" aria-hidden><i /><b /><span /></div><div className="cover-copy"><p className="eyebrow">LOCUS-T × DigitalBee</p><h1>Final<br />Internship<br /><em>Presentation</em></h1><div className="gold-rule" /><div className="role"><BrainCircuit /><div><strong>AI Paid Media Intern</strong><span>My Internship Journey</span></div></div><button type="button" className="nameplate cover-trailer-trigger" onClick={() => setTrailerOpen(true)} aria-label="Play My Internship Journey opening trailer"><UserRound /><strong>Amirul Shahrul Bin M.Arsad</strong><ArrowUpRight /></button><div className="supervisors"><div><GraduationCap /><p><b>Academic Supervisor</b>Associate Professor Dr. Suzani Binti Mohamad Samuri</p></div><div><BriefcaseBusiness /><p><b>Industrial Supervisor</b>Leong Yi Sheng</p></div><div><LineChart /><p><b>Internship Period</b>23 Feb – 7 Aug 2026</p></div></div></div>{isTrailerOpen && <PresentationVideoModal onClose={() => setTrailerOpen(false)} label="Opening trailer" title="My Internship Journey" source="/assets/opening-trailer.mp4" />}</SlideShell>; }

function Contents({ onNavigate }: { onNavigate?: (id: string) => void }) { return <SlideShell number="01" className="contents-journey-slide"><section className="page-content refresh-contents"><Section number="01" label="Presentation map" /><Title>The story of my <em>growth</em></Title><p className="subtitle">From my first expectations to five real builds, the lessons they shaped and the direction I want to take next.</p><div className="refresh-nav-grid">{navItems.map((item, index) => <button type="button" key={item.number} className="refresh-nav-card" onClick={() => onNavigate?.(item.target)} aria-label={`Go to ${item.title}`} style={{ "--nav-delay": `${index * 105}ms` } as CSSProperties}><div className="refresh-nav-top"><b>{item.number}</b></div><div><small>{item.label}</small><h3>{item.title}</h3><p>{item.description}</p></div><i aria-hidden><ArrowUpRight /></i></button>)}</div></section></SlideShell>; }

function WhyDigitalBee() { const items = [[Target, "A place to learn by doing", "I wanted an internship where I could contribute to real digital work, not only observe it.", ["Hands-on work", "Real projects"]], [Sparkles, "AI in a real workflow", "I expected to explore how AI can support design, coding, reporting and problem-solving.", ["Design", "Coding", "Reporting"]], [Compass, "A stronger next step", "I came in hoping to become more confident with technical work, teamwork and practical decisions.", ["Technical skill", "Teamwork", "Confidence"]]] as const; return <SlideShell number="02" className="why-digitalbee-slide"><section className="page-content"><Section number="02" label="Opening · about 1 minute" /><Title>Why I chose <em>DigitalBee</em></Title><p className="subtitle refresh-intro">I saw DigitalBee as a place to turn curiosity about AI and digital work into hands-on experience.</p><div className="refresh-three-grid">{items.map(([Icon, heading, text, outcomes], index) => <Card className={cn("refresh-story-card", `story-card-${index + 1}`)} key={heading}><span className="story-card-index">0{index + 1}</span><span className="icon-disc"><Icon /></span><h3>{heading}</h3><p>{text}</p><div className="story-card-outcomes">{outcomes.map(outcome => <span key={outcome}>{outcome}</span>)}</div></Card>)}</div><div className="refresh-quote"><Sparkles /> <span>My expectation was simple: learn fast, contribute honestly and leave with work I could explain with confidence.</span></div></section></SlideShell>; }

function ProjectOverviewDetail({ project, onClose }: { project: Project; onClose: () => void }) { const Icon = project.icon; return <div className="overview-project-modal" role="dialog" aria-modal="true" aria-label={`${project.title} project details`}><article className="overview-project-detail"><button className="overview-detail-close" onClick={onClose} aria-label="Close project details"><X /></button><header><span>PROJECT {project.number}</span><p>{project.eyebrow}</p><h2>{project.title}</h2></header><div className="overview-detail-grid"><section><b>Goal</b><p>{project.goal}</p></section><section><b>My role</b><p>{project.role}</p></section><section><b>Delivered</b><p>{project.deliverable}</p></section></div><section className="overview-trailer"><div className={cn("overview-trailer-visual", !project.image && "overview-trailer-placeholder")}>{project.trailerVideo ? <video controls playsInline preload="metadata" poster={project.image}><source src={project.trailerVideo} type="video/mp4" />Your browser does not support embedded video.</video> : <>{project.image ? <Image src={project.image} alt={project.imageAlt} fill sizes="(max-width: 900px) 100vw, 50vw" /> : <Icon />}<span><CirclePlay /></span></>}</div><div><small>Video trailer</small><h3>{project.title}</h3><p>{project.trailer}</p></div></section></article></div>; }

function Overview({ selectedProject: controlledProject, onSelectedProjectChange }: { selectedProject?: Project | null; onSelectedProjectChange?: (project: Project | null) => void }) { const [uncontrolledProject, setUncontrolledProject] = useState<Project | null>(null); const isControlled = controlledProject !== undefined; const selectedProject = isControlled ? controlledProject : uncontrolledProject; const setSelectedProject = onSelectedProjectChange ?? setUncontrolledProject; return <SlideShell number="03" className="project-overview-slide"><section className="page-content"><Section number="03" label="Project overview · about 3–5 minutes" /><Title>Project <em>Overview</em></Title><p className="subtitle">Select a project to explore the work, contribution and intended result.</p><div className="overview-project-grid">{overviewProjects.map((project, index) => <button className="overview-project-card" key={project.id} onClick={() => setSelectedProject(project)} aria-label={`Open ${project.title} project details`} style={{ "--project-delay": `${index * 90}ms` } as CSSProperties}><h2>{project.title}</h2></button>)}</div></section>{selectedProject && <ProjectOverviewDetail project={selectedProject} onClose={() => setSelectedProject(null)} />}</SlideShell>; }

function ProjectShowcase({ project }: { project: Project }) { const Icon = project.icon; const projectImage = <Image src={project.image} alt={project.imageAlt} fill sizes="(max-width: 900px) 100vw, 55vw" priority />; return <SlideShell number={String(Number(project.number) + 4).padStart(2, "0")} className={cn("project-showcase-slide", `project-${project.id}-slide`)}><section className="page-content refresh-project"><Section number={project.number} label={`Project showcase · about 5 minutes`} /><div className="project-heading"><div><p className="eyebrow">{project.eyebrow}</p><Title>{project.title}</Title></div><span className="project-heading-icon"><Icon /></span></div><div className="project-showcase-grid"><div className={cn("project-visual", project.url && "project-visual-link")}>{project.url ? <a href={project.url} target="_blank" rel="noreferrer" aria-label={`Open the live ${project.title} website`}>{projectImage}<b>Open live website <ArrowUpRight /></b></a> : projectImage}<span>Key output</span></div><div className="project-story"><section><small>Goal</small><p>{project.goal}</p></section><section><small>My role</small><p>{project.role}</p></section><section><small>Delivered</small><p>{project.deliverable}</p></section><TagList tags={project.tags} tools={project.tools} /></div></div>{project.id === "dashboard" && <div className="dashboard-workflow"><Bot /><p><b>Supporting workflow:</b> AI-assisted media-plan generation, campaign-publishing support and report generation connect the dashboard to day-to-day paid media operations.</p></div>}{project.id === "clef" && <div className="dashboard-workflow"><ShoppingBag /><p><b>System connection:</b> Storefront experience → Payload CMS for editable content → MedusaJS for products, cart, checkout and order planning.</p></div>}</section></SlideShell>; }

function Exciting() { const highlights = [["Real deliverables", "Projects I could test, explain and improve."], ["Connected workflow", "Design, coding and reporting working together."], ["More confidence", "Ready to present the decisions behind my work."]] as const; return <SlideShell number="10" className="exciting-slide"><section className="page-content"><Section number="09" label="Reflection · about 2 minutes" /><Title>My most exciting <em>moment</em></Title><div className="refresh-exciting-hero"><div><span className="icon-disc"><Rocket /></span><p className="eyebrow">The turning point</p><h2>Turning learning into real work</h2><p>The best part was seeing ideas become websites, a dashboard and a full e-commerce concept that I could actually demonstrate.</p></div><div className="refresh-highlight-list">{highlights.map(([title, description], index) => <div key={title}><span>0{index + 1}</span><Check /><p><b>{title}</b><small>{description}</small></p></div>)}</div></div></section></SlideShell>; }

function MemoriesVideo() { return <SlideShell number="14" className="memories-video-slide"><section className="page-content memories-video-content"><Section number="14" label="Closing video" /><div className="memories-video-layout"><header className="memories-video-copy"><div><p className="eyebrow">My internship &amp; my future</p><h1>Moments I&apos;ll <em>remember.</em></h1></div><div className="memories-video-note"><p>A final look back at the people, projects and progress that shaped my internship journey—and the future I want to keep building.</p><span><Sparkles /> Final memory reel · click play</span></div></header><div className="memories-video-frame memories-video-player" role="group" aria-label="Amirul internship closing video"><video controls playsInline preload="metadata" aria-label="Amirul final internship closing video"><source src="/assets/amirul-final-video.mp4" type="video/mp4" />Your browser does not support embedded video.</video></div></div></section></SlideShell>; }

const challenges = [
  { number: "01", icon: Code2, eyebrow: "Learning while delivering", title: "Working with unfamiliar tools while trying to produce work that was useful, clear and dependable.", detail: "I felt pressure and uncertainty when a new platform, technical issue or reporting task did not work immediately. It mattered because I wanted my contribution to be accurate—not just finished quickly.", tags: ["New platforms", "Technical problems", "Real deadlines"] },
  { number: "02", icon: MonitorSmartphone, eyebrow: "Design into a real experience", title: "Turning an AI-assisted design direction into a page that stayed clear, responsive and easy to use.", detail: "I had to balance visual ideas with practical code, then test each section across screen sizes. I worried that a page could look good in one view but lose clarity for a real visitor.", tags: ["Design-to-code", "Responsive testing", "User flow"] },
  { number: "03", icon: Bot, eyebrow: "Connecting the moving parts", title: "Understanding how reporting data, CMS content and e-commerce workflows need to connect.", detail: "The dashboard and Clef projects introduced more dependencies than a single webpage. I had to learn how information moves between tools while keeping the workflow accurate and explainable.", tags: ["Data flow", "CMS & backend", "Accuracy"] },
] as const;

function Challenge({ activeIndex = 0 }: { activeIndex?: number }) { const challenge = challenges[activeIndex]; const Icon = challenge.icon; return <SlideShell number="12" className="challenge-slide"><section className="page-content"><Section number="11" label="Reflection · about 1–2 minutes" /><Title>The biggest <em>challenges</em></Title><div key={challenge.number} className={cn("challenge-story", `challenge-scene-${challenge.number}`)}><div className="challenge-visual"><Icon /><span>{challenge.number}</span></div><div><p className="eyebrow">{challenge.eyebrow}</p><h2>{challenge.title}</h2><p>{challenge.detail}</p><div className="challenge-tags">{challenge.tags.map(tag => <span key={tag}>{tag}</span>)}</div><div className="challenge-progress" aria-label={`Challenge ${activeIndex + 1} of ${challenges.length}`}>{challenges.map((item, index) => <i key={item.number} className={index === activeIndex ? "active" : ""} />)}<small>{challenge.number} / 03 · Press Next to continue</small></div></div></div></section></SlideShell>; }

function Overcoming() { const steps = [[Compass, "Break it down", "I turned a large problem into smaller tasks I could test one by one."], [HeartHandshake, "Ask and learn", "I used research, feedback and guidance instead of staying stuck alone."], [Check, "Test and improve", "I checked the result carefully, then refined it until the workflow made sense."]] as const; return <SlideShell number="13" className="overcoming-slide"><section className="page-content"><Section number="12" label="Reflection · about 1–2 minutes" /><Title>How I <em>overcame</em> it</Title><p className="subtitle">The breakthrough was not one perfect answer—it was learning to move forward with a practical process.</p><div className="overcome-process">{steps.map(([Icon, title, text], index) => <Card className="refresh-overcome-card overcome-step" key={title} style={{ "--step-delay": `${index * 140}ms` } as CSSProperties}><span className="overcome-step-orbit" aria-hidden /><b>0{index + 1}</b><span className="icon-disc"><Icon /></span><p className="overcome-step-label">Practical step</p><h3>{title}</h3><p>{text}</p></Card>)}</div><div className="overcome-result"><span className="overcome-result-icon"><ArrowUpRight /></span><p>Overcoming that challenge made me <b>more adaptable, more confident</b> and more willing to learn in public.</p><div><span>Adaptable</span><span>Confident</span><span>Curious</span></div></div></section></SlideShell>; }

function HumanDifferenceCard({ Icon, title, text, image, imageAlt }: { Icon: Icon; title: string; text: string; image: string; imageAlt: string }) { const [open, setOpen] = useState(false); return <button type="button" className={cn("human-difference-card", open && "is-open")} onClick={() => setOpen(value => !value)} aria-pressed={open} aria-label={`${open ? "Hide" : "Show"} ${title} details`}><Image src={image} alt={imageAlt} fill sizes="(max-width: 800px) 100vw, 50vw" /><span className="human-card-overlay"><span className="icon-disc"><Icon /></span><span className="human-card-eyebrow">The human difference</span><strong>{title}</strong><span className="human-card-copy">{text}</span><small>Click to {open ? "hide" : "keep open"}</small></span></button>; }

function Conclusion() { const points = [[UserRound, "Human judgment", "AI can generate options; I decide what fits the real goal, audience and situation.", "/assets/human-judgment.png", "A judge examining a decision with a magnifying glass"], [HeartHandshake, "Empathy & communication", "I can listen, explain, collaborate and build trust with people.", "/assets/empathy-communication.png", "Two people having a thoughtful conversation"]] as const; return <SlideShell number="14" className="conclusion-human-slide"><section className="page-content"><Section number="13" label="Conclusion & reflection · about 2 minutes" /><Title>What makes me<br />different from <em>AI?</em></Title><p className="subtitle refresh-intro">AI can accelerate my work. My value is how I bring human judgment, empathy and continuous learning to it.</p><div className="human-difference-grid">{points.map(([Icon, title, text, image, imageAlt]) => <HumanDifferenceCard Icon={Icon} title={title} text={text} image={image} imageAlt={imageAlt} key={title} />)}</div><div className="advice-strip"><Lightbulb /><div><b>My advice to future junior interns</b><span>Be curious, show your work, ask questions early and treat every challenge as a chance to build confidence.</span></div></div></section></SlideShell>; }

function QandA() { const [isThankYouVideoOpen, setThankYouVideoOpen] = useState(false); return <SlideShell number="15" className="qna-slide"><section className="page-content qna-content"><p className="eyebrow">Questions &amp; discussion</p><h1>Let&apos;s talk about<br /><em>the work.</em></h1><p>Ask me about the projects, tools, decisions, challenges or what I want to build next.</p><button type="button" className="qna-thankyou" onClick={() => setThankYouVideoOpen(true)} aria-label="Play thank you video"><span>Thank you</span><b>Amirul Shahrul Bin M.Arsad</b><small>AI Paid Media Intern · LOCUS-T × DigitalBee</small></button></section>{isThankYouVideoOpen && <PresentationVideoModal onClose={() => setThankYouVideoOpen(false)} label="Thank you video" title="Thank you for watching" source="/assets/thank-you-video.mp4" />}</SlideShell>; }

const slides: Slide[] = [
  { id: "cover", title: "Cover", element: <Cover /> }, { id: "contents", title: "Story", element: <Contents /> }, { id: "why", title: "Why DigitalBee", element: <WhyDigitalBee /> }, { id: "overview", title: "Project overview", element: <Overview /> },
  ...projects.map(project => ({ id: `project-${project.id}`, title: project.title, element: <ProjectShowcase project={project} /> })),
  { id: "exciting", title: "Exciting moment", element: <Exciting /> }, { id: "challenge", title: "Challenge", element: <Challenge /> }, { id: "overcoming", title: "Overcoming", element: <Overcoming /> }, { id: "conclusion", title: "Conclusion", element: <Conclusion /> }, { id: "memories", title: "Closing video", element: <MemoriesVideo /> }, { id: "qna", title: "Q&A", element: <QandA /> },
];

export const slideIds = slides.map(slide => slide.id);
export function getSlide(id: string) { return slides.find(slide => slide.id === id) ?? slides[0]; }
export function SlideViewport({ children }: { children: ReactNode }) { return <div className="slide-viewport"><div className="slide-viewport-canvas">{children}</div></div>; }
export function SingleSlide({ id }: { id: string }) { return <SlideViewport>{getSlide(id).element}</SlideViewport>; }

export function SlideViewer({ initialId = "cover" }: { initialId?: string }) {
  const [index, setIndex] = useState(Math.max(0, slides.findIndex(slide => slide.id === initialId)));
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [overviewProjectIndex, setOverviewProjectIndex] = useState<number | null>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const slide = slides[index];
  const goTo = (nextIndex: number) => { setIndex(Math.max(0, Math.min(nextIndex, slides.length - 1))); setChallengeIndex(0); setOverviewProjectIndex(null); };
  const next = () => { if (slide.id === "overview" && overviewProjectIndex !== null && overviewProjectIndex < overviewProjects.length - 1) { setOverviewProjectIndex(value => value === null ? null : value + 1); return; } if (slide.id === "challenge" && challengeIndex < challenges.length - 1) { setChallengeIndex(value => value + 1); return; } goTo(index + 1); };
  const previous = () => { if (slide.id === "overview" && overviewProjectIndex !== null) { if (overviewProjectIndex > 0) setOverviewProjectIndex(value => value === null ? null : value - 1); else setOverviewProjectIndex(null); return; } if (slide.id === "challenge" && challengeIndex > 0) { setChallengeIndex(value => value - 1); return; } goTo(index - 1); };
  useEffect(() => { const key = (event: KeyboardEvent) => { const target = event.target as HTMLElement; if (target.closest("input,textarea,select,[contenteditable=true]")) return; if (event.key === "f" || event.key === "F") { if (document.fullscreenElement) document.exitFullscreen(); else viewerRef.current?.requestFullscreen?.(); return; } if (event.key === "Escape" && document.fullscreenElement) { document.exitFullscreen(); return; } if (event.key === "Home") { event.preventDefault(); goTo(0); return; } if (event.key === "End") { event.preventDefault(); goTo(slides.length - 1); return; } if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") { event.preventDefault(); next(); return; } if (event.key === "ArrowLeft" || event.key === "PageUp") { event.preventDefault(); previous(); } }; addEventListener("keydown", key); return () => removeEventListener("keydown", key); }, [index, challengeIndex, overviewProjectIndex, slide.id]);
  const canvas = slide.id === "contents" ? <Contents onNavigate={id => { const targetIndex = slides.findIndex(item => item.id === id); if (targetIndex >= 0) goTo(targetIndex); }} /> : slide.id === "challenge" ? <Challenge activeIndex={challengeIndex} /> : slide.id === "overview" ? <Overview selectedProject={overviewProjectIndex === null ? null : overviewProjects[overviewProjectIndex]} onSelectedProjectChange={project => setOverviewProjectIndex(project ? overviewProjects.findIndex(item => item.id === project.id) : null)} /> : slide.element;
  return <div className="viewer" ref={viewerRef}><div className="viewer-canvas">{canvas}<div className="viewer-meta"><b>{String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</b></div><div className="viewer-control-zone"><div className="viewer-controls"><button disabled={index === 0 && challengeIndex === 0} onClick={previous} aria-label="Previous slide"><ChevronLeft /></button><div>{slides.map((item, itemIndex) => <button key={item.id} onClick={() => goTo(itemIndex)} className={itemIndex === index ? "active" : ""} aria-label={item.title} />)}</div><button disabled={index === slides.length - 1} onClick={next} aria-label="Next slide"><ChevronRight /></button></div></div></div></div>;
}
