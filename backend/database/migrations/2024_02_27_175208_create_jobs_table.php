<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('jobs', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug');
            $table->string('technology');
            $table->string('contract_type');
            $table->string('experience_level');
            $table->text('requirements');
            $table->text('company_name');
            $table->text('location');
            $table->text('remote');
            $table->text('price');
            $table->text('contact');
            $table->text('website');
            $table->dateTime('validity_date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('jobs');
    }
};
