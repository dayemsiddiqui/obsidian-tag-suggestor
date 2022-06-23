import nlp from "compromise"
import Three from "compromise/types/view/three";


// Suggests tags using string similarity: https://www.npmjs.com/package/string-similarity

export const extractTags = (content: string): string[] => {
	let doc = nlp(content)
	const tags = doc.hashTags().termList().map((term) => term.text)
	return tags
}

export const generateTags = (content: string): string[] => {
	let normalizedContent = nlp(content).normalize().toLowerCase().text()
	let doc = nlp(normalizedContent)
	let tags: string[] = [];
	const nouns =  doc.nouns().toLowerCase().termList().map((term) => term.text)
	const hyphenated = doc.hyphenated().toLowerCase().termList().map((term) => term.text)
	const chunks = doc.chunks().toLowerCase().termList().map((term) => term.text)
	const clauses = doc.clauses().toLowerCase().termList().map((term) => term.text)
	const processed = tags
		.concat(textFilter(doc, nouns))
		.concat(textFilter(doc, hyphenated))
		.concat(textFilter(doc, chunks))
		.concat(textFilter(doc, clauses))
	tags = Array.from(new Set(processed).values()).map((tag) => toTagFormat(tag.toString()))

	return tags
}


export const textFilter	= (doc: Three, content: string[]): string[]=> {
	const prepositions = doc.prepositions().toLowerCase().termList().map((term) => term.text)
	const conjunctions  = doc.conjunctions().toLowerCase().termList().map((term) => term.text)
	const pronouns  = doc.pronouns().toLowerCase().termList().map((term) => term.text)
	const adjectives = doc.adjectives().toLowerCase().termList().map((term) => term.text)
	const adverbs = doc.adverbs().toLowerCase().termList().map((term) => term.text)
	const articles = ['a', 'an', 'the']
	const demonstratives = ['this', 'that', 'there', 'here','where', 'when', 'how', 'what', 'is']
	const blacklist = ['associations', 'createdat', "---", "#---", "---#"]
	return  content.filter(x => !prepositions.includes(x) ) // Filter out prepositions
		.filter(x => !conjunctions.includes(x)) // Filter out conjunctions
		.filter(x => !pronouns.includes(x)) // Filter out pronouns
		.filter(x => !articles.includes(x)) // Filter out articles
		.filter(x => !demonstratives.includes(x)) // Filter out demonstratives
		.filter(x => !blacklist.includes(x)) // Filter out blacklist entries
		.filter(x => !adjectives.includes(x)) // Filter out adjectives
		.filter(x => !adverbs.includes(x)) // Filter out adverbs
}

const toTagFormat = (content: string): string => { return "#".concat(content)}
