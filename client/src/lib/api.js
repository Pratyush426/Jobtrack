export const fetchApplications = async () => {
    try {
        const response = await fetch('/api/all');
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error('API Error:', error);
        return [];
    }
};
