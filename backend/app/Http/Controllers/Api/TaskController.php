<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;
// Kita tidak pakai Facade Auth, tapi helper auth()
use Illuminate\Support\Facades\Validator;

class TaskController extends Controller
{
    /**
     * Buat instance controller baru.
     * Terapkan middleware 'auth:api' ke SEMUA method di controller ini.
     */


    /**
     * Menampilkan daftar task milik user yang sedang login.
     * Fitur: Filter berdasarkan status, Sort berdasarkan deadline.
     */
    public function index(Request $request)
    {
        $user = auth('api')->user(); // Dapatkan user yang sedang login

        // Mulai query hanya untuk task milik user ini [cite: 44]
        $query = Task::where('user_id', $user->id);

        // Validasi input filter & sort (opsional tapi bagus)
        $request->validate([
            'status' => 'nullable|in:To Do,In Progress,Done', // Hanya terima status yang valid [cite: 32]
            'sort_by' => 'nullable|in:deadline,created_at', // Hanya terima kolom sort yang diizinkan
            'sort_dir' => 'nullable|in:asc,desc',
        ]);

        // Terapkan Filter Status [cite: 35]
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Terapkan Sorting [cite: 36]
        $sortBy = $request->input('sort_by', 'created_at'); // Default sort by tanggal dibuat
        $sortDir = $request->input('sort_dir', 'desc');    // Default descending
        if ($sortBy === 'deadline') {
             $query->orderBy('deadline', $sortDir);
        } else {
             $query->orderBy('created_at', $sortDir);
        }


        // Ambil hasil query (bisa dengan pagination jika datanya banyak)
        $tasks = $query->get();
        // $tasks = $query->paginate(15); // Contoh jika pakai pagination

        return response()->json($tasks);
    }

    /**
     * Menyimpan task baru.
     */
    public function store(Request $request)
    {
        $user = auth('api')->user();

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|in:To Do,In Progress,Done',
            'deadline' => 'nullable|date_format:Y-m-d', // Pastikan format tanggal benar
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Buat task baru, user_id dan created_by diisi otomatis
        $task = Task::create([
            'user_id' => $user->id,
            'title' => $request->title,
            'description' => $request->description,
            'status' => $request->status ?? 'To Do', // Default 'To Do' jika tidak diisi
            'deadline' => $request->deadline,
            'created_by' => $user->id, // User yang login adalah pembuatnya [cite: 31]
        ]);

        return response()->json($task, 201); // Response Created
    }

    /**
     * Menampilkan detail satu task.
     * Laravel otomatis inject $task berdasarkan {task} di route jika ditemukan.
     */
    public function show(Task $task) // Menggunakan Route Model Binding
    {
        $user = auth('api')->user();

        // Cek Kepemilikan Task [cite: 44]
        if ($task->user_id !== $user->id) {
            return response()->json(['message' => 'Forbidden - You do not own this task'], 403);
        }

        return response()->json($task);
    }

    /**
     * Mengupdate task yang sudah ada.
     * Laravel otomatis inject $task berdasarkan {task} di route jika ditemukan.
     */
    public function update(Request $request, Task $task) // Menggunakan Route Model Binding
    {
        $user = auth('api')->user();

        // Cek Kepemilikan Task [cite: 44]
        if ($task->user_id !== $user->id) {
            return response()->json(['message' => 'Forbidden - You do not own this task'], 403);
        }

        // Validasi data yang diupdate (gunakan 'sometimes' agar hanya validasi field yg dikirim)
        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|required|in:To Do,In Progress,Done',
            'deadline' => 'nullable|date_format:Y-m-d',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Update task hanya dengan data yang valid dari request
        $task->update($validator->validated());

        return response()->json($task); // Response OK dengan data task terbaru
    }

    /**
     * Menghapus task.
     * Laravel otomatis inject $task berdasarkan {task} di route jika ditemukan.
     */
    public function destroy(Task $task) // Menggunakan Route Model Binding
    {
        $user = auth('api')->user();

        // Cek Kepemilikan Task [cite: 44]
        if ($task->user_id !== $user->id) {
            return response()->json(['message' => 'Forbidden - You do not own this task'], 403);
        }

        $task->delete();

        // Response No Content (sukses tanpa body) atau dengan pesan
        // return response()->json(null, 204);
        return response()->json(['message' => 'Task successfully deleted'], 200);
    }
}