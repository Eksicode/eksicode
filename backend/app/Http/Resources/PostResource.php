<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'path' => $this->path,
            'image' => $this->image,
            'body' => $this->post,
            'slug' => $this->slug,
            'user_id' => $this->user_id,
            'user' => $this->user->name,
            'status' => $this->status,
            'tag_id' => $this->tag_id,
            'category_id' => $this->category_id,
            'category' => $this->category->name,
            'created_at' => $this->created_at->diffForHumans(),
            'comments' => CommentResource::collection($this->comments),
        ];
    }
}
