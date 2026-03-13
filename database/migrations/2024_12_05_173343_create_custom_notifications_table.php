<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('custom_notifications', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable(); // ID del usuario asociado a la notificación
            $table->string('type'); // Tipo de notificación (opcional)
            $table->string('title'); // Título de la notificación
            $table->text('message'); // Mensaje de la notificación
            $table->boolean('is_read')->default(false); // Si la notificación ha sido leída
            $table->timestamps(); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('custom_notifications');
    }
};
