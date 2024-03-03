<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Resources\TagResource;
use App\Http\Requests\TagRequest;
use Illuminate\Support\Facades\DB;

class TagController extends Controller
{
    /**
     * Create a new AuthController instance.

     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('JWT', ['except' => ['index', 'show', 'totalCount']]);
    }


    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        if ($request->count == "total") {
            $total = Tag::count();
            $tag = Tag::latest()->get();
            return response(["data" =>  TagResource::collection($tag),"total" => $total], Response::HTTP_OK);
        }
        return TagResource::collection(Tag::latest()->paginate($request->count));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(TagRequest $request)
    {
        $tag = Tag::create($request->all());
        return response(['tag' => new TagResource($tag)], Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Tag  $tag
     * @return \Illuminate\Http\Response
     */
    public function show(Tag $tag)
    {
        return new TagResource($tag);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Tag  $tag
     * @return \Illuminate\Http\Response
     */
    public function update(TagRequest $request, Tag $tag)
    {
        $tag->update([
            'name'=>$request->name, 
            'slug' => $request->slug,
            'description' => $request->description,
            'icon' => $request->icon
        ]);
        return response(['tag' => new TagResource($tag)], Response::HTTP_ACCEPTED);
    }
    
     /**
     * Calculate the total count of posts for each tag in the database.
     *
     * @return Response
     */
    public function totalCount()
    {
        $total = DB::table('tags')
            ->select('tags.name AS tag_name', DB::raw('COUNT(posts.id) AS post_count'))
            ->leftJoin('posts', function ($join) {
                $join->on(DB::raw("posts.tags"), 'like', DB::raw("CONCAT('%', tags.id, '%')"));
            })
            ->groupBy('tags.name')
            ->get();
        
        return response(["data" => $total], Response::HTTP_OK);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Tag  $tag
     * @return \Illuminate\Http\Response
     */
    public function destroy(Tag $tag)
    {
        $tag->delete();
        return response(['success' => true, 'message' => 'Tag deleted successfully'], Response::HTTP_NO_CONTENT);
    }
}
