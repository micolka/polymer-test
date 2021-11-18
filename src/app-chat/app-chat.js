import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';

/**
 * @customElement
 * @polymer
 */
class AppChat extends PolymerElement {
  constructor() {
    super()
    this.isButtonDisabled = true
    this.buttonStyleClass = 'btn-disabled'
    this.messages = [];
    this.boundChatMessage = this.getChatMessage.bind(this)
  }

  static get template() {
    return html`
      <style>
        :host {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        #messages {
          margin: 5px;
          padding: 10px;
          height: calc(100vh - 175px);
          overflow-y: auto;
          background-color: darkgray;
        
          display: flex;
          flex-direction: column;
        }
          
        #messages > div {
          padding: 10px;
          width: fit-content;
          border: 1px solid;
          border-radius: 5px;
          margin-bottom: 5px;
        }
          
        .chat-message-left {
          background-color: chocolate;
        }
        
        .chat-message-right {
          background-color: cornflowerblue;
          align-self: flex-end;
        }
        
        #controls {
          margin: 5px;
          height: 30px;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
        }
        
       input {
          width: calc(100% - 100px);
        }
        
       button {
          width: 80px;
          background-color: #6c60cd;
          color: #ffffff;
          cursor: pointer;
        }
        .btn-disabled {
          background-color: gray;
          cursor: default;
        }
      </style>
      <div id="messages"></div>
      <div id="controls">
        <input 
          type="text" 
          id="input-message"
          on-input="handleInput"
        >
        <button 
          id="send-message" 
          on-click="handleSendMessage"
          disabled="[[isButtonDisabled]]"
          class$="[[buttonStyleClass]]"
        >
          Send
        </button>
      </div>
    `;
  }

  connectedCallback() {
    super.connectedCallback()
    window.addEventListener('get-chat-message', this.boundChatMessage)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    window.removeEventListener('get-chat-message', this.boundChatMessage)
  }

  getChatMessage(e) {
    const message = e.detail.message
    this.messages.push({message, own: false})
    this._updateInnerHTML()
  }

  handleSendMessage() {
    const message = this.$['input-message'].value

    this.dispatchEvent(new CustomEvent('send-chat-message', {
      detail: {message},
      bubbles: true, 
      composed: true,
    }))

    this.messages.push({message, own: true})
    this._updateInnerHTML()
  }

  handleInput() {
    this.isButtonDisabled = !this.$['input-message'].value
    this.buttonStyleClass = this.isButtonDisabled ? 'btn-disabled' : '' 
  }

  _updateInnerHTML() {
    const inner = this.messages.reduce((prev, el) => {
        const elem = `
          <div class="chat-message-${el.own ? 'left' : 'right'}">
            ${el.message}
          </div>
        `
        return prev + elem
    }, '')

    this.$.messages.innerHTML = inner
    this.$.messages.scrollTop = this.$.messages.scrollHeight
  }
}

window.customElements.define('app-chat', AppChat);
