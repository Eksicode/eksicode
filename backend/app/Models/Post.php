<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'slug', 'post', 'user_id', 'category_id', 'status'];

    protected $with = ['comments'];

   /* protected $casts = [
        'tags' => 'array'
    ];*/

    /**
     * Get the route key for the model.
     *
     * @return string
     */
    public function getRouteKeyName()
    {
        return 'slug';
    }

    public function user() 
    {
        return $this->belongsTo(User::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class);
    }

   /* public function getTagsAttribute($tags)
    {   
        $str = str_replace("", "", $tags);
        $str = str_replace('[', "", $str);
        $str = str_replace(']', "", $str);
        $str = str_replace('"', "", $str);
        $array = explode(",", $str);
        return  Tag::whereIn('id', $array)->get();
    }*/


    /**
     * Get the path attribute for the model.
     *
     * @return string
     */
    public function getPathAttribute()
    {
        return asset("post/$this->slug");
    }
}
