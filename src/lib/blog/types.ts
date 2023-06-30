export type Tags = 'virtualcard' | 'currency' | 'company' | 'finance' | 'engineering'

export type Post = {
	title: string
	slug: string
	description: string
	image: string
	createdAt: string
	updatedAt: string
	tag: Tags
	published: boolean
}