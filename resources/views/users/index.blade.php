@extends('layouts.vertical', ['title' => 'Users', 'sub_title' => 'Paginas', 'mode' => $mode ?? '', 'demo' => $demo ?? ''])

@section('css')
    <link href="https://cdn.datatables.net/v/dt/dt-2.1.8/datatables.min.css" rel="stylesheet">
    <!-- CSS de Notyf -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/notyf/notyf.min.css">
    <!-- JS de Notyf -->
    <script src="https://cdn.jsdelivr.net/npm/notyf/notyf.min.js"></script>
    @vite(['resources/css/app.css'])

    @vite(['node_modules/sweetalert2/dist/sweetalert2.min.css'])
    <meta name="csrf-token" content="{{ csrf_token() }}">
@endsection

@section('content')
    {{-- Mensaje de éxito --}}
    @if (session('success'))
        <script>
            const notyf = new Notyf({
                duration: 4000,
                dismissible: true,
                position: {
                    x: 'right',
                    y: 'top'
                },
            });
            notyf.success('{{ session('success') }}');
        </script>
    @endif

    {{-- Header + Botón --}}
    <div class="flex items-center justify-between mb-8">
        <div>
            <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Gestión de Usuarios</h1>
            <p class="text-sm text-gray-500 mt-1">Administra los usuarios y sus permisos</p>
        </div>
        <button onclick="openModal('addUserModal')"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl shadow-sm hover:bg-indigo-700 active:scale-95 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Agregar Usuario
        </button>
    </div>

    {{-- Tabla de usuarios --}}
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/60">
            <h2 class="text-base font-semibold text-gray-700">Lista de usuarios</h2>
        </div>
        <div class="overflow-x-auto p-5">
            <table id="users-table" class="display tabla w-full text-sm">
                <thead>
                    <tr class="text-xs uppercase tracking-wider text-gray-500 bg-gray-50 border-b border-gray-100">
                        <th class="px-6 py-3 text-left font-semibold">ID</th>
                        <th class="px-6 py-3 text-left font-semibold">Nombre</th>
                        <th class="px-6 py-3 text-left font-semibold">Email</th>
                        <th class="px-6 py-3 text-left font-semibold">Rol</th>
                        <th class="px-6 py-3 text-left font-semibold">Fecha de creación</th>
                        <th class="px-6 py-3 text-left font-semibold">Acciones</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                    @foreach ($users as $user)
                        <tr class="hover:bg-indigo-50/30 transition-colors duration-100 group">
                            <td class="px-6 py-4 text-gray-400 font-mono text-xs">#{{ $user->id }}</td>
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-3">
                                    <div
                                        class="h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs uppercase flex-shrink-0">
                                        {{ substr($user->name, 0, 1) }}
                                    </div>
                                    <span class="font-medium text-gray-800">{{ $user->name }}</span>
                                </div>
                            </td>
                            <td class="px-6 py-4 text-gray-500">{{ $user->email }}</td>
                            <td class="px-6 py-4">
                                @php
                                    $roleColors = [
                                        'Super Admin' => 'bg-purple-100 text-purple-700',
                                        'Admin' => 'bg-blue-100 text-blue-700',
                                        'Usuario' => 'bg-green-100 text-green-700',
                                    ];
                                    $roleClass = $roleColors[$user->role] ?? 'bg-gray-100 text-gray-600';
                                @endphp
                                <span
                                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold {{ $roleClass }}">
                                    {{ $user->role ?? 'N/A' }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-gray-400 text-xs">{{ $user->created_at }}</td>
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                    <button
                                        class="open-modal p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                                        onclick="editUser({{ $user->id }}, '{{ $user->name }}', '{{ $user->email }}', '{{ $user->role }}')"
                                        title="Editar Usuario">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                        </svg>
                                    </button>
                                    <button
                                        class="delete-user p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                                        data-user-id="{{ $user->id }}" title="Eliminar Usuario">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path>
                                            <line x1="18" y1="9" x2="12" y2="15"></line>
                                            <line x1="12" y1="9" x2="18" y2="15"></line>
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>


    {{-- ===== MODAL: Crear Usuario ===== --}}
    <div id="addUserModal"
        class="fixed inset-0 z-50 {{ $errors->any() ? 'flex' : 'hidden' }} items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-[fadeInUp_0.2s_ease]">
            <div class="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                <div>
                    <h3 class="text-base font-bold text-gray-900">Agregar Usuario</h3>
                    <p class="text-xs text-gray-400 mt-0.5">Completa los datos para crear un nuevo usuario</p>
                </div>
                <button class="text-gray-300 hover:text-gray-500 hover:bg-gray-100 rounded-lg p-1.5 transition-colors"
                    onclick="closeModal('addUserModal')">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div class="p-6 space-y-4">
                <form id="addUserForm" method="POST" action="{{ route('users.store') }}">
                    @csrf
                    <div class="grid grid-cols-1 gap-4">
                        <!-- Nombre -->
                        <div>
                            <label for="user_name"
                                class="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Nombre
                                completo</label>
                            <input type="text" id="user_name" name="name" value="{{ old('name') }}" required
                                class="block w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none transition @error('name') border-red-400 bg-red-50 @enderror"
                                placeholder="Nombre y apellido">
                            @error('name')
                                <p class="mt-1 text-xs text-red-500">{{ $message }}</p>
                            @enderror
                        </div>

                        <!-- Email -->
                        <div>
                            <label for="user_email"
                                class="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Correo
                                electrónico</label>
                            <input type="email" id="user_email" name="email" value="{{ old('email') }}" required
                                class="block w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none transition @error('email') border-red-400 bg-red-50 @enderror"
                                placeholder="ejemplo@correo.com">
                            @error('email')
                                <p class="mt-1 text-xs text-red-500">{{ $message }}</p>
                            @enderror
                        </div>

                        <!-- Contraseñas en grid -->
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label for="user_password"
                                    class="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Contraseña</label>
                                <input type="password" id="user_password" name="password" required
                                    class="block w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none transition @error('password') border-red-400 bg-red-50 @enderror"
                                    placeholder="••••••••">
                                @error('password')
                                    <p class="mt-1 text-xs text-red-500">{{ $message }}</p>
                                @enderror
                            </div>
                            <div>
                                <label for="user_password_confirmation"
                                    class="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Confirmar</label>
                                <input type="password" id="user_password_confirmation" name="password_confirmation"
                                    required
                                    class="block w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none transition @error('password_confirmation') border-red-400 bg-red-50 @enderror"
                                    placeholder="••••••••">
                                @error('password_confirmation')
                                    <p class="mt-1 text-xs text-red-500">{{ $message }}</p>
                                @enderror
                            </div>
                        </div>

                        <!-- Rol -->
                        <div>
                            <label for="add_user_role"
                                class="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Rol</label>
                            <select id="add_user_role" name="role" required
                                class="block w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none transition">
                                <option value="">Seleccione un rol</option>
                                @if (session('user_role') === 'Super Admin')
                                    <option value="Super Admin" {{ old('role') == 'Super Admin' ? 'selected' : '' }}>Super
                                        Admin</option>
                                    <option value="Admin" {{ old('role') == 'Admin' ? 'selected' : '' }}>Admin</option>
                                    <option value="User" {{ old('role') == 'User' ? 'selected' : '' }}>Usuario
                                    </option>
                                @elseif (session('user_role') === 'Admin')
                                    <option value="User" {{ old('role') == 'User' ? 'selected' : '' }}>Usuario
                                    </option>
                                @endif
                            </select>
                            @error('role')
                                <p class="mt-1 text-xs text-red-500">{{ $message }}</p>
                            @enderror
                        </div>
                    </div>

                    <!-- Botones -->
                    <div class="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                        <button type="button"
                            class="px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
                            onclick="closeModal('addUserModal')">Cancelar</button>
                        <button type="submit"
                            class="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 active:scale-95 transition-all shadow-sm">
                            Crear Usuario
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>


    {{-- ===== MODAL: Editar Usuario ===== --}}
    <div id="editUserModal"
        class="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div class="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                <div>
                    <h3 class="text-base font-bold text-gray-900">Editar Usuario</h3>
                    <p class="text-xs text-gray-400 mt-0.5">Modifica los datos del usuario</p>
                </div>
                <button class="text-gray-300 hover:text-gray-500 hover:bg-gray-100 rounded-lg p-1.5 transition-colors"
                    onclick="closeModal('editUserModal')">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div class="p-6">
                <form id="editUserForm" method="POST">
                    @csrf
                    @method('PUT')
                    <div class="grid grid-cols-1 gap-4">
                        <!-- Nombre -->
                        <div>
                            <label for="edit_user_name"
                                class="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Nombre
                                completo</label>
                            <input type="text" id="edit_user_name" name="name" required
                                class="block w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none transition">
                        </div>

                        <!-- Email -->
                        <div>
                            <label for="edit_user_email"
                                class="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Correo
                                electrónico</label>
                            <input type="email" id="edit_user_email" name="email" required
                                class="block w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none transition">
                        </div>

                        <!-- Contraseñas -->
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label for="edit_user_password"
                                    class="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Nueva
                                    contraseña</label>
                                <input type="password" id="edit_user_password" name="password"
                                    class="block w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none transition"
                                    placeholder="Nueva contraseña">
                            </div>
                            <div>
                                <label for="edit_user_password_confirmation"
                                    class="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Confirmar</label>
                                <input type="password" id="edit_user_password_confirmation" name="password_confirmation"
                                    class="block w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none transition"
                                    placeholder="Repetir contraseña">
                                <span id="passError" class="text-red-500 text-xs mt-1 hidden">Las contraseñas no
                                    coinciden</span>
                            </div>
                        </div>

                        <!-- Rol -->
                        <div>
                            <label for="edit_user_role"
                                class="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Rol</label>
                            <select id="edit_user_role" name="role" required
                                class="block w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none transition">
                                <option value="">Seleccione un rol</option>
                                @if (session('user_role') === 'Super Admin')
                                    <option value="Super Admin">Super Admin</option>
                                    <option value="Admin">Admin</option>
                                    <option value="User">Usuario</option>
                                @elseif (session('user_role') === 'Admin')
                                    <option value="User">Usuario</option>
                                @endif
                            </select>
                        </div>
                    </div>

                    <!-- Botones -->
                    <div class="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                        <button type="button"
                            class="px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
                            onclick="closeModal('editUserModal')">Cancelar</button>
                        <button type="submit"
                            class="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 active:scale-95 transition-all shadow-sm">
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
@endsection


@section('script')
    @vite(['resources/js/pages/extended-sweetalert.js'])
    @vite(['resources/js/pages/highlight.js'])
    @vite(['resources/js/table-users.js'])
@endsection


{{-- scrip-bottom nos permite incrustra el js --}}
@section('script-bottom')
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.datatables.net/v/dt/dt-2.1.8/datatables.min.js"></script>
@endsection
