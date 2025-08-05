<!--**
 * TableComponent.svelte
 *
 * Usage:
 * <TableComponent
 *   {tableData}
 *   shrinkFirstColumn={true}
 *   sortBy={['Name', 'Market Cap']}
 * />
 *
 * Props:
 * - tableData: {
 *     head: string[],
 *     body: Array<{ [key: string]: string | number | [string, string] | { label: string; sub?: string; icon?: string } }>
 *   }
 * - shrinkFirstColumn: boolean (optional) – hides 1st column on small screens
 * - sortBy: string[] (optional) – list of column headers that are sortable
 *
 * Notes:
 * - Text like "+12%" or "- 5%" gets styled by color
 * - Icons can be font classes (e.g., "fa fa-google") or image URLs
 * - Supports pagination & responsive layout
 *
 *-->

<script lang="ts">
	import { browser } from '$app/environment';
	import { setUrlParam } from '$lib/functions';

	type TableValue =
		| string
		| number
		| [string, string]
		| { label: string; sub?: string; icon?: string; link: string };

	interface TableRow {
		[key: string]: TableValue;
	}

	export let tableData: {
		head: string[];
		body: TableRow[];
	};
	export let shrinkFirstColumn: boolean = false;
	export let sortBy: string[] | null = null;
	export let pagination: boolean = false;
	export let currentPage: number = 1;
	export let rowsPerPage: number = 100;
	let content: HTMLElement;

	// Pagination
	$: totalPages = Math.ceil((tableData.body.length || 0) / rowsPerPage);
	$: paginatedRows = tableData.body.slice(
		(currentPage - 1) * rowsPerPage,
		currentPage * rowsPerPage
	);

	function getPageButtons(): number[] {
		if (totalPages <= 5) {
			return Array.from({ length: totalPages }, (_, i) => i + 1);
		}

		if (currentPage <= 3) {
			return [1, 2, 3, 4, 5];
		} else if (currentPage >= totalPages - 2) {
			return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
		} else {
			return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
		}
	}

	function formatCell(value: TableValue, key: string): string {
		if (Array.isArray(value)) {
			const [left, right] = value;
			return `${parseValue(left, key)} ${parseValue(right, key)}`;
		}

		const link = (content: any) => {
			if (typeof value === 'object' && value !== null && 'link' in value) {
				return `<a href="${value.link}" class="text-gray-700 dark:text-gray-200">${content}</a>`;
			}
			return content;
		};

		if (typeof value === 'object' && value !== null && 'label' in value) {
			let iconHtml = '';

			if (Array.isArray(value.icon)) {
				// Handle icon array for <picture>
				const sources = value.icon
					.map((src) => {
						const type = src.endsWith('.svg')
							? 'image/svg+xml'
							: src.endsWith('.png')
							? 'image/png'
							: '';
						return `<source srcset="${src}" type="${type}" />`;
					})
					.join('');

				iconHtml = `
		        <picture class="inline-block h-6 w-6 mr-2 align-middle rounded-full">
			    ${sources}
			    <img src="${value.icon[0]}" alt="icon" class="h-6 w-6 rounded-full" />
		        </picture>
	            `;
			} else if (typeof value.icon === 'string') {
				if (value.icon.startsWith('fa')) {
					// Handle font-awesome icons
					iconHtml = `<i class="${value.icon} text-gray-500 mr-2"></i>`;
				} else {
					// Handle single image string
					iconHtml = `<img src="${value.icon}" alt="icon" class="inline-block h-6 w-6 mr-2 align-middle rounded-full" />`;
				}
			} else {
				iconHtml = '';
			}

			const labelHtml = parseValue(value.label, key);
			const subHtml = value.sub ? `<div class="text-gray-400 text-xs mt-1">${value.sub}</div>` : '';
			return link(`<div class="flex flex-col md:block">
			<span class="font-bold md:text-[17px] inline-flex items-center">${iconHtml}${labelHtml}</span>
			${subHtml}
		</div>`);
		}

		return parseValue(String(value), key);
	}

	function parseValue(stringVal: string, key: string): string {
		stringVal = stringVal.trim();

		// Trend chart
		if (key.toLowerCase().includes('trend')) {
			return `<img src="${stringVal}" alt="trend" class="h-8 w-24 object-contain mx-auto" />`;
		}

		// Percentages
		const percentMatch = stringVal.match(/([-+]\s?\d+(?:\.\d+)?%)/);
		if (percentMatch) {
			const raw = percentMatch[0];
			const colorClass = raw.includes('-')
				? 'text-red-500 bg-red-500/10'
				: 'text-green-500 bg-green-500/10';
			const styled = `<span class="${colorClass} p-1 rounded-md ml-1 text-sm">${raw}</span>`;
			return stringVal.replace(raw, styled);
		}

		return stringVal;
	}

	let sortDirection: 'asc' | 'desc' | 'default' = 'asc';
	let sortColumn: string | null = null;
	let originalRows: any = null;

	const sortTable = (column: string) => {
		if (!originalRows) originalRows = [...paginatedRows];
		
		// Toggle sort direction
		if (sortColumn === column) {
			if (sortDirection === 'asc') sortDirection = 'desc';
			else if (sortDirection === 'desc') sortDirection = 'default';
			else sortDirection = 'asc';
		} else {
			sortDirection = 'asc';
			sortColumn = column;
		}

		if (sortDirection === 'default') {
			paginatedRows = [...originalRows];
			return;
		}

		paginatedRows = [...paginatedRows].sort((a, b) => {
			const aVal = extractSortableValue(a[column]);
			const bVal = extractSortableValue(b[column]);

			// Compare numbers if both are numeric
			if (!isNaN(Number(aVal)) && !isNaN(Number(bVal))) {
				return sortDirection === 'asc' ? Number(aVal) - Number(bVal) : Number(bVal) - Number(aVal);
			}

			// Default to string comparison
			return sortDirection === 'asc'
				? String(aVal).localeCompare(String(bVal))
				: String(bVal).localeCompare(String(aVal));
		});
	};

	// Extracts the string or number value for sorting from various formats
	function extractSortableValue(value: any): string | number {
		if (typeof value === 'string' || typeof value === 'number') {
			return value;
		}

		if (Array.isArray(value)) {
			return value[0]; // Use first element of tuple
		}

		if (typeof value === 'object' && value !== null && 'label' in value) {
			return value.label;
		}

		return ''; // Fallback
	}

	const scrollToContent = () => {
		const offset = 200;
		if (browser && content) {
			const top = content.getBoundingClientRect().top + window.scrollY - offset;
			window.scrollTo({ top, behavior: 'smooth' });
		}
	};

	const gotoPage = (page: number) => {
		currentPage = page;
		setUrlParam('page', page);
		scrollToContent();
	};
</script>

<!-- TABLE -->
<div class="container p-0 w-full m-0 md:md:max-w-[1200px] md:m-auto" bind:this={content}>
	<div class="overflow-x-auto bg-inherit dark:bg-gray-900/60">
		<table class="text-sm text-gray-800 min-w-full table-auto">
			<thead
				class="bg-gray-50 dark:bg-gray-900 text-xs text-gray-900 dark:text-gray-200 font-semibold"
			>
				<tr>
					{#each tableData.head as column, i}
						<th
							class={`px-4 py-6 md:text-[15px] ${
								i < 2 ? 'text-left' : 'text-right'
							} whitespace-nowrap ${
								shrinkFirstColumn && i < 1 ? 'w-10 hidden md:table-cell' : ''
							} ${shrinkFirstColumn && i === 1 ? 'pr-36 md:pr-4' : ''}`}
						>
							{column}
							{#if sortBy && sortBy.includes(column)}
								<button
									class="ml-2"
									on:click={() => {
										sortTable(column);
									}}
									aria-label="Sort table"
								>
									<i class="fa fa-sort" />
								</button>
							{/if}
						</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each paginatedRows as row}
					<tr class="border-t dark:border-gray-700">
						{#each tableData.head as column, i}
							<td
								class={`px-4 py-3 ${i < 2 ? 'text-left' : 'text-right'} whitespace-nowrap ${
									shrinkFirstColumn && i < 1 ? 'w-10 hidden md:table-cell' : ''
								} dark:text-gray-200`}
							>
								<span class="inline-flex items-center">{@html formatCell(row[column], column)}</span
								>
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- PAGINATION -->
	{#if pagination}
		<div
			class="flex flex-wrap justify-center md:justify-between items-center px-4 py-3 pt-8 md:pt-10 border-t dark:border-gray-700 text-sm text-gray-600 bg-inherit dark:bg-gray-900/60"
		>
			<!-- Count -->
			<div class="hidden md:block">
				Showing {(currentPage - 1) * rowsPerPage + 1}
				to {Math.min(currentPage * rowsPerPage, tableData.body.length)}
				of {tableData.body.length} results
			</div>

			<!-- Buttons -->
			{#if tableData.body.length > 10}
				<div class="flex items-center gap-1">
					<!-- Prev -->
					<button
						class="px-3 py-1 rounded bg-gray-100 dark:bg-gray-900/60 hover:bg-gray-200 border-gray-200 dark:border-gray-700 border text-[11px]"
						on:click={() => (gotoPage(Math.max(1, currentPage - 1)), scrollToContent())}
						disabled={currentPage === 1}
						aria-label="Previous page"
					>
						<i class="fa fa-chevron-left" />
					</button>

					{#each getPageButtons() as page}
						{#if typeof page === 'string'}
							<span class="px-2 py-1 text-gray-400">…</span>
						{:else}
							<button
								class={`px-3 py-1 rounded ${
									page === currentPage
										? 'bg-blue-600 text-white border-blue-700'
										: 'bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 border-gray-400 dark:border-gray-700'
								} border`}
								on:click={() => (gotoPage(page), scrollToContent())}
								aria-label="Page ${page}"
							>
								{page}
							</button>
						{/if}
					{/each}

					<!-- Next -->
					<button
						class="px-3 py-1 rounded bg-gray-100 dark:bg-gray-900/60 hover:bg-gray-200 border-gray-200 dark:border-gray-700 border text-[11px]"
						on:click={() => (gotoPage(Math.min(totalPages, currentPage + 1)), scrollToContent())}
						disabled={currentPage === totalPages}
						aria-label="Next page"
					>
						<i class="fa fa-chevron-right" />
					</button>
				</div>
			{/if}

			<!-- Row count -->
			<div class="flex items-center gap-2 hidden md:block">
				<span>Row</span>
				<select
					class="border rounded px-2 py-1 text-sm dark:bg-gray-900/60 border-gray-200 dark:border-gray-700 dark:text-gray-200"
					bind:value={rowsPerPage}
					on:change={() => (gotoPage(1), scrollToContent())}
					id="rowsPerPage"
				>
					<option value="10">10</option>
					<option value="25">25</option>
					<option value="50">50</option>
					<option value="100">100</option>
				</select>
			</div>
		</div>
	{/if}
</div>
