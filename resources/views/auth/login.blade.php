<!DOCTYPE html>
<html lang="en">

<head>
    @include('layouts.shared/title-meta', ['title' => 'Login'])

    @include('layouts.shared/head-css')
</head>

<body>

    <div class="bg-gradient-to-r from-rose-100 to-teal-100 dark:from-gray-700 dark:via-gray-900 dark:to-black">


        <div class="h-screen w-screen flex justify-center items-center">

            <div class="2xl:w-1/4 lg:w-1/3 md:w-1/2 w-full">
                <div class="card overflow-hidden sm:rounded-md rounded-none">
                    <div class="p-6">
                        <a href="{{ route('any', 'index') }}" class="block mb-8">
                            <img class="w-40 block dark:hidden" src="/images/completo-ok.png" alt="">
                            <img class="w-40 hidden dark:block" src="/images/completo-ok.png" alt="">
                        </a>

                        @if ($errors->has('login'))
                        <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md flex items-center mb-4" role="alert">
                            <svg class="w-6 h-6 text-red-500 flex-shrink-0 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <div>
                                <p class="font-bold text-sm">Error</p>
                                <p class="text-sm">{{ $errors->first('login') }}</p>
                            </div>
                        </div>
                        @endif

                        <form method="POST" action="{{ route('login') }}">
                            @csrf
                            <div class="mb-4">
                                <label class="block text-sm font-medium text-gray-600 dark:text-gray-200 mb-2"
                                    for="LoggingEmailAddress">Email</label>
                                <input id="LoggingEmailAddress" class="form-input" type="email"
                                    placeholder="Ingrese su email" name="email" value="{{ old('email') }}">
                            </div>

                            <div class="mb-4">
                                <label class="block text-sm font-medium text-gray-600 dark:text-gray-200 mb-2"
                                    for="loggingPassword">Contraseña</label>
                                <input id="loggingPassword" class="form-input" type="password"
                                    placeholder="Ingrese su contraseña" name="password" value="{{ old('password') }}">
                            </div>

                            <div class="flex items-center justify-between mb-4">
                                <div class="flex items-center">
                                    <input type="checkbox" class="form-checkbox rounded" id="checkbox-signin">
                                    <label class="ms-2" for="checkbox-signin">Recordar Sesión</label>
                                </div>
                                <a href="https://alminares.es/es/contacto"
                                    class="text-sm text-primary border-b border-dashed border-primary" target="_black">Olvidaste tu
                                    contraseña?</a>
                            </div>

                            <div class="flex justify-center mb-6">
                                <button class="btn w-full text-white bg-primary">Acceder</button>
                            </div>
                        </form>

                        <div class="flex gap-4 justify-center mb-6">
                            <a href="https://api.whatsapp.com/send/?phone=%2B34692388311&text&type=phone_number&app_absent=0" class="btn border-light text-gray-400 dark:border-slate-700" target="_black">
                                <span class="flex justify-center items-center gap-2">
                                    <i class="mgc_whatsapp_line text-info text-xl"></i>
                                    <span class="lg:block hidden">Whatsapp</span>
                                </span>
                            </a>
                            <a href="https://vidafiv.com/" class="btn border-light text-gray-400 dark:border-slate-700" target="_black">
                                <span class="flex justify-center items-center gap-2">
                                    <i class="mgc_web_line text-danger text-xl"></i>
                                    <span class="lg:block hidden">Web</span>
                                </span>
                            </a>
                            <a href="https://www.facebook.com/profile.php?id=61550676091374&locale=es_ES" class="btn border-light text-gray-400 dark:border-slate-700" target="_black">
                                <span class="flex justify-center items-center gap-2">
                                    <i class="mgc_facebook_line text-primary text-xl"></i>
                                    <span class="lg:block hidden">Facebook</span>
                                </span>
                            </a>
                        </div>

                        <p class="text-gray-500 dark:text-gray-400 text-center">Soporte tecnico ®<a
                                href="https://alminares.es/es/" class="text-primary ms-1"><b>Alminares S.L</b></a>
                        </p>
                    </div>
                </div>
            </div>
        </div>

    </div>

</body>

</html>
