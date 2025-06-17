export interface Video {
    title: string;
    duration: string;
    order: number;
  }
  
  export interface Topic {
    title: string;
    order: number;
    videos: Video[];
  }
  
  export interface Module {
    title: string;
    order: number;
    topics: Topic[];
  }
  
  export interface Course {
    course_id?: string;
    course_title: string;
    course_description: string;
    course_duration: string;
    course_mode: string;
    course_tools: string;
    course_for: string;
    course_status: 'active' | 'inactive';
    course_image?: string;
    modules: Module[];
  }