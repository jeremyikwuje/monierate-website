<script>
    
    async function changeRate() {
        let buy = document.querySelector("#field-buy")
        let sell = document.querySelector("#field-sell")
        let changer = document.querySelector("#field-changer")

        const payload = {
            changer_code: changer.value,
            currency: 'usd',
            rate: {
                buy: buy.value,
                sell: sell.value
            }
        }

        console.log(payload)
    }
</script>

<body class="bg-gray-200">
    <div class="fixed h-screen w-full md:w-[15%] bg-gray-200 p-4">
        <ul class="side-menu">
            <li>
                <a href="/" class="active">Overview</a>
            </li>
            <li>
                <a href="/">Rates</a>
            </li>
            <li>
                <a href="/">Changers</a>
            </li>
        </ul>
    </div>

    <div class="absolute py-4 px-4 top-0 left-[15%] w-[85%]">
        <h1 class="text-2xl mb-4">Rates</h1>

        <div class="flex justify-between item-center">
            <div class="w-[70%]">
            </div>
            <div class="bg-gray-200 shadow-lg p-4 md:w-[300px]">
                <h2 class="mb-4 font-bold">Update rate</h2>
                <div class="" id="rate-update-form">
                    <span class="block mb-4">
                        <label for="">Changer</label>
                        <select id="field-changer" class="select">
                            <option value="">Binance</option>
                        </select>
                    </span>
                    <span class="block mb-4">
                        <label for="">Buy rate</label>
                        <input type="text" class="px-2 py-2 input" id="field-buy" value="">
                    </span>
                    <span class="block mb-4">
                        <label for="">Sell rate</label>
                        <input type="password" class="px-2 py-2 input" id="field-sell" value="">
                    </span>   
                    <button class="btn btn-primary" on:click={changeRate()}>Save</button>
                </div>
            </div>
        </div> 
    </div>
</body>
<style>
    .side-menu {
        @apply mt-12;
    }
    .side-menu li {
        @apply px-2 pt-2 mb-4 
    }
    .side-menu li a {
        @apply text-gray-600
    }
    .side-menu li a.active {
        @apply border-b-2 border-primary;
    }
</style>