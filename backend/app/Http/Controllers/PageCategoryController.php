<?php

namespace App\Http\Controllers;

use App\Models\PageCategory;
use Illuminate\Http\Request;
use App\Http\Resources\PageCategoryResource;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Requests\PageCategoryRequest;

class PageCategoryController extends Controller
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
    public function index()
    {
        return PageCategoryResource::collection(PageCategory::latest()->get());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(PageCategoryRequest $request)
    {
        PageCategory::create($request->all());
        return response('Created', Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\PageCategory  $pageCategory
     * @return \Illuminate\Http\Response
     */
    public function show(PageCategory $pageCategory)
    {
        return new PageCategoryResource($pageCategory);
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\PageCategory  $pageCategory
     * @return \Illuminate\Http\Response
     */
    public function update(PageCategoryRequest $request, PageCategory $pageCategory)
    {
        $pageCategory->update([
            'name'=>$request->name, 
            'slug' => Str::slug($request->name), 
            'main' => $request->main
        ]);
        return response("Updated", Response::HTTP_ACCEPTED);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\PageCategory  $pageCategory
     * @return \Illuminate\Http\Response
     */
    public function destroy(PageCategory $pageCategory)
    {
        $pageCategory->delete();
        return response(null, Response::HTTP_NO_CONTENT);
    }
}
