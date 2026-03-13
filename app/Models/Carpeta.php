<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Archivo;

class Carpeta extends Model
{
    use HasFactory;

    protected $fillable = ['nombre', 'carpeta_padre_id', 'user_id'];

    public function carpetasHijos()
    {
        return $this->hasMany(Carpeta::class, 'carpeta_padre_id');
    }

    public function archivos()
    {
        return $this->hasMany(Archivo::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}