export interface CoursePartsProps {
    name: string;
    exerciseCount: number
}

/* Exercise 9.15. */
interface CoursePartBase {
  name: string;
  exerciseCount: number;
  type: string;
}

interface CoursePartWithDescription extends CoursePartBase {
  description: string;
}

interface CourseNormalPart extends CoursePartWithDescription {
  type: "normal";
}

interface CourseSubmissionPart extends CoursePartWithDescription {
  type: "submission";
  exerciseSubmissionLink: string;
}

interface CourseProjectPart extends CoursePartBase {
  type: "groupProject";
  groupProjectCount: number;
}

interface Spessu extends CoursePartWithDescription {
  type: "special";
  requirements: string[];
}




export type CoursePart =  CourseNormalPart | CourseProjectPart | CourseSubmissionPart | Spessu;