"use client";
import React from "react";
import { Job } from "@/types/job";

interface JobDetailProps {
  job: Job;
}

function JobDetail({ job }: JobDetailProps) {
  return (
    <div className="p-6 border rounded-lg bg-white text-black dark:text-white  dark:bg-DarkerGrey dark:border-DarkLightGrey  ">
      {job.company.logo && (
        <img
          src={job.company.logo}
          alt={`${job.company.name} logo`}
          className="w-12 h-12 object-contain"
        />
      )}
      <p className="">Şirket: {job.company.name}</p>
      <h2 className="text-2xl font-bold">{job.title}</h2>
      <p className="">{job.description}</p>
      <p className="">Konumu: {job.location}</p>
      <p className="">Sözleşme Tipi: {job.employmentType}</p>
      <p className="">Bölümü: {job.department}</p>
      <p className="">Maaş: {job.salary}</p>
      <p className="">
        İlan Tarihi: {new Date(job.createdAt).toLocaleDateString()}
      </p>
      <p className="">
        Geçerlilik Tarihi: {new Date(job.validAt).toLocaleDateString()}
      </p>

      {/* Add more details as needed */}
    </div>
  );
}

export default JobDetail;
