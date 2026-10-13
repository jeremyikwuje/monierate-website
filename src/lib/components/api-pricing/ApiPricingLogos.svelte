<script lang="ts">
	// Provider logos for now. When the client list arrives, swap these for client
	// logos and change the label to "You are in good company:".
	const label = 'Rates from 100+ providers, including:';

	const logos = [
		{ name: 'Binance P2P', icon: 'binance_p2p.svg' },
		{ name: 'Bybit', icon: 'bybit.svg' },
		{ name: 'Luno', icon: 'luno.svg' },
		{ name: 'Yellow Card', icon: 'yellowcard.svg' },
		{ name: 'Chipper Cash', icon: 'chippercash.svg' },
		{ name: 'Western Union', icon: 'westernunion.svg' }
	];
</script>

<section class="band">
	<div class="container flex flex-col md:flex-row items-center justify-center gap-x-10 gap-y-5 py-7">
		<p class="label shrink-0">{label}</p>

		<ul class="flex flex-wrap items-center justify-center gap-x-9 gap-y-4">
			{#each logos as l}
				<li class="flex items-center gap-2.5" title={l.name}>
					<img src="/icons/svg/{l.icon}" alt="" width="28" height="28" loading="lazy" class="w-7 h-7 rounded-md object-contain shrink-0" />
					<span class="name">{l.name}</span>
				</li>
			{/each}
		</ul>
	</div>
</section>

<style>
	.band {
		background: var(--badge-neutral-bg);
		border-top: 1px solid var(--card-border);
		border-bottom: 1px solid var(--card-border);
	}
	.label {
		font-family: var(--font-mono);
		font-size: 14px;
		color: var(--text-primary);
	}
	.name {
		font-family: var(--font-head);
		font-size: 19px;
		font-weight: 700;
		letter-spacing: -0.01em;
		color: var(--text-secondary);
		white-space: nowrap;
	}
</style>
