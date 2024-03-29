<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CommentResource extends JsonResource
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
            'content' => $this->content,
            'user' => $this->user->name,
            'user_id' => $this->user_id,
            'post_id' => $this->post_id,
            'like_count' => $this->like,
            'main_comment_id' => $this->main,
            'created_at' => $this->created_at->diffForHumans()
        ];
    }
}
