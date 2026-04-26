import { useState } from 'react';

interface Props {
    initialData?: {
        title: string;
        description: string;
        capacity: number;
    };
    onSubmit: (data: {
        title: string;
        description: string;
        capacity: number;
    }) => Promise<void>;
}

export function CourseForm({ initialData, onSubmit }: Props) {
    const [title, setTitle] = useState(initialData?.title || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [capacity, setCapacity] = useState(initialData?.capacity || 1);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (capacity < 1) {
            alert('Capacity must be at least 1');
            return;
        }

        setLoading(true);

        try {
            await onSubmit({ title, description, capacity });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                </label>
                <input
                    type="text"
                    placeholder="Enter course title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border p-2 rounded"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                </label>
                <textarea
                    placeholder="Enter course description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border p-2 rounded"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Capacity
                </label>
                <input
                    type="number"
                    min="1"
                    placeholder="Enter max number of participants"
                    value={capacity}
                    onChange={(e) => {
                        const value = Number(e.target.value);
                        if (value >= 1) setCapacity(value);
                    }}
                    className="w-full border p-2 rounded"
                    required
                />
                <p className="text-xs text-gray-500 mt-1">
                    Must be at least 1 participant
                </p>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
                {loading ? 'Saving...' : 'Save Course'}
            </button>
        </form>
    );
}