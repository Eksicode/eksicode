<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Post extends Model
{
    use HasFactory;

    //protected $guarded = [];

    protected $fillable = ['title', 'slug', 'post', 'user_id', 'category_id', 'status', 'tag_id'];
   
    protected static function boot()
    {
        parent::boot();

        static::creating(function($post) {
            $post->slug = Str::slug($post->title);
        });
    }

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
        return $this->hasMany(Tag::class);
    }

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
