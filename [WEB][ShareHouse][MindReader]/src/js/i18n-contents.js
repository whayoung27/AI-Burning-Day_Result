/* JavaScript for Internalization Support */
(function () {
	`use strict`
	const content = document.querySelectorAll(`[i18n-content]`)
	if (content) {
		content.forEach(node => {
			const key = node.getAttribute(`i18n-content`)
			const value = chrome.i18n.getMessage(key)
			node.innerHTML = value
		})
	}
}())
