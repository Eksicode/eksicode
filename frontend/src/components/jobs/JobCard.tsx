"use client";
import { Job } from "@/types/job";

interface JobCardProps {
  job: Job;
  onSelect: (job: Job) => void;
  isSelected: boolean;
}

export default function JobCard({ job, onSelect, isSelected }: JobCardProps) {
  return (
    <button onClick={() => onSelect(job)} className="w-full text-left">
      <div
        className={`p-2 border rounded-lg transition-shadow cursor-pointer bg-white text-black dark:text-white  dark:bg-DarkerGrey 
        ${isSelected ? "border-eksiCodeMedium shadow-lg " : "hover:shadow-lg dark:border-DarkLightGrey  "}`}
      >
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold ">{job.title}</h2>
            <p className="">{job.company.name}</p>
          </div>
          {job.company.logo && (
            <img
              src={job.company.logo}
              alt={`${job.company.name} logo`}
              className="w-12 h-12 object-contain"
            />
          )}
        </div>

        <div className="mt-2 flex flex-wrap gap-2">
          <span className="px-1 py-1 text-sm rounded-full">
            {job.location}
          </span>
          <span className="px-1 py-1 text-sm rounded-full">
            {job.type}
          </span>
          {job.remote && (
            <span className="px-1 py-1 bg-green-100 text-eksiCodeMedium text-sm rounded-full">
              Remote
            </span>
          )}
        </div>

        <div className="mt-2 flex justify-between items-center">
          <span className="text-sm text-gray-500"></span>
          <span className="text-sm font-medium text-eksiCodeMedium">
            Ayrıntılar →
          </span>
        </div>
      </div>
    </button>
  );
}
