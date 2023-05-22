<script>
    import Money from "$lib/money";

    export let rates
</script>

<div class="changers-box bg-white py-[10px] shadow-t-md">
    <div class="relative overflow-x-auto">
        <table class="w-full text-sm text-left">
            <thead>
                <tr>
                    <th scope="col" class="pr-2 py-3 md:pl-4 font-bitter hidden md:inline-block">
                        #
                    </th>
                    <th scope="col" class="pr-6 py-3 pl-2 md:pl-0 text-black font-bold font-bitter w-[40%]">
                        Provider
                    </th>
                    <th scope="col" class="pl-6 py-3 text-black font-bold font-bitter text-right">
                        Price
                    </th>
                    <th scope="col" class="pl-6 py-3 text-black font-bold font-bitter text-right pr-2 md:pr-4">
                        Services
                    </th>
                </tr>
            </thead>
            <tbody class="changers">
                {#each Object.entries(rates) as [index, rate]}
                <tr class="mb-4 border-t border-gray-100">
                    <th scope="row" class="text-gray-500 py-6 pl-4 hidden md:inline-block">
                        {parseInt(index) + 1}
                    </th>
                    <td>
                        <span class="flex items-center">
                            <span class="changer-icon">
                                <img src="/icons/{rate.changer.icon}" class="rounded-full" alt="Paga Icon">
                            </span>
                            <span class="changer-title">{rate.changer.name}</span>
                        </span>
                    </td>
                    <td class="text-right">
                        <span class="changer-rate">₦{Money.toDollar(rate.rate_buy)}</span>
                        <small class="changer-rate-base">per $1</small>
                    </td>
                    <td class="text-right py-2 pr-2 md:pr-4">
                        {#each Object.entries(rate.changer.changer_tags) as [index, tag]}
                        <span class="inline-block p-2 border border-gray-300 text-black rounded-lg text-xs mr-2 font-semibold mb-2">
                            {tag.tag_id}
                        </span>
                        {/each}
                    </td>
                </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>

<style>
     .changer {
        @apply flex justify-between items-center py-2 border-b border-gray-200;
    }
    .changer:last-child {
        @apply border-b-0
    }
    .changer-icon {
        @apply bg-transparent border border-black rounded-full w-[24px] h-[24px] mr-2;
    }
    .changer-title {
        @apply font-semibold text-lg capitalize text-gray-800;
    }
    .changer-rate-base {
        @apply text-gray-500;
    }
    .changer-rate {
        @apply block font-semibold text-lg text-gray-800;
    }
</style>