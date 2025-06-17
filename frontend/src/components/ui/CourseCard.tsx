// CourseCard.tsx
import { Link } from "react-router-dom";
import { Star } from "lucide-react";

interface CourseCardProps {
  id: string;
  title: string;
  instructor: string;
  image: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  modules: number;
  rating: number;
  students: number;
  featured: boolean;
}

const CourseCard = ({
  id,
  title,
  instructor,
  image,
  category,
  level,
  duration,
  modules,
  rating,
  students,
  featured,
}: CourseCardProps) => {
  return (
    <Link to={`/course/${id}`} className="block">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <img src={image} alt={title} className="w-full h-48 object-cover" />
        <div className="p-4">
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
          <p className="text-sm text-slate-600 mt-1">Instructor: {instructor}</p>
          <div className="flex gap-2 text-sm text-slate-500 mt-2">
            <span>{category}</span>
            <span>·</span>
            <span>{level}</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-slate-600">{rating} ({students.toLocaleString()} students)</span>
          </div>
          <p className="text-sm text-slate-500 mt-2">Duration: {duration} | {modules} Modules</p>
          {featured && <span className="text-sm text-odl-primary mt-2 inline-block">Featured</span>}
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;