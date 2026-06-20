import { TopicPageTemplate } from "@/components/TopicPageTemplate";
import { allProblems } from "@/data/problems";

export default function DPPage() {
  const problems = allProblems.filter(p => p.topic.toLowerCase() === "dynamic programming");
  
  return (
    <TopicPageTemplate 
      title="Dynamic Programming" 
      description="Master 1D DP, 2D DP, Knapsack, LIS, and state-space DP."
      topic="Dynamic Programming"
      problems={problems}
    />
  );
}
