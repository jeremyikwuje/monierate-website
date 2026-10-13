<script lang="ts">
	import { BOOKING_URL } from '$lib/config';
</script>

<!-- Standalone, distraction-free header for the API landing page: logo and one CTA -->
<header class="mb-0">
	<nav
		class="w-full z-20 top-0 left-0"
		style="background: var(--page-bg); border-bottom: 1px solid var(--card-border);"
	>
		<div class="w-[95%] md:max-w-[1200px] flex items-center justify-between mx-auto p-4">
			<a href="/" class="flex items-center">
				<!-- Mobile: favicon -->
				<img
					src="/favicon-blue-1.png"
					width="32px"
					height="32px"
					class="block md:hidden h-10 w-10"
					alt="Monierate Logo"
				/>
				<!-- Desktop: full logo -->
				<img
					src="/monierate-blue-black-1.png"
					width="142px"
					height="24px"
					class="hidden md:block h-auto w-[142px]"
					alt="Monierate Logo"
				/>
			</a>

			<a
				href={BOOKING_URL}
				target="_blank"
				rel="noopener noreferrer"
				class="button px-4 inline-block"
			>
				Book a Demo
			</a>
		</div>
	</nav>
</header>
