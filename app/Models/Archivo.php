<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Archivo extends Model
{
    use HasFactory;

    protected $fillable = ['nombre', 'carpeta_id', 'descripcion', 'user_id'];

    public function carpeta()
    {
        return $this->belongsTo(Carpeta::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

}
