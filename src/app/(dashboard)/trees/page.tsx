import { TopicPageTemplate } from "@/components/TopicPageTemplate";
import { allProblems } from "@/data/problems";

export default function TreesPage() {
  const problems = allProblems.filter(p => p.topic.toLowerCase() === "trees");
  
  return (
    <TopicPageTemplate 
      title="Tree Data Structures" 
      description="Master BSTs, traversals, LCA, Segment Trees, and Tries."
      topic="Trees"
      problems={problems}
    />
  );
}
