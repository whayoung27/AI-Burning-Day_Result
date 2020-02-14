import { LitElement, html } from 'lit-element'
import { css } from 'emotion'

import './audio-box.js'

class MusicBox extends LitElement {	
	static get properties() {
		return { 
			isOff: { type: Boolean },
		}
	}

	constructor() {
		super()
				
		this.pos1 = 0
		this.pos2 = 0 
		this.pos3 = 0 
		this.pos4 = 0
		this.isDrag = false
		this.isOff = false
		this.top = 0
		this.left = 0

		this.syncData()
	}
    
	createRenderRoot() {
		return this
	}  

	firstUpdated() {
		this.dragElement(this.querySelector(`#musicBox`))
	}

	render() {
		return html`        		
		<div class="${style}">
			<div id="musicBox" @mouseup=${this.onClickMusicBox}>
				${this.isOff ? html`<i class="fas fa-microphone-alt-slash fa-5x"></i>` : html`<i class="fas fa-microphone-alt fa-5x"></i>`}
				<audio-box></audio-box>
			</div>
		</div>  
		`
	}
	
	get onClickMusicBox() {
		const root = this
		return {
			async handleEvent() {	
				if (!root.isDrag) {
					const isOff = await root.getWhaleData()										
					if (isOff) {												
						chrome.storage.sync.set({"isOff": false})						
						root.querySelector(`audio-box`).play()
						return
					}					
					root.querySelector(`audio-box`).stop()
					chrome.storage.sync.set({"isOff": true})
				}				
			},
			capture: true,
		}
	}

	syncData() {
		const root = this		

		// 스토리지 탭간 데이터 동기화 - 나중에 코드 축약 가능
		chrome.storage.onChanged.addListener(obj => {
			if (obj.isOff && obj.isOff.newValue) {
				root.isOff = true
				root.querySelector(`#musicBox`).classList.remove(`show`)				
			} else {
				root.isOff = false
				root.querySelector(`#musicBox`).classList.add(`show`)
			}			
			
			if (obj.musicBoxTop) {
				root.top = obj.musicBoxTop.newValue
				root.querySelector(`#musicBox`).style.top = obj.musicBoxTop.newValue
			}

			if (obj.musicBoxLeft) {
				root.left = obj.musicBoxLeft.newValue
				root.querySelector(`#musicBox`).style.left = obj.musicBoxLeft.newValue
			}
		})			
		
		chrome.storage.sync.get([`isOff`, `musicBoxTop`, `musicBoxLeft`], result => {
			const isOff = result.isOff			
			
			if (isOff) {
				root.querySelector(`#musicBox`).classList.remove(`show`)
				root.isOff = true
			} else {												
				root.querySelector(`#musicBox`).classList.add(`show`)
				root.isOff = false
			}

			// 위치 동기화 (초기) - 나중에 코드 축약 가능			
			// 초기화 함수
			if (!result.musicBoxTop) {								
				chrome.storage.sync.set({"musicBoxTop": `50px`})
				root.querySelector(`#musicBox`).style.bottom = `50px`
			} else {
				root.top = result.musicBoxTop
				root.querySelector(`#musicBox`).style.top = root.top
			}

			if (!result.musicBoxLeft) {
				chrome.storage.sync.set({"musicBoxLeft": `50px`})
				root.querySelector(`#musicBox`).style.right = `50px`
			} else {
				root.left = result.musicBoxLeft			
				root.querySelector(`#musicBox`).style.left = root.left
			}			
		})
	}

	getWhaleData() {
		return new Promise(resolve => {
			const root = this
			chrome.storage.sync.get([`isOff`], result => {
				const isOff = result.isOff
				root.isOff = isOff
				resolve(isOff)
			})
		})		
	}

	dragElement(elmnt) {
		let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0

		if (document.querySelector(`#musicBox`)) {
			document.querySelector(`#musicBox`).onmousedown = dragMouseDown
		} else {
			elmnt.onmousedown = dragMouseDown
		}
	
		function dragMouseDown(e) {
			e = e || window.event
			e.preventDefault()						

			pos3 = e.clientX
			pos4 = e.clientY
			document.onmouseup = closeDragElement
			document.onmousemove = elementDrag
		}
	
		function elementDrag(e) {			
			e = e || window.event
			e.preventDefault()
			const top = Number(elmnt.style.top.split(`px`)[0])
			const left = Number(elmnt.style.left.split(`px`)[0])
			const musicBox = document.querySelector(`music-box`)			
			musicBox.isDrag = true

			pos1 = pos3 - e.clientX
			pos2 = pos4 - e.clientY
			pos3 = e.clientX
			pos4 = e.clientY

			// 화면 밖으로 나가면 초기화 (상하)
			unlimitTop(top)
			unlimitBottom(top)
			unlimitLeft(left)
			unlimitRight(left)
			elmnt.style.top = `${elmnt.offsetTop - pos2 }px`	
			elmnt.style.left = `${elmnt.offsetLeft - pos1 }px`
		}
	
		function closeDragElement() {
			const musicBox = document.querySelector(`music-box`)
						
			chrome.storage.sync.set({"musicBoxTop": elmnt.style.top})
			chrome.storage.sync.set({"musicBoxLeft": elmnt.style.left})
			
			musicBox.isDrag = false			
			document.onmouseup = null
			document.onmousemove = null					
		}

		// 나중에 코드 축약 가능함
		function unlimitTop(top) {
			if (top < 0) {
				elmnt.style.top = `${elmnt.offsetTop + 10 }px`
			}	
		}

		function unlimitBottom(top) {
			if (top > window.innerHeight - 80) {
				elmnt.style.top = `${elmnt.offsetTop - 10 }px`
			}	
		}

		function unlimitLeft(left) {
			if (left < 0) {
				elmnt.style.left = `${elmnt.offsetLeft + 10 }px`
			}	
		}

		function unlimitRight(left) {
			if (left > window.innerWidth - 100) {
				elmnt.style.left = `${elmnt.offsetLeft - 10 }px`
			}	
		}
	}
}

const style = css`
& {
	position: fixed;
	z-index: 10000000;	

	#musicBox {	
		position: fixed;	
		z-index: 9;
		background-color: #B4B9BF;
		text-align: center;
		border-radius: 100%;	
		
		width: 100px;
		height: 100px;
		cursor: pointer;
		transition: background-color 0.5s ease;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3), 0 0 40px rgba(128, 128, 128, 0.1) inset;

		&:hover {
			background-color: #04CF5C;
		}

		&.show {
			background-color: #04CF5C;
		}

		&.hide {
			display: none;
		}

		.fas:before {			
			font-size: 50px;
			color: white;
			left: 50%;
			top: 50%;
			position: absolute;
			transform: translate(-50%, -50%);
		}
	}
}
`

customElements.define(`music-box`, MusicBox)
