<script>
    import { page } from "$app/stores";

    let error = $page.error
</script>

<div class="flex items-center justify-center h-[50%]">
    <div class="w-[70%] mx-auto py-24 px-4">
        <div class="flex flex-col items-center">
        <h1 class="font-bold text-3xl text-gray-900 lg:text-6xl text-center">
            Times are tough!
        </h1>

        <h6 class="mb-2 text-2xl font-bold text-center text-gray-800 md:text-3xl dark:text-gray-300">
            <span class="text-red-500">Not your fault!</span> {error?.message}
        </h6>

        <p class="mb-8 text-center text-gray-500 md:text-lg">
            Either the page you’re looking for doesn’t exist or an error occured.
        </p>

        <a
            href="/"
            class="px-6 py-2 text-sm font-semibold text-white bg-black uppercase rounded-lg"
            >$1 today</a
        >
        </div>
    </div>
</div>