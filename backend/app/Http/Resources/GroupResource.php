<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class GroupResource extends JsonResource
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
            'name' => $this->name,
            'logo' => $this->logo,
            'main_id' => $this->main,
            'icon' => $this->icon,
            'members' => $this->members,
            'link' => $this->link,
            'channelID' => $this->channel_id,
            'listOrder' => $this->list_order,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'description' => $this->description
        ];
    }
}
