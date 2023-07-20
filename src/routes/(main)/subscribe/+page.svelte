<script>
    import {toggleButtonLoad, toggleMessage} from '$lib/functions.js'

    let email = ""

	const subscribe = async () => {
        if (email.length == 0) {
            toggleMessage("Input your email, please.")
            return
        }

        toggleButtonLoad("#btn-subscribe")

        const response = await fetch('/subscribe', {
            method: 'PUT',
            body: JSON.stringify({ email })
        })
        const json = await response.json();
        console.log(json);

        toggleButtonLoad("#btn-subscribe")

        if (json.status == "error") {
            toggleMessage(json.message)
            return
        }

        email = ""
        toggleMessage(json.message, "success")
    }
</script>
<div class="container">
    <div class="md:w-[700px]"> 
        <h1 class="text-2xl md:text-4xl mb-4">Get financial updates</h1>
        <span class="text-gray-600 font-normal dark:text-gray-300">Do you want to get notified when a new exchange is added to Monierate? Sign up for our newsletter and you'll be among the first to find out about new features, exchanges, rates, and tools.</span>

        <div class="mt-8">
            <input type="email" class="input w-full md:w-[65%] rounded-lg" id="field-email" placeholder="Email address" bind:value={email}>

            <span id="alert" class="block hidden py-4"></span>

            <button class="button py-4 bg-black mt-4" id="btn-subscribe" on:click={subscribe}>Get notified</button>
        </div>
    </div>
</div>