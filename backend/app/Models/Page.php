<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    use HasFactory;

    protected $guarded = [];

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
        return asset("pages/$this->slug");
    }

    public function pageCategory()
    {
        return $this->belongsTo(PageCategory::class);
    }
}
