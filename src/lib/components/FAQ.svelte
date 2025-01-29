<script lang="ts">
    export let faqItems: Array<{question: string, answer: string}>;
    export let coverPage: boolean = true;
	let openQuestion: any = null;
	function toggleQuestion(index: any) {
		openQuestion = openQuestion === index ? null : index;
	}
</script>

<div class="container py-10 px-5">
    <div class="{coverPage ? '' : 'max-w-3xl m-auto'}">
        <h3 class="text-2xl font-bold mb-10 {coverPage ? '' : 'text-center'}">Frequently asked questions</h3>
    
        {#each faqItems as { question, answer }, index}
            <div class="border-b border-gray-300 dark:border-gray-600">
                <button
                    on:click={() => toggleQuestion(index)}
                    class="w-full text-left py-4 flex justify-between items-center"
                >
                    <span class="text-xl font-medium {openQuestion === index ? 'text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'}">{question}</span>
    
                    <svg
                        class={`w-6 h-6 transition-transform duration-300 ease-in-out ${
                            openQuestion === index ? 'rotate-180' : ''
                        }`}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </button>
    
                <div
                    class={`overflow-hidden transition-all duration-500 ease-in-out ${
                        openQuestion === index ? 'max-h-screen py-4' : 'max-h-0'
                    }`}
                >
                    <p class="px-4 text-gray-600 dark:text-gray-400">{@html answer}</p>
                </div>
            </div>
        {/each}
    </div>
</div>