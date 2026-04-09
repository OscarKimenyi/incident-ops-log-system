<?php

namespace App\Http\Controllers;

use App\Models\Incident;
use App\Models\IncidentUpdate;
use App\Models\User;
use Illuminate\Http\Request;

class IncidentController extends Controller
{
    public function index(Request $request)
    {
        $user  = $request->user();
        $query = Incident::with(['reporter', 'assignee']);

        // Reporters can only see their own incidents
        if ($user->isReporter()) {
            $query->where('reported_by', $user->id);
        }

        // Filters
        if ($request->has('severity') && $request->severity !== '') {
            $query->where('severity', $request->severity);
        }

        if ($request->has('status') && $request->status !== '') {
            $query->where('status', $request->status);
        }

        if ($request->has('search') && $request->search !== '') {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        $incidents = $query->orderBy('created_at', 'desc')->get();

        return response()->json($incidents);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'severity'    => 'required|in:low,medium,high,critical',
        ]);

        $incident = Incident::create([
            'title'       => $request->title,
            'description' => $request->description,
            'severity'    => $request->severity,
            'status'      => 'open',
            'reported_by' => $request->user()->id,
        ]);

        // Audit log
        IncidentUpdate::create([
            'incident_id' => $incident->id,
            'user_id'     => $request->user()->id,
            'action'      => 'created',
            'comment'     => 'Incident created.',
        ]);

        return response()->json($incident->load(['reporter', 'assignee']), 201);
    }

    public function show(Request $request, Incident $incident)
    {
        $user = $request->user();

        // Reporters can only see their own
        if ($user->isReporter() && $incident->reported_by !== $user->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        return response()->json(
            $incident->load(['reporter', 'assignee', 'updates.user'])
        );
    }

    public function updateStatus(Request $request, Incident $incident)
    {
        $user = $request->user();

        $request->validate([
            'status'  => 'required|in:open,investigating,resolved,closed',
            'comment' => 'nullable|string',
        ]);

        $newStatus = $request->status;

        if (!$incident->canTransitionTo($newStatus)) {
            return response()->json([
                'message' => "Invalid status transition. Current status is '{$incident->status}'. Next allowed status is '{$incident->getNextStatus()}'.",
            ], 422);
        }

        $oldStatus        = $incident->status;
        $incident->status = $newStatus;
        $incident->save();

        IncidentUpdate::create([
            'incident_id' => $incident->id,
            'user_id'     => $user->id,
            'action'      => 'status_changed',
            'old_status'  => $oldStatus,
            'new_status'  => $newStatus,
            'comment'     => $request->comment,
        ]);

        return response()->json($incident->load(['reporter', 'assignee', 'updates.user']));
    }

    public function assign(Request $request, Incident $incident)
    {
        $request->validate([
            'assigned_to' => 'required|exists:users,id',
        ]);

        $assignee = User::findOrFail($request->assigned_to);

        if (!$assignee->isOperator() && !$assignee->isAdmin()) {
            return response()->json(['message' => 'Can only assign to operators or admins.'], 422);
        }

        $incident->assigned_to = $request->assigned_to;
        $incident->save();

        IncidentUpdate::create([
            'incident_id' => $incident->id,
            'user_id'     => $request->user()->id,
            'action'      => 'assigned',
            'comment'     => "Incident assigned to {$assignee->name}.",
        ]);

        return response()->json($incident->load(['reporter', 'assignee', 'updates.user']));
    }

    public function addComment(Request $request, Incident $incident)
    {
        $user = $request->user();

        // Reporters can only comment on their own incidents
        if ($user->isReporter() && $incident->reported_by !== $user->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $request->validate([
            'comment' => 'required|string',
        ]);

        $update = IncidentUpdate::create([
            'incident_id' => $incident->id,
            'user_id'     => $user->id,
            'action'      => 'comment_added',
            'comment'     => $request->comment,
        ]);

        return response()->json($update->load('user'), 201);
    }

    public function dashboard(Request $request)
    {
        $user  = $request->user();
        $query = Incident::query();

        if ($user->isReporter()) {
            $query->where('reported_by', $user->id);
        }

        $counts = [
            'open'          => (clone $query)->where('status', 'open')->count(),
            'investigating' => (clone $query)->where('status', 'investigating')->count(),
            'resolved'      => (clone $query)->where('status', 'resolved')->count(),
            'closed'        => (clone $query)->where('status', 'closed')->count(),
            'total'         => (clone $query)->count(),
        ];

        $severity_counts = [
            'low'      => (clone $query)->where('severity', 'low')->count(),
            'medium'   => (clone $query)->where('severity', 'medium')->count(),
            'high'     => (clone $query)->where('severity', 'high')->count(),
            'critical' => (clone $query)->where('severity', 'critical')->count(),
        ];

        $recent = (clone $query)
            ->with(['reporter', 'assignee'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        return response()->json([
            'status_counts'   => $counts,
            'severity_counts' => $severity_counts,
            'recent_incidents' => $recent,
        ]);
    }
}