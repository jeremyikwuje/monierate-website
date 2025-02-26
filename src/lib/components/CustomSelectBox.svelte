<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
  
	export let options: any = [];
	export let className = '';
	export let selected: any = '';
	export let labelValues: boolean = false;
	export let id = "";
	let selectedIcon: string;
	let searchQuery = '';
	let filtered = options;
  
	let isOpen = false;
	let dropdown: any;
	const dispatch = createEventDispatcher();
  
	const toggleDropdown = () => {
	  isOpen = !isOpen;
	};
  
	const selectOption = (option: any) => {
	  selected = option.value ? option.value : option.label;
	  selectedIcon = option.icon;
	  isOpen = false;
	  dispatch('select', option);
	};
  
	const handleClickOutside = (event: any) => {
	  if (dropdown && !dropdown.contains(event.target)) {
		isOpen = false;
	  }
	};
  
	$: filtered = options.filter((option: any) =>
	  option.label.toLowerCase().includes(searchQuery.toLowerCase()) || option?.value?.toLowerCase()?.includes(searchQuery.toLowerCase())
	);
  
	const isImage = (icon: string) => /^(https?:\/\/|\/|\.\/|\.\.).*\.(png|jpg|jpeg|gif|svg)$/.test(icon);
  
	onMount(() => {
	  if (selected && options.length > 0) {
		const selectedOption = options.find((option: any) => option.label === selected || option?.value === selected);
		if (selectedOption) {
		  selectedIcon = selectedOption.icon;
		}
	  }
	  document.addEventListener('click', handleClickOutside);
	  return () => {
		document.removeEventListener('click', handleClickOutside);
	  };
	});
  </script>
  
  <div class={`relative w-auto inline-block`} bind:this={dropdown} id={id}>
	<button
	  class="w-full bg-gray-50 dark:bg-gray-800 text-dark dark:text-white px-4 py-2 rounded-md flex justify-between items-center border border-gray-300 dark:border-gray-600 hover:border-gray-400 w-64 {className}"
	  on:click={toggleDropdown}
	>
	  <span class="inline-flex">
		{#if selectedIcon}
		  {#if isImage(selectedIcon)}
			<img src={selectedIcon} alt="icon" class="mr-2 w-5 h-5" />
		  {:else}
			<i class={`mr-2 ${selectedIcon}`} />
		  {/if}
		{/if}
		{selected || 'Select'}
	  </span>
	  <svg
		class="w-4 h-4 ml-2 transform {isOpen ? 'rotate-180' : ''}"
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 20 20"
		fill="currentColor"
	  >
		<path
		  fill-rule="evenodd"
		  d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 011.08 1.04l-4.24 4.24a.75.75 0 01-1.08 0l-4.24-4.24a.75.75 0 01.02-1.06z"
		  clip-rule="evenodd"
		/>
	  </svg>
	</button>
  
	{#if isOpen}
	  <div class="absolute z-10 mt-2 w-full bg-gray-50 text-dark dark:bg-gray-800 dark:text-white rounded-md shadow-lg border border-gray-300 dark:border-gray-600 min-w-64">
		{#if options.length > 5}
		  <div class="p-4">
			<div class="flex items-center px-2 border-b border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-md">
			  <i class="fa fa-search" />
			  <input
				type="text"
				class="w-full px-4 py-2 text-dark dark:text-white focus:outline-none bg-gray-50 dark:bg-gray-700"
				placeholder="Search..."
				bind:value={searchQuery}
			  />
			</div>
		  </div>
		{/if}
		<ul class="max-h-48 overflow-y-auto custom-scrollbar">
		  {#each filtered as option}
			<li
			  class="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
			  on:click={() => selectOption(option)}
			>
			  {#if isImage(option.icon)}
				<img src={option.icon} alt="icon" class="mr-2 w-5 h-5" />
			  {:else}
				<i class={`mr-2 ${option.icon}`} />
			  {/if}
			  <span>{option.label} {labelValues ? `(${option.value})` : ''} </span>
			</li>
		  {/each}
		</ul>
	  </div>
	{/if}
  </div>
  
  <style>
	.rotate-180 {
	  transform: rotate(180deg);
	}
	.custom-scrollbar::-webkit-scrollbar {
	  width: 8px;
	}
  
	.custom-scrollbar::-webkit-scrollbar-track {
	  background: #f1f1f1;
	}
  
	.custom-scrollbar::-webkit-scrollbar-thumb {
	  background-color: #888;
	  border-radius: 4px;
	}
  
	.custom-scrollbar::-webkit-scrollbar-thumb:hover {
	  background: #555;
	}
  </style>