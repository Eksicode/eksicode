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
        Schema::create('sources', function (Blueprint $table) {
            $table->id();
            $table->string('doc_name');
            $table->string('doc_creator')->nullable();
            $table->boolean('approved')->default(false);
            $table->string('approving_user')->nullable();
            $table->string('tags')->nullable();
            $table->text('comment')->nullable();
            $table->bigInteger('doc_creator_tg');
            $table->string('doc_link');
            $table->dateTime('lat_edit');
            $table->string('doc_tg_ch');
            $table->boolean('active')->default(false);
            $table->string('screenshot')->nullable();
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
        Schema::dropIfExists('sources');
    }
};
