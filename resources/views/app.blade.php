<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="theme-color" content="#3b82f6">
        <meta name="mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
        <meta name="apple-mobile-web-app-title" content="{{ config('app.name', 'Kaizen Tools') }}">

        {{-- Open Graph / Facebook --}}
        <meta property="og:type" content="website">
        <meta property="og:url" content="{{ url()->current() }}">
        <meta property="og:title" content="{{ config('app.name', 'Kaizen Tools') }} - Minecraft Tool Suite">
        <meta property="og:description" content="Découvrez des mods, resource packs, et outils Minecraft. Vérifiez la réputation des joueurs et créez des bannières personnalisées.">
        <meta property="og:image" content="{{ asset('og-image.png') }}">
        <meta property="og:locale" content="fr_FR">

        {{-- Twitter --}}
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:url" content="{{ url()->current() }}">
        <meta name="twitter:title" content="{{ config('app.name', 'Kaizen Tools') }} - Minecraft Tool Suite">
        <meta name="twitter:description" content="Découvrez des mods, resource packs, et outils Minecraft. Vérifiez la réputation des joueurs et créez des bannières personnalisées.">
        <meta name="twitter:image" content="{{ asset('og-image.png') }}">

        {{-- SEO --}}
        <meta name="description" content="Découvrez des mods, resource packs, et outils Minecraft. Vérifiez la réputation des joueurs et créez des bannières personnalisées.">
        <meta name="keywords" content="Minecraft, mods, resource packs, tools, outils, bannière, joueurs, réputation, Kaizen">
        <meta name="author" content="Kaizen Tools">
        <link rel="canonical" href="{{ url()->current() }}">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
        </style>

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        {{-- PWA Manifest --}}
        <link rel="manifest" href="/manifest.json">

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @inertiaHead

        {{-- Umami Analytics --}}
        <script defer src="https://umami.3de-scs.tech/script.js" data-website-id="95276194-f21f-4198-b614-798ba66fbf6f"></script>
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
