<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Builder;
use App\Http\Resources\PostResource;
use Spatie\Activitylog\Models\Activity;

class SearchController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request)
    {
        $query = $request->input('query');

        $posts = Post::whereHas('user', function ($userQuery) use ($query) {
            $userQuery->where('name', 'like', "%$query%");
        })
        ->orWhere('title', 'like', "%$query%")
        ->orWhereHas('tags', function ($tagQuery) use ($query) {
            $tagQuery->where('name', 'like', "%$query%");
        })
        ->latest()
        ->get();

        return PostResource::collection($posts);

    }
}
