@extends('layouts.vertical', ['title' => 'Notificaciones', 'sub_title' => 'Pages', 'mode' => $mode ?? '', 'demo' => $demo ?? ''])
@section('css')
    <link rel="stylesheet" href="https://cdn.datatables.net/1.13.5/css/jquery.dataTables.min.css">
    @vite(['resources/css/app.css'])
@endsection

@section('content')
    <div class="grid grid-cols-12">
        <div class="col-span-12">
            <div class="card p-6">

                <table id="miTabla" class="display tabla" style="width:100%">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>ACCIONES</th>
                            <th>MENSAJE</th>
                            <th>TIEMPO</th>
                            <th>FECHA</th>
                        </tr>
                    </thead>
                    <tbody>

                        @foreach ($notificaciones as $notificacion)
                            <tr>
                                <td>{{ $notificacion->id }}</td>
                                <td>{{ $notificacion->type }}</td>
                                <td>{{ $notificacion->message }}</td>
                                <td>{{ \Carbon\Carbon::parse($notificacion->created_at)->diffForHumans() }}</td>
                                <td>{{ $notificacion->created_at}}</td>
                            </tr>
                        @endforeach
                        <!-- Agrega más filas según sea necesario -->
                    </tbody>
                </table>



            </div>
        </div>
    </div>
@endsection
@section('script')
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.datatables.net/1.13.5/js/jquery.dataTables.min.js"></script>
    <script>
        $(document).ready(function() {
            $('#miTabla').DataTable({
                "order": [[0, "desc"]],
                language: {
                    "decimal": "",
                    "emptyTable": "No hay información disponible",
                    "info": "Mostrando _START_ a _END_ de _TOTAL_ entradas",
                    "infoEmpty": "Mostrando 0 a 0 de 0 entradas",
                    "infoFiltered": "(filtrado de _MAX_ entradas totales)",
                    "infoPostFix": "",
                    "thousands": ",",
                    "lengthMenu": `
                <label class="flex items-center space-x-1 text-sm">
                    <span>Mostrar</span>
                    <select class="px-2 py-1 bg-white border border-gray-300 rounded shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="-1">Todos</option>
                    </select>
                    <span>registros por página</span>
                </label>
            `,
                    "loadingRecords": "Cargando...",
                    "processing": "Procesando...",
                    "search": "Buscar:",
                    "zeroRecords": "No se encontraron resultados",
                    "paginate": {
                        "first": "Primero",
                        "last": "Último",
                        "next": "Siguiente",
                        "previous": "Anterior"
                    },
                    "aria": {
                        "sortAscending": ": activar para ordenar la columna de forma ascendente",
                        "sortDescending": ": activar para ordenar la columna de forma descendente"
                    }
                },
                paging: true,
                ordering: true,
                searching: true
            });
        });
    </script>
@endsection
