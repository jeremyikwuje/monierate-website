<script lang="ts">
	import { dev } from '$app/environment';

	// Companies that use the Monierate API. Add each client's logo to
	// static/logos/clients/ and list it here; `height` sets its size in the band.
	const companies: { name: string; logo: string; height?: number }[] = [];

	// Until real client logos are added, show placeholders in local dev only, so
	// production never shows the section empty or with logos that are not clients.
	const placeholders = ['Client logo', 'Client logo', 'Client logo', 'Client logo'];
</script>

{#if companies.length || dev}
	<section class="band">
		<div class="container flex flex-col md:flex-row items-center justify-center gap-x-12 gap-y-5 py-7">
			<p class="label shrink-0">You are in good company:</p>

			<ul class="flex flex-wrap items-center justify-center gap-x-12 gap-y-5">
				{#each companies as c}
					<li>
						<img src={c.logo} alt={c.name} title={c.name} loading="lazy" class="w-auto object-contain" style="height: {c.height ?? 28}px;" />
					</li>
				{:else}
					{#each placeholders as p}
						<li class="placeholder">{p}</li>
					{/each}
				{/each}
			</ul>
		</div>
	</section>
{/if}

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
	.placeholder {
		font-family: var(--font-head);
		font-size: 13px;
		font-weight: 600;
		color: var(--text-muted);
		border: 1px dashed var(--text-muted);
		border-radius: 8px;
		padding: 8px 18px;
	}
</style>
