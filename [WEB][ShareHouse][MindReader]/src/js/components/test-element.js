import { LitElement, html } from 'lit-element'
import { css } from 'emotion'

class TestElement extends LitElement {	
	static get properties() {
		return { 
			test: { type: String},
		}
	}
    
	constructor() {
		super()
        
		this.test = `test text`
	}
    
	createRenderRoot() {
		return this
	}  

	render() {
		return html`        
		<div class="${style}">
				Test
		</div>  
		`
	}    
}

const style = css`
& {
   color: black;
}
`

customElements.define(`test-element`, TestElement)
