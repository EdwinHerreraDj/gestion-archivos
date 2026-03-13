@extends('layouts.vertical', ['title' => 'Mi unidad', 'sub_title' => 'Pages', 'mode' => $mode ?? '', 'demo' => $demo ?? ''])

@section('css')
    @vite(['node_modules/sweetalert2/dist/sweetalert2.min.css'])
    <!-- CSS de Notyf -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/notyf/notyf.min.css">
    <!-- JS de Notyf -->
    <script src="https://cdn.jsdelivr.net/npm/notyf/notyf.min.js"></script>
@endsection


@section('content')
    <div id="file-manager-root"
        data-props="{{ json_encode([
            'role' => $role,
            'usuarios' => $usuarios,
            'carpetas' => $carpetas,
            'userId' => $usuarioId, // ← nuevo
        ]) }}">
    </div>
@endsection
@section('script')
    @vite(['resources/js/pages/extended-sweetalert.js'])
    @vite(['resources/js/pages/highlight.js'])
    @vite(['resources/js/react/app.jsx'])
@endsection
