<?php

namespace App\Http\Controllers;

use App\Models\Page;
use Illuminate\Http\Request;
use App\Http\Resources\PageResource;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Requests\PageRequest;
use Illuminate\Support\Facades\Storage;

class PageController extends Controller
{
    /**
     * Create a new authcontroller instance.
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
            $total = Page::count();
            $page = Page::latest()->get();
            return response(["data" =>  PageResource::collection($page), "total" => $total], Response::HTTP_OK);
        }
        return PageResource::collection(Page::latest()->paginate($request->count));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(PageRequest $request)
    {
        $page = new Page;
        if ($request->hasFile('header_image')) {
            $file = $request->file('header_image');
            if ($file->isValid()) {
                $extension = $file->getClientOriginalExtension();
                $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
                $fileName = $originalName . "." . $extension;
                Storage::disk('s3')->put($fileName, file_get_contents($file), 'public');
                $path = "https://eksicode-images.s3.eu-central-1.amazonaws.com/".$fileName;
            }
        }
        $page->title = $request->title;
        $page->slug = $request->slug;
        $page->content = $request->content;
        $page->page_category = $request->page_category;
        $page->header_image = $path;
        $page->save();
        return response(['page' => new PageResource($page)], Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Page  $page
     * @return \Illuminate\Http\Response
     */
    public function show(Page $page)
    {
        return new PageResource($page);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Page  $page
     * @return \Illuminate\Http\Response
     */
    public function update(PageRequest $request, Page $page)
    {   
        if ($request->hasFile('header_image')) {
            $file = $request->file('header_image');
            if ($file->isValid()) {
                $extension = $file->getClientOriginalExtension();
                $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
                $fileName = $originalName  . "." . $extension;
                Storage::disk('s3')->put($fileName, file_get_contents($file), 'public');
                $path = "https://eksicode-images.s3.eu-central-1.amazonaws.com/".$fileName;
            }
        }

        $img = $page->header_image;
        if (isset($path)) {
            $img = $path;
        }
        

        $page->update([
            'title'=> $request->title,
            'slug' => $request->slug,
            'content' => $request->content,
            'page_category' => $request->page_category,
            'header_image' => $img
        ]);
        return response(['page' => new PageResource($page)], Response::HTTP_ACCEPTED);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Page  $page
     * @return \Illuminate\Http\Response
     */
    public function destroy(Page $page)
    {
        $page->delete();
        return response(null, Response::HTTP_NO_CONTENT);
    }
}
