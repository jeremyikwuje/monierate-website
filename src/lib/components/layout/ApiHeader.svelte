<script lang="ts">
	import { navigating } from '$app/stores';
	import { ACCOUNT_URL } from '$lib/config';

	let { auth = null }: { auth?: { isLoggedIn: boolean; user: any } | null } = $props();

	const DOCS_URL = 'https://docs.monierate.com';

	const links = [
		{ label: 'Docs', href: DOCS_URL, external: true },
		{ label: 'FAQ', href: '#faq' }
	];

	let menuOpen = $state(false);

	// close the mobile menu on page change
	$effect(() => {
		if ($navigating) menuOpen = false;
	});
</script>

<header class="mb-0">
	<nav
		class="w-full z-20 top-0 left-0"
		style="background: var(--page-bg); border-bottom: 1px solid var(--card-border);"
	>
		<div class="w-[95%] md:max-w-[1500px] flex flex-wrap items-center justify-between mx-auto p-4">
			<a href="/" class="flex items-center gap-2">
				<!-- Mobile: favicon (light mode) -->
				<img
					src="/favicon-blue-1.png"
					width="32px"
					height="32px"
					class="block dark:hidden md:hidden h-10 w-10"
					alt="Monierate Logo"
				/>
				<!-- Mobile: favicon (dark mode) -->
				<img
					src="/favicon-white-1.png"
					width="32px"
					height="32px"
					class="hidden dark:block md:dark:hidden h-10 w-10"
					alt="Monierate Logo"
				/>
				<!-- Desktop: full logo (light mode) -->
				<img
					src="/monierate-blue-black-1.png"
					width="142px"
					height="24px"
					class="hidden md:block dark:md:hidden h-auto w-[142px]"
					alt="Monierate Logo"
				/>
				<!-- Desktop: full logo (dark mode) -->
				<img
					src="/monierate-logo-white-1.png"
					width="142px"
					height="24px"
					class="hidden md:dark:block h-auto w-[142px]"
					alt="Monierate Logo"
				/>
			</a>

			<div class="flex items-center md:order-2">
				{#if auth?.isLoggedIn}
					<a
						href="{ACCOUNT_URL}/"
						target="_blank"
						rel="noopener noreferrer"
						class="button px-4 md:inline-block"
					>
						Dashboard
					</a>
				{:else}
					<a
						href="{ACCOUNT_URL}/auth/signup"
						target="_blank"
						rel="noopener noreferrer"
						class="button px-4 md:inline-block"
					>
						Get API Key
					</a>
				{/if}

				<button
					type="button"
					class="inline-flex items-center ml-3 justify-center text-sm text-blue-500 md:hidden focus:outline-none"
					aria-controls="api-navbar"
					aria-expanded={menuOpen}
					onclick={() => (menuOpen = !menuOpen)}
				>
					<span class="sr-only">Open main menu</span>
					<svg
						class="w-6 h-6"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 17 14"
					>
						<path
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M1 4h15M1 10h15"
						/>
					</svg>
				</button>
			</div>

			<div
				id="api-navbar"
				class="items-center justify-between w-full md:flex md:w-auto md:order-1"
				class:hidden={!menuOpen}
			>
				<ul class="nav-link">
					{#each links as link}
						<li>
							<a
								href={link.href}
								target={link.external ? '_blank' : undefined}
								rel={link.external ? 'noopener noreferrer' : undefined}
								onclick={() => (menuOpen = false)}
							>
								{link.label}
							</a>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</nav>
</header>

<style>
	.nav-link {
		@apply flex flex-col p-4 md:p-0 mt-4 md:flex-row md:space-x-8 md:mt-0;
	}
	.nav-link a {
		@apply font-semibold block py-2 pl-3 pr-4 md:p-0;
		font-family: var(--font-head);
		color: var(--text-secondary);
		transition: color 0.15s ease;
	}
	.nav-link a:hover {
		color: var(--accent);
	}
</style>
