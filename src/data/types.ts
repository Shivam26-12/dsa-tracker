export type Problem = {
  id: number;
  title: string;
  link: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
  pattern: string;
  platform: string;
  description: string;
  tags: string[];
  recommendedOrder: number;
  estimatedTime: number;
};
