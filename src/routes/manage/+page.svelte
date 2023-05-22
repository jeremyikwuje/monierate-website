<script>
    
</script>

<body class="bg-gray-100">
    <div class="absolute top-[20%] left-0 right-0 h-[75vh] w-full md:w-[200px] md:mx-auto p-4 bg-white">
        <h1 class="mb-8 text-center">Manage Data</h1>
        <ul class="side-menu">
            <li>
                <a href="/manage">Overview</a>
            </li>
            <li>
                <a href="/manage/rates">Rates</a>
            </li>
            <li>
                <a href="#">Changers</a>
            </li>
        </ul>
    </div>
</body>
<style>
    .side-menu {
        @apply mt-12;
    }
    .side-menu li a {
        @apply block text-gray-600 shadow-lg rounded-lg px-8 py-4 text-center mb-8
    }
    .side-menu li a.active {
        @apply border-b-2 border-primary;
    }
</style>