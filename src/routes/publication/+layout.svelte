<script>
    import "../../app.css";
    import { page } from "$app/stores";

    let paths = $page.url.pathname.split('/')
    let path = paths[1] ?? 'home'

    console.log(path)
</script>

<header>
    <nav id="brand" class="border-b border-gray-100">
        <div class="container flex justify-between items-center py-4">
            <div class="">
                <a href="/">
                    <img src="/monierate.png" class="h-[24px]" alt="Monierate Logo">
                  </a>
            </div>
            
            <div class="nav-link">
                <a href="/" class={path == '' ? 'active': ''}>$1 Today</a>
                <a href="/converter" class={path == 'converter' ? 'active': ''}>Converter</a>
                <a href="/publication" class={path == 'publication' ? 'active': ''}>Publication</a>
            </div>
        </div>
    </nav>
</header>

<style>
    .nav-link a {
        @apply text-gray-600 mr-6 py-2 px-2
    }
    .nav-link a:last-child {
        @apply mr-0
    }
    .nav-link a.active {
        @apply text-black border-b-4 border-primary
    }
</style>
  
<slot />