import { xhrOCR } from '../components/ocr-api.js'

addAlt()

function addAlt() {
	[...document.querySelectorAll(`img`)].forEach(async img => {
		const src = img.src
		const type = isType(img, `png`) || isType(img, `jpg`) || isType(img, `jpeg`)

		if (type === null) {
			return
		}

		if (img.alt.trim().length > 0) {
			return
		}
    
		const data = await xhrOCR(src, type)				
		const originalImg = document.querySelector(`img[src="${src}"]`)
		if (originalImg) {
			originalImg.alt = data.join(`, `)
		}		
	})
}

function isType(img, type) {
	if (img.src.includes(`.${type}`)) {
		return type
	}
	return null
}
