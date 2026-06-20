import { TopicPageTemplate } from "@/components/TopicPageTemplate";
import { allProblems } from "@/data/problems";

export default function GraphsPage() {
  const problems = allProblems.filter(p => p.topic.toLowerCase() === "graphs");
  
  return (
    <TopicPageTemplate 
      title="Graph Algorithms" 
      description="Master graph traversals, shortest paths, MST, and topological sorting."
      topic="Graphs"
      problems={problems}
    />
  );
}
