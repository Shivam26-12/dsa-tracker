import { dpProblems } from './problems-dp';
import { graphProblems } from './problems-graphs';
import { treeProblems } from './problems-trees';
import { Problem } from './types';

export const allProblems: Problem[] = [
  ...dpProblems,
  ...graphProblems,
  ...treeProblems,
];
