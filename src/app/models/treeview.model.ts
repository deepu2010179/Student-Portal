export interface Course {
    id: number;
    name: string;
    classes?: Class[];
  }
  
  export interface Class {
    id: number;
    name: string;
    sections?: Section[];
    subjects?: Subject[];
  }
  
  export interface Section {
    id: number;
    name: string;
  }
  
  export interface Subject {
    id: number;
    name: string;
  }