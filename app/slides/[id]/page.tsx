import { SingleSlide } from "@/components/presentation";
const slideIds = ["cover", "contents", "why", "overview", "assist-tasks", "exciting", "challenge", "showcase", "conclusion", "future", "thank-you"];
export function generateStaticParams() { return slideIds.map(id => ({ id })); }
export default async function SlidePage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <SingleSlide id={id} />; }
