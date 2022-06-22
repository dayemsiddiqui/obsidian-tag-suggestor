import nlp from "compromise"


// Suggests tags using string similarity: https://www.npmjs.com/package/string-similarity

export const getTags = (content: string): string[] => {
	let doc = nlp(content)
	const tags = doc.hashTags().termList().map((term) => term.text)
	return tags
}
