<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class PageCategory extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected static function boot()
    {
        parent::boot();

        static::creating(function($pageCategory) {
            $pageCategory->slug = Str::slug($pageCategory->name);
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

    /**
     * Get the path attribute for the model.
     *
     * @return string
     */
    public function getPathAttribute()
    {
         return asset("page-categories/$this->slug");
    }
}
