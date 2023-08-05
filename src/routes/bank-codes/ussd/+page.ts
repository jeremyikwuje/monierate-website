import { error } from '@sveltejs/kit'

export async function load({ params }) {
	let codes = await import(`../../../data/bank-ussd.json`)
    let banks = await import(`../../../data/banks.json`)

    codes = JSON.parse(JSON.stringify(codes.default))
    banks = JSON.parse(JSON.stringify(banks.default))

    console.log(codes)
    console.log(banks)

	try {
		return {
			codes,
            banks: banks.ng
		}
	} catch (e) {
		throw error(404, `Could not find ussd codes`)
	}
}