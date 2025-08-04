/**
 * Vapi Chatbot Embed Script
 * Easy-to-integrate chatbot for any website
 * 
 * Usage:
 * 1. Include this script in your HTML: <script src="vapi-chatbot-embed.js"></script>
 * 2. Configure your Vapi credentials in the config object below
 * 3. The chatbot will automatically initialize
 */

(function() {
    'use strict';

    // Configuration - Update these with your Vapi credentials
    const VAPI_CONFIG = {
        publicKey: 'd9eda860-9c14-4a5c-9fed-c8a22a92d97a', // Replace with your public key
        assistantId: 'd92bbcef-0ce5-48fa-b7c7-575aae277838', // Replace with your assistant ID
        consentKey: 'vapi_widget_consent',
        welcomeMessage: "Welcome! I'm Sara, your AI assistant. How can I help you today?",
        assistantName: "Sara",
        primaryColor: "#4c8697",
        position: "bottom-right" // Options: bottom-right, bottom-left
    };

    let Vapi = null;
    let chatManager = null;

    // Load Vapi SDK
    async function loadVapiSDK() {
        try {
            const module = await import('https://cdn.skypack.dev/@vapi-ai/web');
            Vapi = module.default;
            return true;
        } catch (error) {
            console.error('Failed to load Vapi SDK:', error);
            return false;
        }
    }

    // Inject CSS styles
    function injectStyles() {
        if (document.getElementById('vapi-chatbot-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'vapi-chatbot-styles';
        styles.textContent = `
            :root {
                --vapi-primary: ${VAPI_CONFIG.primaryColor};
                --vapi-primary-dark: color-mix(in srgb, ${VAPI_CONFIG.primaryColor} 80%, black);
                --vapi-secondary: #f8f9fa;
                --vapi-text: #333;
                --vapi-text-light: #666;
                --vapi-border: #e1e5e9;
                --vapi-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                --vapi-radius: 12px;
                --vapi-z-launcher: 1000;
                --vapi-z-window: 1001;
                --vapi-z-modal: 1002;
            }

            #vapi-chatbot-launcher {
                position: fixed;
                ${VAPI_CONFIG.position.includes('right') ? 'right: 24px;' : 'left: 24px;'}
                bottom: 24px;
                background: var(--vapi-primary);
                color: white;
                border: none;
                border-radius: 50px;
                padding: 16px 20px;
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                box-shadow: var(--vapi-shadow);
                transition: all 0.3s ease;
                z-index: var(--vapi-z-launcher);
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
            }

            #vapi-chatbot-launcher:hover {
                background: var(--vapi-primary-dark);
                transform: translateY(-2px);
                box-shadow: 0 6px 25px rgba(0, 0, 0, 0.2);
            }

            #vapi-chatbot-window {
                position: fixed;
                ${VAPI_CONFIG.position.includes('right') ? 'right: 24px;' : 'left: 24px;'}
                bottom: 24px;
                width: 380px;
                height: 600px;
                max-height: calc(100vh - 48px);
                background: white;
                border-radius: var(--vapi-radius);
                box-shadow: var(--vapi-shadow);
                display: none;
                flex-direction: column;
                z-index: var(--vapi-z-window);
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
                overflow: hidden;
            }

            #vapi-chatbot-window.open {
                display: flex;
                animation: vapi-slideUp 0.3s ease;
            }

            @keyframes vapi-slideUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .vapi-chat-header {
                background: var(--vapi-primary);
                color: white;
                padding: 16px 20px;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }

            .vapi-chat-title {
                display: flex;
                align-items: center;
                gap: 8px;
                font-weight: 600;
            }

            .vapi-status-indicator {
                width: 8px;
                height: 8px;
                background: #4ade80;
                border-radius: 50%;
                animation: vapi-pulse 2s infinite;
            }

            @keyframes vapi-pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }

            .vapi-close-btn {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
                transition: background 0.2s;
                font-size: 18px;
            }

            .vapi-close-btn:hover {
                background: rgba(255, 255, 255, 0.1);
            }

            .vapi-chat-messages {
                flex: 1;
                padding: 20px;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 16px;
            }

            .vapi-message {
                display: flex;
                gap: 12px;
                align-items: flex-start;
            }

            .vapi-message.user {
                flex-direction: row-reverse;
            }

            .vapi-avatar {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
                flex-shrink: 0;
            }

            .vapi-avatar.assistant {
                background: var(--vapi-secondary);
            }

            .vapi-avatar.user {
                background: var(--vapi-primary);
                color: white;
            }

            .vapi-message-content {
                max-width: 70%;
                padding: 12px 16px;
                border-radius: 18px;
                line-height: 1.4;
            }

            .vapi-message.assistant .vapi-message-content {
                background: var(--vapi-secondary);
                color: var(--vapi-text);
            }

            .vapi-message.user .vapi-message-content {
                background: var(--vapi-primary);
                color: white;
            }

            .vapi-chat-input-area {
                padding: 20px;
                border-top: 1px solid var(--vapi-border);
                background: white;
            }

            .vapi-input-container {
                display: flex;
                gap: 8px;
                align-items: flex-end;
            }

            #vapi-chat-input {
                flex: 1;
                border: 1px solid var(--vapi-border);
                border-radius: 24px;
                padding: 12px 16px;
                font-size: 14px;
                outline: none;
                resize: none;
                font-family: inherit;
            }

            #vapi-chat-input:focus {
                border-color: var(--vapi-primary);
            }

            #vapi-send-btn {
                width: 40px;
                height: 40px;
                border: none;
                border-radius: 50%;
                background: var(--vapi-primary);
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
                font-size: 18px;
            }

            #vapi-send-btn:hover:not(:disabled) {
                background: var(--vapi-primary-dark);
                transform: scale(1.05);
            }

            #vapi-send-btn:disabled {
                background: var(--vapi-border);
                cursor: not-allowed;
                transform: none;
            }

            .vapi-chat-status {
                margin-top: 8px;
                font-size: 12px;
                color: var(--vapi-text-light);
                min-height: 16px;
            }

            .vapi-typing-indicator {
                display: none;
            }

            .vapi-typing-indicator.show {
                display: inline;
            }

            .vapi-typing-indicator::after {
                content: '...';
                animation: vapi-typing 1.5s infinite;
            }

            @keyframes vapi-typing {
                0%, 20% { content: '.'; }
                40% { content: '..'; }
                60%, 100% { content: '...'; }
            }

            #vapi-consent-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: none;
                align-items: center;
                justify-content: center;
                z-index: var(--vapi-z-modal);
                padding: 20px;
            }

            #vapi-consent-modal.show {
                display: flex;
                animation: vapi-fadeIn 0.3s ease;
            }

            @keyframes vapi-fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            .vapi-consent-content {
                background: white;
                border-radius: var(--vapi-radius);
                padding: 32px;
                max-width: 400px;
                width: 100%;
                text-align: center;
            }

            .vapi-consent-content h3 {
                margin: 0 0 16px 0;
                color: var(--vapi-text);
            }

            .vapi-consent-content p {
                margin: 0 0 24px 0;
                color: var(--vapi-text-light);
                line-height: 1.5;
            }

            .vapi-consent-buttons {
                display: flex;
                gap: 12px;
                justify-content: center;
            }

            .vapi-btn-primary,
            .vapi-btn-secondary {
                padding: 12px 24px;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
                font-family: inherit;
            }

            .vapi-btn-primary {
                background: var(--vapi-primary);
                color: white;
                border: none;
            }

            .vapi-btn-primary:hover {
                background: var(--vapi-primary-dark);
            }

            .vapi-btn-secondary {
                background: transparent;
                color: var(--vapi-text);
                border: 1px solid var(--vapi-border);
            }

            .vapi-btn-secondary:hover {
                background: var(--vapi-secondary);
            }

            @media (max-width: 480px) {
                #vapi-chatbot-window {
                    width: calc(100vw - 20px);
                    height: calc(100vh - 20px);
                    bottom: 10px;
                    right: 10px;
                    left: 10px;
                }

                #vapi-chatbot-launcher {
                    bottom: 20px;
                    right: 20px;
                }
            }
        `;
        document.head.appendChild(styles);
    }

    // Create HTML elements
    function createChatElements() {
        if (document.getElementById('vapi-chatbot-launcher')) return;

        // Launcher button
        const launcher = document.createElement('button');
        launcher.id = 'vapi-chatbot-launcher';
        launcher.setAttribute('aria-label', 'Open chat with assistant');
        launcher.innerHTML = `
            <span>💬</span>
            <span>Chat with ${VAPI_CONFIG.assistantName}</span>
        `;

        // Chat window
        const chatWindow = document.createElement('div');
        chatWindow.id = 'vapi-chatbot-window';
        chatWindow.setAttribute('role', 'dialog');
        chatWindow.setAttribute('aria-label', 'Chat with assistant');
        chatWindow.setAttribute('aria-hidden', 'true');
        chatWindow.innerHTML = `
            <div class="vapi-chat-header">
                <div class="vapi-chat-title">
                    <div class="vapi-status-indicator"></div>
                    <span>Chat with ${VAPI_CONFIG.assistantName}</span>
                </div>
                <button class="vapi-close-btn" aria-label="Close chat">×</button>
            </div>
            
            <div class="vapi-chat-messages" id="vapi-chat-messages"></div>
            
            <div class="vapi-chat-input-area">
                <div class="vapi-input-container">
                    <input 
                        type="text" 
                        id="vapi-chat-input" 
                        placeholder="Type your message..." 
                        autocomplete="off"
                        aria-label="Type your message"
                    />
                    <button id="vapi-send-btn" aria-label="Send message" disabled>→</button>
                </div>
                <div class="vapi-chat-status">
                    <span class="vapi-typing-indicator">Assistant is typing</span>
                </div>
            </div>
        `;

        // Consent modal
        const consentModal = document.createElement('div');
        consentModal.id = 'vapi-consent-modal';
        consentModal.setAttribute('role', 'dialog');
        consentModal.setAttribute('aria-labelledby', 'vapi-consent-title');
        consentModal.setAttribute('aria-hidden', 'true');
        consentModal.innerHTML = `
            <div class="vapi-consent-content">
                <h3 id="vapi-consent-title">Privacy Notice</h3>
                <p>By using this chat widget, you agree to our privacy policy and terms of service. Your conversations may be recorded for quality assurance and to improve our services.</p>
                <div class="vapi-consent-buttons">
                    <button class="vapi-btn-primary" id="vapi-consent-agree">Accept & Continue</button>
                    <button class="vapi-btn-secondary" id="vapi-consent-decline">Decline</button>
                </div>
            </div>
        `;

        // Append to body
        document.body.appendChild(launcher);
        document.body.appendChild(chatWindow);
        document.body.appendChild(consentModal);
    }

    // Chat Manager Class
    class VapiChatManager {
        constructor(config) {
            this.config = config;
            this.vapi = null;
            this.isSessionActive = false;
            this.elements = this.getElements();
            this.setupEventListeners();
        }

        getElements() {
            return {
                launcher: document.getElementById('vapi-chatbot-launcher'),
                chatWindow: document.getElementById('vapi-chatbot-window'),
                closeBtn: document.querySelector('.vapi-close-btn'),
                messages: document.getElementById('vapi-chat-messages'),
                input: document.getElementById('vapi-chat-input'),
                sendBtn: document.getElementById('vapi-send-btn'),
                typingIndicator: document.querySelector('.vapi-typing-indicator'),
                consentModal: document.getElementById('vapi-consent-modal'),
                consentAgree: document.getElementById('vapi-consent-agree'),
                consentDecline: document.getElementById('vapi-consent-decline')
            };
        }

        setupEventListeners() {
            this.elements.launcher?.addEventListener('click', () => this.handleLauncherClick());
            this.elements.closeBtn?.addEventListener('click', () => this.closeChat());
            this.elements.sendBtn?.addEventListener('click', () => this.sendMessage());
            this.elements.input?.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
            this.elements.input?.addEventListener('input', () => this.updateSendButton());
            this.elements.consentAgree?.addEventListener('click', () => this.handleConsent(true));
            this.elements.consentDecline?.addEventListener('click', () => this.handleConsent(false));
        }

        handleLauncherClick() {
            if (this.hasConsent()) {
                this.openChat();
            } else {
                this.showConsentModal();
            }
        }

        hasConsent() {
            return localStorage.getItem(this.config.consentKey) === 'true';
        }

        showConsentModal() {
            this.elements.consentModal?.classList.add('show');
            this.elements.consentModal?.setAttribute('aria-hidden', 'false');
        }

        hideConsentModal() {
            this.elements.consentModal?.classList.remove('show');
            this.elements.consentModal?.setAttribute('aria-hidden', 'true');
        }

        handleConsent(agreed) {
            if (agreed) {
                localStorage.setItem(this.config.consentKey, 'true');
                this.hideConsentModal();
                this.openChat();
            } else {
                this.hideConsentModal();
            }
        }

        async openChat() {
            this.elements.chatWindow?.classList.add('open');
            this.elements.chatWindow?.setAttribute('aria-hidden', 'false');
            this.elements.launcher.style.display = 'none';
            this.elements.input?.focus();
            
            await this.initializeVapi();
        }

        closeChat() {
            this.elements.chatWindow?.classList.remove('open');
            this.elements.chatWindow?.setAttribute('aria-hidden', 'true');
            this.elements.launcher.style.display = 'flex';
            
            if (this.vapi && this.isSessionActive) {
                this.vapi.stop();
                this.isSessionActive = false;
            }
        }

        async initializeVapi() {
            if (this.isSessionActive || !Vapi) return;

            try {
                this.vapi = new Vapi(this.config.publicKey);
                
                this.vapi.on('message', (message) => this.handleVapiMessage(message));
                this.vapi.on('error', (error) => this.handleVapiError(error));
                this.vapi.on('call-start', () => console.log('Vapi call started'));
                this.vapi.on('call-end', () => {
                    console.log('Vapi call ended');
                    this.isSessionActive = false;
                });
                
                await this.vapi.start(this.config.assistantId);
                this.isSessionActive = true;
                
                this.addMessage('assistant', this.config.welcomeMessage);
                
            } catch (error) {
                console.error('Failed to initialize Vapi:', error);
                this.addMessage('assistant', 'Sorry, I\'m having trouble connecting. Please try again later.');
            }
        }

        handleVapiMessage(data) {
            const { message, text } = data;
            const content = message?.content || text;
            const role = message?.role || 'assistant';
            
            if (content && role !== 'user') {
                this.addMessage(role, content);
            }
            
            this.hideTypingIndicator();
        }

        handleVapiError(error) {
            console.error('Vapi error:', error);
            this.addMessage('assistant', 'Sorry, I encountered an error. Please try again.');
            this.hideTypingIndicator();
        }

        async sendMessage() {
            const text = this.elements.input?.value?.trim();
            if (!text || !this.vapi || !this.isSessionActive) return;

            this.addMessage('user', text);
            this.elements.input.value = '';
            this.updateSendButton();
            this.showTypingIndicator();

            try {
                await this.vapi.send({
                    type: 'add-message',
                    message: { role: 'user', content: text }
                });
            } catch (error) {
                console.error('Failed to send message:', error);
                this.addMessage('assistant', 'Sorry, I didn\'t receive your message. Please try again.');
                this.hideTypingIndicator();
            }
        }

        addMessage(role, content) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `vapi-message ${role}`;
            
            const avatar = document.createElement('div');
            avatar.className = `vapi-avatar ${role}`;
            avatar.textContent = role === 'user' ? '👤' : '🤖';
            
            const contentDiv = document.createElement('div');
            contentDiv.className = 'vapi-message-content';
            contentDiv.textContent = content;
            
            messageDiv.appendChild(avatar);
            messageDiv.appendChild(contentDiv);
            
            this.elements.messages?.appendChild(messageDiv);
            this.scrollToBottom();
        }

        showTypingIndicator() {
            this.elements.typingIndicator?.classList.add('show');
        }

        hideTypingIndicator() {
            this.elements.typingIndicator?.classList.remove('show');
        }

        updateSendButton() {
            const hasText = this.elements.input?.value?.trim().length > 0;
            if (this.elements.sendBtn) {
                this.elements.sendBtn.disabled = !hasText;
            }
        }

        scrollToBottom() {
            if (this.elements.messages) {
                this.elements.messages.scrollTop = this.elements.messages.scrollHeight;
            }
        }
    }

    // Initialize the chatbot
    async function init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve));
        }

        // Load Vapi SDK
        const vapiLoaded = await loadVapiSDK();
        if (!vapiLoaded) {
            console.error('Failed to load Vapi SDK');
            return;
        }

        // Inject styles and create elements
        injectStyles();
        createChatElements();

        // Initialize chat manager
        chatManager = new VapiChatManager(VAPI_CONFIG);
    }

    // Auto-initialize
    init();

    // Expose global functions if needed
    window.VapiChatbot = {
        open: () => chatManager?.openChat(),
        close: () => chatManager?.closeChat(),
        isOpen: () => chatManager?.elements.chatWindow?.classList.contains('open')
    };

})();