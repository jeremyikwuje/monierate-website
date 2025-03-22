<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	interface Tip {
		label: string;
		value: string;
	}

	export let tip: Tip;
	export let trigger: 'click' | 'hover' = 'click';

	const isOpen = writable(false);

	function toggle() {
		if (trigger === 'click') {
			isOpen.update((v) => !v);
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			toggle();
		}
	}

	function handleClickOutside(event: MouseEvent) {
		if (!(event.target as HTMLElement).closest('.tip-container')) {
			isOpen.set(false);
		}
	}

	onMount(() => {
		document.addEventListener('click', handleClickOutside);
		return () => document.removeEventListener('click', handleClickOutside);
	});
</script>

<div
	class="relative w-fit cursor-pointer tip-container"
	on:click={toggle}
	on:keydown={handleKeydown}
	on:mouseenter={() => trigger === 'hover' && isOpen.set(true)}
	on:mouseleave={() => trigger === 'hover' && isOpen.set(false)}
	tabindex="0"
	role="button"
	aria-expanded={$isOpen}
>
	<div class="flex items-center gap-2">
		<span>{tip.label}</span>
		<i
			class="fas fa-chevron-down w-4 h-4 transition-transform"
			style="transform: rotate({$isOpen ? '180deg' : '0deg'})"
		/>
	</div>
	<div
		class="absolute left-0 mt-2 w-56 p-2 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 shadow-md rounded-lg border border-gray-200 dark:border-gray-700 transition-opacity duration-200 z-10"
		class:hidden={!$isOpen}
	>
		{tip.value}
	</div>
</div>
