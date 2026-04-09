<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Incident extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'severity',
        'status',
        'reported_by',
        'assigned_to',
    ];

    public const STATUS_FLOW = [
        'open'          => 'investigating',
        'investigating' => 'resolved',
        'resolved'      => 'closed',
    ];

    public function reporter()
    {
        return $this->belongsTo(User::class, 'reported_by');
    }

    public function assignee()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function updates()
    {
        return $this->hasMany(IncidentUpdate::class)->orderBy('created_at', 'desc');
    }

    public function getNextStatus(): ?string
    {
        return self::STATUS_FLOW[$this->status] ?? null;
    }

    public function canTransitionTo(string $newStatus): bool
    {
        return $this->getNextStatus() === $newStatus;
    }
}