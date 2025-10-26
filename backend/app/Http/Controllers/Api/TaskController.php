<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $user = auth('api')->user(); 
        
        $query = Task::where('user_id', $user->id);

        $request->validate([
            'status' => 'nullable|in:To Do,In Progress,Done',
            'sort_by' => 'nullable|in:deadline,created_at', 
            'sort_dir' => 'nullable|in:asc,desc',
        ]);

        
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $sortBy = $request->input('sort_by', 'created_at');
        $sortDir = $request->input('sort_dir', 'desc');
        if ($sortBy === 'deadline') {
             $query->orderBy('deadline', $sortDir);
        } else {
             $query->orderBy('created_at', $sortDir);
        }

        $tasks = $query->get();

        return response()->json($tasks);
    }

    public function store(Request $request)
    {
        $user = auth('api')->user();

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|in:To Do,In Progress,Done',
            'deadline' => 'nullable|date_format:Y-m-d', 
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $task = Task::create([
            'user_id' => $user->id,
            'title' => $request->title,
            'description' => $request->description,
            'status' => $request->status ?? 'To Do',
            'deadline' => $request->deadline,
            'created_by' => $user->id, 
        ]);

        return response()->json($task, 201);
    }

    public function show(Task $task)
    {
        $user = auth('api')->user();

        if ($task->user_id !== $user->id) {
            return response()->json(['message' => 'Forbidden - You do not own this task'], 403);
        }

        return response()->json($task);
    }

    public function update(Request $request, Task $task)
    {
        $user = auth('api')->user();

        if ($task->user_id !== $user->id) {
            return response()->json(['message' => 'Forbidden - You do not own this task'], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|required|in:To Do,In Progress,Done',
            'deadline' => 'nullable|date_format:Y-m-d',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $task->update($validator->validated());

        return response()->json($task);
    }

    public function destroy(Task $task)
    {
        $user = auth('api')->user();

        if ($task->user_id !== $user->id) {
            return response()->json(['message' => 'Forbidden - You do not own this task'], 403);
        }

        $task->delete();

        return response()->json(['message' => 'Task successfully deleted'], 200);
    }
}