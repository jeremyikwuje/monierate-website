<script>
    import { page } from "$app/stores";
</script>

<div class="flex items-center justify-center h-screen p-8">
    <div class="bg-white w-[70%] mx-auto py-24 px-4">
        <div class="flex flex-col items-center">
        <h1 class="font-bold text-3xl text-primary lg:text-6xl">404</h1>

        <h6 class="mb-2 text-2xl font-bold text-center text-gray-800 md:text-3xl">
            <span class="text-red-500">Oops!</span> Page {$page.error.message}
        </h6>

        <p class="mb-8 text-center text-gray-500 md:text-lg">
            The page you’re looking for doesn’t exist.
        </p>

        <a
            href="/"
            class="px-6 py-2 text-sm font-semibold text-black bg-primary uppercase"
            >Go home</a
        >
        </div>
    </div>
</div>