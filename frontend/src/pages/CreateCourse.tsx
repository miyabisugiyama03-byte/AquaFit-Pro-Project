import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { CourseForm } from '../components/CourseForm';

export function CreateCourse() {
    const navigate = useNavigate();

    const handleCreate = async (data: any) => {
        await api.post('/courses', data);
        navigate('/courses');
    };

    return (
        <div className="max-w-md mx-auto mt-10">
        <h1 className="text-2xl font-bold mb-4">Create Course</h1>
    <CourseForm onSubmit={handleCreate} />
    </div>
);
}