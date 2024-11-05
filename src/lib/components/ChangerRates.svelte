<script>
	import { friendlyDate } from "$lib/functions";

  export let rates;
  export let changers;
  export let from;
  export let to;
</script>

<table class="table-auto overflow-x-scroll overflow-y-scroll w-full text-sm text-left">
    <thead>
        <tr>
            <th scope="col" class="pr-4 py-3 md:pl-4 font-bitter hidden md:inline-block">
                #
            </th>
            <th scope="col" class="py-3 pl-2 md:pl-6 md:pl-0 font-bold font-bitter">
                Provider
            </th>
            <th scope="col" class="pl-16 md:pl-6 pr-6 py-3 font-bold font-bitter text-right">
                Rate
            </th>
            <th scope="col" class="pl-6 py-3 font-bold font-bitter text-right pr-2 md:pr-4 whitespace-nowrap">
                Last updated
            </th>
        </tr>
    </thead>
    <tbody class="changers">
        {#each rates as rate, i}
            {#if rate.changer_code !== 'market' && rate.changer_code !== 'binance'}
            <tr class="py-32 mb-4 border-t border-gray-150 dark:border-gray-800">
                <th scope="row" class="text-gray-500 py-6 pl-4 hidden md:inline-block">
                    { i + 1 }
                </th>
                <td>
                    <a href="/converter/{rate.changer_code}?Amount=1&From={from}&To={to}" class="flex items-center" title="{changers[rate.changer_code].name} dollar to naira rate.">
                        <span class="changer-icon">
                            <picture>
                                <source srcset="/icons/svg/{rate.changer_code}.svg" type="image/svg+xml">        
                                <source srcset="/icons/png/{rate.changer_code}.png" type="image/png">
                                <img width="22px" height="22px" src="/icons/svg/{rate.changer_code}.svg" class="rounded-full" alt="{changers[rate.changer_code].name} icon">
                            </picture>
                        </span>
                        <span class="changer-title">{changers[rate.changer_code].name}</span>
                    </a>
                </td>
                <td class="text-right pl-6 pr-6">
                    <span class="changer-rate">
                        {#if Math.round(rate.price_sell) === 0}
                            -
                        {:else}
                            ₦{Math.round(rate.price_sell)}
                        {/if}
                    </span>
                    <small class="changer-rate-base">per $1</small>
                </td>
                <td class="text-right py-2 pr-2 md:pr-4 whitespace-nowrap">
                    {friendlyDate(new Date(rate.updated_at))}
                </td>
            </tr>
            {/if}
        {/each}
    </tbody>
</table>

<style>
  table thead th {
      @apply dark:text-gray-300 text-black whitespace-nowrap
  }
  table tbody tr td {
      @apply py-2 whitespace-nowrap
  }
  table tr td:first-child, table thead th:first-child {
      @apply pl-0
  }
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
      @apply font-semibold text-sm md:text-lg whitespace-nowrap capitalize text-gray-800 dark:text-gray-300;
  }
  .changer-rate-base {
      @apply text-gray-500 dark:text-gray-400;
  }
  .changer-rate {
      @apply block font-semibold text-sm md:text-lg whitespace-nowrap text-gray-800 dark:text-light;
  }
  </style>