export default function importIcon(path: string) {
	try {
		// return new URL(`../assets${path}`, import.meta.url).href
		return new URL(path.replace(/\s*/g, ""), import.meta.url).href;
	} catch (e) {
		// return new URL('../assets/image/icons/unknown.png', import.meta.url).href
	}
}
