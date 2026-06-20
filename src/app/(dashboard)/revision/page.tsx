"use client";

import { useState } from "react";
import { TopicPageTemplate } from "@/components/TopicPageTemplate";
import { allProblems } from "@/data/problems";
import { useTrackerStore } from "@/store/useTrackerStore";

export default function RevisionPage() {
  const { problemsData, incrementRevision } = useTrackerStore();
  
  // Problems that are either in the revision queue or have been revised before
  const problems = allProblems.filter(p => {
    const data = problemsData[p.id];
    return data?.inRevisionQueue || (data?.revisionCount ?? 0) > 0;
  });
  
  return (
    <TopicPageTemplate 
      title="Revision Queue 🔄" 
      description="Problems you've marked for review or have revised in the past."
      topic="Revision"
      problems={problems}
    />
  );
}
