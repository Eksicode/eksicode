<?php

namespace App\Http\Controllers;

use App\Models\Source;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Resources\SourceResource;
use Spatie\Activitylog\Models\Activity;

class SourceController extends Controller
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
            $total = Source::count();
            $source = Source::latest()->get();
            return response(["data" =>  SourceResource::collection($source),"total" => $total], Response::HTTP_OK);
        }
        return SourceResource::collection(Source::orderBy('id', 'asc')->paginate($request->count));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $source = Source::create($request->all());
        return response(['source' => new SourceResource($source)], Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Source  $source
     * @return \Illuminate\Http\Response
     */
    public function show(Source $source)
    {
        return new SourceResource($source);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Source  $source
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Source $source)
    {
        $source->update($request->all());
        return response(['source' => new SourceResource($source)], Response::HTTP_ACCEPTED);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Source  $source
     * @return \Illuminate\Http\Response
     */
    public function destroy(Source $source)
    {
        $source->delete();
        return response(null, Response::HTTP_NO_CONTENT);
    }
}
