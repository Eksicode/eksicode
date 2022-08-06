<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
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
        return [
            'title' => $this->faker->word,
            'post'  => $this->faker->text,
            'user_id' => function() {
                return User::all()->random();
            },
            'status'  => $this->faker->boolean,
            'comment_id' => $this->faker->randomDigit,
            'tag_id' => function() {
                return Tag::all()->random();
            },
            'category_id' => function() {
                return Category::all()->random();
            }
        ];
    }
}
