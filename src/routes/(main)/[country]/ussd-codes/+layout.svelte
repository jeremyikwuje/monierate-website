<script lang="ts">
	import { page } from '$app/stores';
	export let data;

	$: currentPath = $page.url.pathname;
	$: bankName = data.bankName;
	$: countryName = data.countryName;

    let countryCode = data.countryCode;
	let openQuestion: any = null;

	function toggleQuestion(index: any) {
		openQuestion = openQuestion === index ? null : index;
	}
</script>

<div class="bg-white dark:bg-gray-800">
	<div class="container">
		<!-- Landscape Top/Bottom -->
		<div class="cedar-money">
			<a href="https://bit.ly/3zfhZgz" target="_blank">
				<picture>

                    <source srcset="/media/banners/cedar-converter-2.avif" type="image/avif">    
                    <source srcset="/media/banners/cedar-converter-2.gif" type="image/gif">

					<img
						src="/media/banners/cedar-converter-2.avif"
						alt="Cedar Money"
						width="600"
						height="114px"
						class="mx-auto max-w-full md:w-[800px] md:h-[114px]"
					/>

                </picture>
			</a>
		</div>
	</div>
</div>

<slot />

<div>
    <div class="container mt-8">
        <div>
            <h3 class="text-2xl font-bold mb-4">
                USSD Banking: Your Guide to Seamless Mobile Transactions in
				{(currentPath.endsWith('/swift-codes') || currentPath.endsWith('/swift-codes/')) ? 'Africa' : countryName}
            </h3>
            <p class="text-sm mb-4">
				USSD banking allows you to perform financial transactions directly from your mobile phone, even without an internet connection. 
				It's fast, simple, and secure—perfect for managing your money on the go.
            </p>
            <p class="text-sm mb-4">
				A USSD <strong>(Unstructured Supplementary Service Data)</strong> code is a protocol used by mobile networks 
				to communicate directly with a user's phone via short codes. It provides instant, 
				session-based communication, often used for services like balance checks, mobile money transactions, and subscriptions.
            </p>
        </div>
    </div>
    
    <div class="container mt-4">
        <h3 class="text-2xl font-bold mb-4">How USSD Banking Works:</h3>
        <ul class="pl-2">
            <li class="text-sm mb-4">
                <strong>Dial a Code:</strong> Each bank has a unique USSD code, like *737# for GTBank or *894# for FirstBank.
            </li>
            <li class="text-sm mb-4">
                <strong>Select a Service:</strong> Follow the prompts to perform tasks such as transfers, bill payments, airtime top-ups, or balance inquiries.
            </li>
            <li class="text-sm mb-4">
                <strong>Secure Transactions:</strong> You'll often need a PIN or OTP to complete transactions, ensuring your account stays safe.
            </li>
        </ul>
    </div>

    <div class="container mt-4">
        <h3 class="text-2xl font-bold mb-4">How to Register for USSD Banking:</h3>
        <ul class="pl-2">
            <li class="text-sm mb-4">
                Dial your bank’s USSD code (e.g., *000#)
            </li>
            <li class="text-sm mb-4">
                Follow the prompts to link your account.
            </li>
            <li class="text-sm mb-4">
                Set up a PIN for secure transactions.
            </li>
        </ul>
    </div>
    
</div>

<div class="container py-10 px-5">
	<h3 class="text-2xl font-bold mb-4">Frequently asked question?</h3>

	{#each faqItems as { question, answer }, index}
		<div class="border-b border-gray-700">
			<button
				on:click={() => toggleQuestion(index)}
				class="w-full text-left py-4 flex justify-between items-center"
			>
				<span class="text-xl font-medium">{question}</span>

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

<div class="container mt-5">
	<h3 class="text-2xl font-bold mb-4">Disclaimer</h3>
	<p class="text-sm mb-4">
        The tools provided on this website are for informational purposes only. While we strive for
		accuracy, we cannot guarantee the correctness of the data. Always verify SWIFT codes with your
		bank, especially for important or time-sensitive transactions.
	</p>
</div>

<script context="module">
	export const faqItems = [
		{
			question: 'What is a USSD Code?',
			answer: `
              A USSD (Unstructured Supplementary Service Data) code is a short numeric code (like *737# or *894#) 
			  that allows users to access banking services through any mobile phone without requiring internet access. 
			  It's widely used for quick and secure transactions, such as money transfers, airtime purchases, and bill payments.
            `
		},
		{
			question: 'Why Do You Need a USSD Code?',
			answer: 
                `You need a USSD code because it provides quick and easy access to various mobile services without
				requiring an internet connection. It allows you to perform tasks such as checking 
				your account balance, transferring funds, or subscribing to services in real time. 
				USSD codes are often more convenient than apps, especially in areas with poor connectivity, 
				as they operate over the mobile network. This immediacy and accessibility make USSD codes essential for managing mobile services efficiently.`
		}
	];
</script>