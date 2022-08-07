<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\Post;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Comment>
 */
class CommentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'main' => $this->faker->randomDigit,
            'content' => $this->faker->text,
            'user_id' => function() {
                return User::all()->random();
            },
            'post_id' => function() {
                return Post::all()->random();
            },
        ];
    }
}
