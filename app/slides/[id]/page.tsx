import { SingleSlide } from "@/components/presentation";
const slideIds = ["cover", "contents", "why", "overview", "project-puma", "project-originote", "project-ptti", "project-dashboard", "project-clef", "exciting", "memories", "challenge", "overcoming", "conclusion", "closing", "qna"];
export function generateStaticParams() { return slideIds.map(id => ({ id })); }
export default async function SlidePage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <SingleSlide id={id} />; }
