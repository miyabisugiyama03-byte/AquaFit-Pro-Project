import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/api';
import { CourseForm } from '../components/CourseForm';

interface CourseFormData {
    title: string;
    description: string;
    capacity: number;
}

export function EditCourse() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState<CourseFormData | null>(null);

    useEffect(() => {
        api.get(`/courses/${id}`).then((res) => {
            const c = res.data;

            setCourse({
                title: c.title,
                description: c.description || '',
                capacity: c.capacity,
            });
        });
    }, [id]);

    const handleUpdate = async (data: CourseFormData) => {
        await api.patch(`/courses/${id}`, data);
        navigate('/courses');
    };

    if (!course) return <div className="p-10">Loading...</div>;

    return (
        <div className="max-w-md mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-4">Edit Course</h1>
            <CourseForm initialData={course} onSubmit={handleUpdate} />
        </div>
    );
}