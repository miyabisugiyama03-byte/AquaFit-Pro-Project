import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Define what the data looks like
interface Course {
  id: number;
  name: string;
  instructor: {
      id: string;
      email: string;
      role: string;
  }
  startDate: Date;
  capacity: number;
  description: string;
}

export const Courses = () => {
  // State to store the data we fetch
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // useEffect runs ONCE when the component loads
  useEffect(() => {
    axios.get('http://localhost:3000/courses')
      .then((response) => {
        console.log("Data received:", response.data); // Debugging check
        setCourses(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
        setLoading(false);
      });
  }, []); // Empty array [] means run only on mount

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">🏊 Available Courses</h1>
      
      <div className="grid gap-4">
        {courses.map((course) => (
          <div key={course.id} className="border p-4 rounded shadow bg-white hover:bg-blue-50 transition">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-gray-800">{course.name}</h2>
                <p className="text-sm text-gray-500 mb-1">Instructor: {course.instructor?.email}</p>
              </div>
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                {course.capacity} spots
              </span>
            </div>

            <p className="text-gray-700 mt-2">{course.description}</p>
            
            <div className="mt-4 flex items-center justify-between gap-4">
              <div className="text-sm text-gray-500 font-medium">Starts: {new Date(course.startDate).toLocaleDateString()}</div>
              <Link to={`/booking?courseId=${course.id}`} className="ml-auto px-3 py-1 rounded bg-gradient-to-r from-teal-400 to-sky-500 text-white text-sm font-medium">Book</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
