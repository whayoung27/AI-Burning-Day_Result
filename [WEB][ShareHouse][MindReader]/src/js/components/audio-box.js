import { LitElement, html } from 'lit-element'
import { css } from 'emotion'

import { xhrCss } from './css-api.js'

class AudioBox extends LitElement {	
	static get properties() {
		return { 
			test: { type: String},
		}
	}
    
	constructor() {
		super()
        
		this.pastText = ``
	}
    
	createRenderRoot() {
		return this
	}  

	render() {
		return html`        
		<div class="${style}">
			<audio id="audio" controls>
				<source id="source" src="" type="audio/mpeg"/>
			</audio>
		</div> 
		`
	} 

	firstUpdated() {
		this.playAudio()
		this.hoverEvent()
	}

	async playAudio() {
		const audioSrc = await xhrCss(`mijin`, `0`, `음성 안내를 시작합니다`)		
		const blobUrl = URL.createObjectURL(audioSrc)
		
		this.querySelector(`#source`).setAttribute(`src`, blobUrl)
    
		// this.saveFile(`test.mp3`, audioSrc)	
		
		if (this.querySelector(`#audio`)) {
			this.querySelector(`#audio`).pause()
			this.querySelector(`#audio`).load()		
		}		
	}
  
	play() {
		this.querySelector(`#audio`).play()
	}

	stop() {
		this.querySelector(`#audio`).pause()
	}

	playDirect(audio) {
		const blobUrl = URL.createObjectURL(audio)
		
		this.querySelector(`#source`).setAttribute(`src`, blobUrl)    
		
		if (this.querySelector(`#audio`)) {
			this.querySelector(`#audio`).pause()
			this.querySelector(`#audio`).load()		
			this.play()	
		}		
	}
  
	saveFile(fileName, content) {		

		const objURL = window.URL.createObjectURL(content)
            
		if (window.__Xr_objURL_forCreatingFile__) {
			window.URL.revokeObjectURL(window.__Xr_objURL_forCreatingFile__)
		}
		window.__Xr_objURL_forCreatingFile__ = objURL
 
		const a = document.createElement(`a`)
 
		a.download = fileName
		a.href = objURL
		a.click()
	}

	hoverEvent() {		
		document.body.addEventListener(`mouseover`, async event => {	
			const target = event.target
			const isOff = document.querySelector(`music-box`).isOff
			let sound

			// 여기 무조건 리팩토링 해야함. complexity 너무 높음
			if (isOff) {
				return
			}

			if (target.localName !== `img` && !target.textContent.trim()) {
				// console.info(`빈곳임`, target.localName)
				return
			}

			if (this.pastText === target.textContent) {
				// console.info(`같은 곳임`)
				return
			}

			this.pastText = target.textContent			

			if (target.localName === `em` || target.localName === `string`) {
				// console.info(`작은 곳임`)
				return
			}			

			if (target.localName !== `img` && target.clientHeight > 500) {
				// console.info(`너무 큼`)
				return
			}

			target.style.border = `2px dashed #04CF5C`

			if (target.localName === `img`) {
				sound = await xhrCss(`mijin`, `0`, target.alt)				
			} else {
				sound = await xhrCss(`mijin`, `0`, target.textContent)				
			}			
			this.playDirect(sound)
			
		}, true)

		document.body.addEventListener(`mouseout`, () => {
			const target2 = event.target
			target2.style.border = `none`
			this.stop()
		})
	}
}

const style = css`
audio {
  display: none;
}
`

customElements.define(`audio-box`, AudioBox)
