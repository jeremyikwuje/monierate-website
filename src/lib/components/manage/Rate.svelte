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