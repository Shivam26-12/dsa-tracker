"use client";

import { TopicPageTemplate } from "@/components/TopicPageTemplate";
import { allProblems } from "@/data/problems";
import { useTrackerStore } from "@/store/useTrackerStore";

export default function FavoritesPage() {
  const { problemsData } = useTrackerStore();
  const problems = allProblems.filter(p => problemsData[p.id]?.favorite);
  
  return (
    <TopicPageTemplate 
      title="Favorites ⭐" 
      description="Your carefully curated list of favorite problems."
      topic="Favorites"
      problems={problems}
    />
  );
}
