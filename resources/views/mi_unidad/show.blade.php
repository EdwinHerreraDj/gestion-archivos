@extends('layouts.vertical', ['title' => 'Mi unidad', 'sub_title' => 'Pages', 'mode' => $mode ?? '', 'demo' => $demo ?? ''])

@section('css')
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/notyf/notyf.min.css">
    <script src="https://cdn.jsdelivr.net/npm/notyf/notyf.min.js"></script>
    <script src="https://unpkg.com/dropzone@5/dist/min/dropzone.min.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/dropzone@5/dist/min/dropzone.min.css" type="text/css" />
@endsection

@section('content')
    @if (session('success'))
        <script>
            const notyf = new Notyf({
                duration: 4000,
                dismissible: true,
                position: {
                    x: 'right',
                    y: 'top'
                }
            });
            notyf.success('{{ session('success') }}');
        </script>
    @endif
    @if (session('notification'))
        <script>
            const notyf = new Notyf({
                duration: 4000,
                dismissible: true,
                position: {
                    x: 'right',
                    y: 'top'
                },
                types: [{
                    type: 'error',
                    duration: 5000
                }, {
                    type: 'success',
                    duration: 4000
                }]
            });
            let notification = @json(session('notification'));
            notyf.open({
                type: notification.type,
                message: notification.message
            });
        </script>
    @endif

    <div id="folder-show-root"
        data-props="{{ json_encode([
            'carpeta' => $carpeta,
            'subcarpetas' => $subcarpetas,
            'archivos' => $archivos,
            'role' => $role,
            'userId' => $usuarioId, // ← nuevo
        ]) }}">
    </div>
@endsection

@section('script-bottom')
    @vite(['resources/js/react/app.jsx'])
@endsection
