import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import getData from '@/utils/getData';
import { Job } from '@/types/job';

export default function JobDetailPage() {
  const router = useRouter();
  const { slug } = router.query;

  const { data: job, isLoading } = useQuery<Job>({
    queryKey: ['job', slug],
    queryFn: async () => {
      if (!slug) return null; // Handle case where slug is not available
      return getData<Job>(`jobs/slug/${slug}`);
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!job) {
    return <div>Job not found</div>;
  }

  return (
    <div className="p-6 border rounded-lg bg-white">
      <h2 className="text-2xl font-bold">{job.title}</h2>
      <p className="text-gray-600">{job.description}</p>
      <p className="text-gray-500">Location: {job.location}</p>
      <p className="text-gray-500">Employment Type: {job.employmentType}</p>
      <p className="text-gray-500">Department: {job.department}</p>
      <p className="text-gray-500">Salary: {job.salary}</p>
      <p className="text-gray-500">Posted on: {new Date(job.createdAt).toLocaleDateString()}</p>
      {/* Add more details as needed */}
    </div>
  );
} 