"use client"

interface JobFiltersProps {
  filters: {
    location: string;
    type: string;
    experience: string;
  };
  setFilters: (filters: any) => void;
}

export default function JobFilters({ filters, setFilters }: JobFiltersProps) {
  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg border">
      <div>
        <h3 className="text-lg font-semibold mb-4">Location</h3>
        <select
          value={filters.location}
          onChange={(e) => handleFilterChange('location', e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="">All Locations</option>
          <option value="remote">Remote</option>
          <option value="onsite">On-site</option>
          <option value="hybrid">Hybrid</option>
        </select>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Job Type</h3>
        <select
          value={filters.type}
          onChange={(e) => handleFilterChange('type', e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="">All Types</option>
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="contract">Contract</option>
          <option value="internship">Internship</option>
        </select>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Experience Level</h3>
        <select
          value={filters.experience}
          onChange={(e) => handleFilterChange('experience', e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="">All Levels</option>
          <option value="entry">Entry Level</option>
          <option value="mid">Mid Level</option>
          <option value="senior">Senior Level</option>
          <option value="lead">Lead</option>
        </select>
      </div>
    </div>
  );
} 