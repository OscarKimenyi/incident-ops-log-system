<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Incident;
use App\Models\IncidentUpdate;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        $admin = User::create([
            'name'     => 'Admin User',
            'email'    => 'admin@incidentlog.com',
            'password' => Hash::make('password'),
            'role'     => 'admin',
        ]);

        // Operator
        $operator = User::create([
            'name'     => 'Operator User',
            'email'    => 'operator@incidentlog.com',
            'password' => Hash::make('password'),
            'role'     => 'operator',
        ]);

        // Reporter
        $reporter = User::create([
            'name'     => 'Reporter User',
            'email'    => 'reporter@incidentlog.com',
            'password' => Hash::make('password'),
            'role'     => 'reporter',
        ]);

        // Sample Incidents
        $incident1 = Incident::create([
            'title'       => 'Database connection timeout on production server',
            'description' => 'Users are experiencing intermittent connection timeouts when accessing the application. The issue started at approximately 14:00 EAT.',
            'severity'    => 'critical',
            'status'      => 'investigating',
            'reported_by' => $reporter->id,
            'assigned_to' => $operator->id,
        ]);

        IncidentUpdate::create([
            'incident_id' => $incident1->id,
            'user_id'     => $reporter->id,
            'action'      => 'created',
            'comment'     => 'Incident reported. Users cannot connect to the database.',
        ]);

        IncidentUpdate::create([
            'incident_id' => $incident1->id,
            'user_id'     => $admin->id,
            'action'      => 'status_changed',
            'old_status'  => 'open',
            'new_status'  => 'investigating',
            'comment'     => 'Assigned to operator and moved to investigating.',
        ]);

        $incident2 = Incident::create([
            'title'       => 'API rate limit exceeded on payment gateway',
            'description' => 'Payment processing is failing for some users due to rate limiting from the payment gateway provider.',
            'severity'    => 'high',
            'status'      => 'open',
            'reported_by' => $reporter->id,
        ]);

        IncidentUpdate::create([
            'incident_id' => $incident2->id,
            'user_id'     => $reporter->id,
            'action'      => 'created',
            'comment'     => 'Incident created. Payment failures observed.',
        ]);

        $incident3 = Incident::create([
            'title'       => 'Slow image loading on homepage',
            'description' => 'Homepage hero images are loading slowly. Performance degradation noticed after the last deployment.',
            'severity'    => 'low',
            'status'      => 'resolved',
            'reported_by' => $reporter->id,
            'assigned_to' => $operator->id,
        ]);

        IncidentUpdate::create([
            'incident_id' => $incident3->id,
            'user_id'     => $reporter->id,
            'action'      => 'created',
            'comment'     => 'Images loading slowly.',
        ]);

        IncidentUpdate::create([
            'incident_id' => $incident3->id,
            'user_id'     => $operator->id,
            'action'      => 'status_changed',
            'old_status'  => 'open',
            'new_status'  => 'investigating',
            'comment'     => 'Investigating CDN configuration.',
        ]);

        IncidentUpdate::create([
            'incident_id' => $incident3->id,
            'user_id'     => $operator->id,
            'action'      => 'status_changed',
            'old_status'  => 'investigating',
            'new_status'  => 'resolved',
            'comment'     => 'CDN cache cleared. Images loading normally now.',
        ]);
    }
}