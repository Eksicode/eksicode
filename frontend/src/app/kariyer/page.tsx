"use client";

import { useState, useEffect } from "react";
import JobCard from "@/components/jobs/JobCard";
import JobFilters from "@/components/jobs/JobFilters";
import SearchBar from "@/components/jobs/SearchBar";
import { useQuery } from "@tanstack/react-query";
import getData from "@/utils/getData";
import { Job } from "@/types/job";
import JobDetail from "@/components/jobs/jobDetail";
import LoadingAnimation from "@/components/Ui/LoadingAnimation";

interface Meta {
  total: number;
  skip: number;
  limit: number;
  currentPage: number;
  totalPages: number;
}

export default function JobsPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [filters, setFilters] = useState({
    location: "",
    type: "",
    experience: "",
  });

  const { data: jobsData, isLoading } = useQuery({
    queryKey: ["jobs", searchTerm, filters, page],
    queryFn: async () => {
      const pageSize = 10;
      const skip = (page - 1) * pageSize;
      return getData<Job, Meta>("jobs", false, pageSize, page, skip);
    },
  });

  const filteredJobs = jobsData?.data || [];
  const totalPages = jobsData?.meta?.totalPages || 0;

  useEffect(() => {
    if (filteredJobs.length > 0 && !selectedJob) {
      setSelectedJob(filteredJobs[0]);
    }
  }, [filteredJobs]);

  const handleJobSelect = (job: Job) => {
    setSelectedJob(job);
    window.scrollTo(0, 0);
  };

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-96">
          <LoadingAnimation style="text" />
        </div>
      ) : (
        <div className="flex py-5 basis-3/4">
          <div className="flex flex-nowrap w-1/3">
            <div className="flex flex-col md:flex-row ">
              <section className="flex flex-col">
                <div className="space-y-2">
                  {filteredJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      onSelect={handleJobSelect}
                      isSelected={selectedJob?.id === job.id}
                    />
                  ))}
                </div>
                <div className="mt-6 flex justify-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setPage(i + 1)}
                      className={`px-3 py-1 rounded ${
                        page === i + 1
                          ? "bg-eksiCodeMedium text-white"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </div>

          <div className="w-2/3 overflow-y-auto ml-4">
            {selectedJob && <JobDetail job={selectedJob} />}
          </div>
        </div>
      )}
    </>
  );
}
