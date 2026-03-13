<!-- Topbar Start -->
<header class="app-header flex items-center px-4 gap-3">
    <!-- Sidenav Menu Toggle Button -->
    <button id="button-toggle-menu" class="nav-link p-2">
        <span class="sr-only">Menu Toggle Button</span>
        <span class="flex items-center justify-center h-6 w-6">
            <i class="mgc_menu_line text-xl"></i>
        </span>
    </button>

    <!-- Topbar Brand Logo -->
    <a href="{{ route('any', 'index') }}" class="logo-box">
        <!-- Light Brand Logo -->
        <div class="logo-light">
            <img src="/images/logo-light.png" class="logo-lg h-6" alt="Light logo">
            <img src="/images/logo-sm.png" class="logo-sm" alt="Small logo">
        </div>

        <!-- Dark Brand Logo -->
        <div class="logo-dark">
            <img src="/images/logo-dark.png" class="logo-lg h-6" alt="Dark logo">
            <img src="/images/logo-sm.png" class="logo-sm" alt="Small logo">
        </div>
    </a>

    <!-- Topbar Search Modal Button -->
    <button type="button" data-fc-type="modal" data-fc-target="topbar-search-modal" class="nav-link p-2 me-auto"
        disabled>
    </button>
    <div class="md:flex hidden">
        <img class="w-44" src="/images/completo-ok.png" alt="">

    </div>



    <!-- Fullscreen Toggle Button -->
    <div class="md:flex hidden">
        <button data-toggle="fullscreen" type="button" class="nav-link p-2">
            <span class="sr-only">Fullscreen Mode</span>
            <span class="flex items-center justify-center h-6 w-6">
                <i class="mgc_fullscreen_line text-2xl"></i>
            </span>
        </button>
    </div>
    @if (Auth::user()->role === 'Super Admin')
        <!-- Notification Bell Button -->
        <div class="relative md:flex hidden">
            <button data-fc-type="dropdown" data-fc-placement="bottom-end" type="button" class="nav-link p-2">
                <span class="sr-only">View notifications</span>
                <span class="flex items-center justify-center h-6 w-6 relative">
                    <i class="mgc_notification_line text-2xl"></i>

                    {{-- Círculo rojo si hay notificaciones --}}
                    @if ($notificaciones->count() > 0)
                        <span
                            class="absolute -top-1 -right-1 block h-2.5 w-2.5 rounded-full ring-2 ring-white bg-red-500"></span>
                    @endif
                </span>
            </button>
            <div
                class="fc-dropdown fc-dropdown-open:opacity-100 hidden opacity-0 w-80 z-50 mt-2 transition-[margin,opacity] duration-300 bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 rounded-lg">

                <div class="p-2 border-b border-dashed border-gray-200 dark:border-gray-700">
                    <div class="flex items-center justify-between">
                        <h6 class="text-sm"> Notification</h6>
                    </div>
                </div>

                <div class="p-4 h-80" data-simplebar>
                    @forelse ($notificaciones as $notificacion)
                        <a href="{{ route('notificaciones') }}" class="block mb-4">
                            <div class="card-body">
                                <div class="flex items-center">
                                    <div class="flex-shrink-0">
                                        <div
                                            class="flex justify-center items-center h-9 w-9 rounded-full bg text-white bg-primary">
                                            <i class="mgc_message_3_line text-lg"></i>
                                        </div>
                                    </div>
                                    <div class="flex-grow truncate ms-2">
                                        <h5 class="text-sm font-semibold mb-1">{{ $notificacion->title }} <small
                                                class="font-normal text-gray-500 ms-1">{{ \Carbon\Carbon::parse($notificacion->created_at)->diffForHumans() }}</small>
                                        </h5>
                                        <small
                                            class="noti-item-subtitle text-muted">{{ $notificacion->message }}</small>
                                    </div>
                                </div>
                            </div>
                        </a>
                    @empty
                        <div class="text-center text-gray-500 mt-10">
                            No hay notificaciones por mostrar.
                        </div>
                    @endforelse
                </div>

                <a href="{{ route('notificaciones') }}"
                    class="p-2 border-t border-dashed border-gray-200 dark:border-gray-700 block text-center text-primary underline font-semibold">
                    Ver todas
                </a>
            </div>
        </div>
    @endif

    <!-- Light/Dark Toggle Button -->
    <div class="flex">
        <button id="light-dark-mode" type="button" class="nav-link p-2">
            <span class="sr-only">Light/Dark Mode</span>
            <span class="flex items-center justify-center h-6 w-6">
                <i class="mgc_moon_line text-2xl"></i>
            </span>
        </button>
    </div>
    <div>
        <strong class="capitalize">{{ session('user_name') }}</strong>
    </div>

    <!-- Profile Dropdown Button -->
    <div class="relative">

        <button data-fc-type="dropdown" data-fc-placement="bottom-end" type="button" class="nav-link">
            <img src="/images/users/user-6.jpg" alt="user-image" class="rounded-full h-10">
        </button>
        <div
            class="fc-dropdown fc-dropdown-open:opacity-100 hidden opacity-0 w-44 z-50 transition-[margin,opacity] duration-300 mt-2 bg-white shadow-lg border rounded-lg p-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800">

            <a class="flex items-center py-2 px-3 rounded-md text-sm text-gray-800 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                href="{{ route('second', ['auth', 'login']) }}">
                <i class="mgc_lock_line  me-2"></i>
                <span>Lock Screen</span>
            </a>
            <hr class="my-2 -mx-2 border-gray-200 dark:border-gray-700">
            <a class="flex items-center py-2 px-3 rounded-md text-sm text-gray-800 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                href="{{ route('logout_action') }}">
                <i class="mgc_exit_line  me-2"></i>
                <span>Log Out</span>
            </a>
        </div>

    </div>
</header>
<!-- Topbar End -->

<!-- Topbar Search Modal -->
<div>
    <div id="topbar-search-modal" class="fc-modal hidden w-full h-full fixed top-0 start-0 z-50">
        <div
            class="fc-modal-open:opacity-100 fc-modal-open:duration-500 opacity-0 transition-all sm:max-w-lg sm:w-full m-12 sm:mx-auto">
            <div
                class="mx-auto max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl transition-all dark:bg-slate-800">
                <div class="relative">
                    <div
                        class="pointer-events-none absolute top-3.5 start-4 text-gray-900 text-opacity-40 dark:text-gray-200">
                        <i class="mgc_search_line text-xl"></i>
                    </div>
                    <input type="search"
                        class="h-12 w-full border-0 bg-transparent ps-11 pe-4 text-gray-900 placeholder-gray-500 dark:placeholder-gray-300 dark:text-gray-200 focus:ring-0 sm:text-sm"
                        placeholder="Search...">
                </div>
            </div>
        </div>
    </div>
</div>
