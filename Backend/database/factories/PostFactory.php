<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\Comment;
use App\Models\Tag;
use App\Models\Category;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Post>
 */
class PostFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        $title = $this->faker->word;
        return [
            'title' => $title,
            'post'  => $this->faker->text,
            'slug'  => Str::slug($title),
            'user_id' => function() {
                return User::all()->random();
            },
            'status'  => $this->faker->boolean,
            'tag_id' => function() {
                return Tag::all()->random();
            },
            'category_id' => function() {
                return Category::all()->random();
            }
        ];
    }
}
