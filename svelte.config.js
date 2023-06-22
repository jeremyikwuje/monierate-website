import adapter from '@sveltejs/adapter-auto';
import preprocess from "svelte-preprocess";
import { mdsvex } from 'mdsvex'

/** @type {import('@sveltejs/kit').Config} */
/** @type {import {'mdsvex'}.MdsvexOptions} */

const mdsvexOptions = {
	extensions: ['.md'],
	layout: {
		blog: './src/blog/mdsvex.svelte'
	},
}

const config = {
	extensions: ['.svelte', '.md'],
	kit: {
		adapter: adapter()
	},
	preprocess: [
		preprocess({
			postcss: true,
		}),
		mdsvex(mdsvexOptions)
	],
};

export default config;
