export type Tags = 'virtualcard' | 'guide' | 'company' | 'finance' | 'engineering'

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