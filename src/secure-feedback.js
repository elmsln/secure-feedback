import { LitElement, html, css } from 'lit';
import "@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";

class SecureFeedback extends LitElement {
  static properties = {
    loading: { type: Boolean, reflect: true },
  }

  static styles = css`
    :host {
      display: block;
      margin: 20px auto;
      max-width: 800px;
      visibility: visible;
      opacity: 1;
      transition: opacity 2s ease-in-out, visibility 2s ease-in-out;
    }
    :host([loading]) .slot {
      opacity: 0;
      visibility: hidden;
      height: 0;
    }
  `;

  constructor() {
    super();
    this.loading = false;
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.updateMessage();
  }

  updateMessage() {
    this.loading = true;
    const currentURL = new URL(window.location.href); 
    const getParam = currentURL.searchParams.get('message');
    fetch('/api/aes256', {
      method: 'POST',
      body: JSON.stringify({ op: 'decode', data: getParam}),
    })
    .then((response) => response.ok ? response.json() : null)
    .then((data) => {
      this.loading = false;
      this.innerHTML = '';
      this.innerHTML = data.data;
      // give dom time to notice all these new tags being appended
      setTimeout(() => {
        if (window.WCAutoload) {
          window.WCAutoload.process();
        }          
      }, 0);
    })
    .catch((error) => {
      console.error('Error:', error);
    }
    );
  }

  render() {
    return html`
      ${this.loading ? html`<div>Loading<simple-icon-lite icon="hax:loading"></simple-icon-lite></div>` : html``}
      <div class="slot"><slot></slot></div>
    `;
  }
}

customElements.define('secure-feedback', SecureFeedback);