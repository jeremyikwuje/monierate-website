<script>
    import { basicAuth, getEndpoint } from "$lib/helper.svelte";

    let user = ""
    let password = ""

    async function signin() {
        const payload = {
            user: user,
            password: password
        }

        let endpoint = getEndpoint("/manage/auth/login");
        let res = await fetch(
            endpoint,
            basicAuth('POST', {})
        );

        const access = (await res.json()).data || {}

        console.log(access)

        alert("Sign in...")
    }
</script>

<body class="bg-gray-200">
    <header></header>

    <div class="flex justify-center item-center absolute right-0 left-0 top-[40%]">
        <div class="bg-white w-full md:w-[300px] p-4 shadow-lg rounded-lg">
            <h2 class="mb-4">Manager Access</h2>
            <span class="block mb-4">
                <input type="text" class="px-2 py-2 input" id="field-user" bind:value={user} placeholder="Username or email">
            </span>
            <span class="block mb-4">
                <input type="password" class="px-2 py-2 input" id="field-password" bind:value={password} placeholder="Password">
            </span>
    
            <button class="btn btn-primary" on:click={signin()}>Sign in</button>
        </div>
    </div>
</body>

<style>
    
</style>