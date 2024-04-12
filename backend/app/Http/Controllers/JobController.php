<?php

namespace App\Http\Controllers;

use App\Models\Job;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Resources\JobResource;
use App\Http\Requests\JobRequest;
use Spatie\Activitylog\Models\Activity;

class JobController extends Controller
{
    /**
     * Create a new AuthController instance.

     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('JWT', ['except' => ['index', 'show']]);
    } 

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        if ($request->count == "total") {
            $total = Job::count();
            $job = Job::latest()->get();
            return response(["data" =>  JobResource::collection($job),"total" => $total], Response::HTTP_OK);
        }
        return JobResource::collection(Job::latest()->paginate($request->count));
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(JobRequest $request)
    {
        $job = Job::create($request->all());
        return response(['job' => new JobResource($job)], Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Job  $job
     * @return \Illuminate\Http\Response
     */
    public function show(Job $job)
    {
        return new JobResource($job);
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Job  $job
     * @return \Illuminate\Http\Response
     */
    public function update(JobRequest $request, Job $job)
    {
        $job->update([
            'title'=>$request->title, 
            'slug' => $request->slug,
            'technology' => $request->technology,
            'contract_type' => $request->contract_type,
            'experience_level' => $request->experience_level,
            'requirements' => $request->requirements,
            'company_name' => $request->company_name,
            'country' => $request->country,
            'city' => $request->city,
            'state' => $request->state,
            'remote' => $request->remote,
            'salary' => $request->price,
            'contact' => $request->contact,
            'website' => $request->website,
            'validity_date' => $request->validity_date
        ]);
        return response("Updated", Response::HTTP_ACCEPTED);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Job  $job
     * @return \Illuminate\Http\Response
     */
    public function destroy(Job $job)
    {
        $job->delete();
        return response(null, Response::HTTP_NO_CONTENT);
    }
}
