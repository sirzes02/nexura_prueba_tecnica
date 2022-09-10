<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;

    protected $table = 'empleado';
    protected $primaryKey = 'id';

    public $timestamps = false;

    public function area()
    {
        return $this->hasOne(Areas::class, "id", "area_id");
    }

    public function roles()
    {
        return $this->belongsToMany(Roles::class, "empleado_rol", "empleado_id", "rol_id");
    }
}
