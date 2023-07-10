
export async function load({ fetch, params }) {
	const tag = params.tag || ''
	return { tag }
}
