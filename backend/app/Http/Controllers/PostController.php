<?php

namespace App\Http\Controllers;

use App\Http\Resources\PostResource;
use App\Models\Post;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Str;
use App\Http\Requests\PostRequest;
use Illuminate\Support\Facades\Storage;


class PostController extends Controller
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
        return PostResource::collection(Post::latest()->get());
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(PostRequest $request)
    {
        $post = new Post;
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            if ($file->isValid()) {
                $extension = $file->getClientOriginalExtension();
                $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
                $fileName = $originalName . '-' . uniqid() . '.' . $extension;
                Storage::disk('s3')->put($fileName, file_get_contents($file), 'public');
                $path = "https://eksicode-images.s3.eu-central-1.amazonaws.com/".$fileName;
            }
        }
        $post->title = $request->title;
        $post->post = $request->post;
        $post->tag_id = $request->tag_id;
        $post->category_id = $request->category_id;
        $post->user_id = $request->user_id;
        $post->status = $request->status;
        $post->image = $path;
        $post->save();
        return response(['post' => new PostResource($post)], Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Post  $post
     * @return \Illuminate\Http\Response
     */
    public function show(Post $post)
    {
        return new PostResource($post);
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Post  $post
     * @return \Illuminate\Http\Response
     */
    public function update(PostRequest $request, Post $post)
    {
        $post->update([
            'title'=>$request->title,
            'slug' => Str::slug($request->title),
            'post' => $request->post,
            'user_id' => $request->user_id,
            'status' => $request->status,
            'tag_id' => $request->tag_id,
            'category_id' => $request->category_id
        ]);
        return response(['post' => new PostResource($post)], Response::HTTP_ACCEPTED);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Post  $post
     * @return \Illuminate\Http\Response
     */
    public function destroy(Post $post)
    {
        $post->delete();
        return response(null, Response::HTTP_NO_CONTENT);
    }
}
