# 🤖 Vapi Chatbot Integration

This repository contains multiple implementations of a Vapi AI chatbot that you can easily integrate into any website.

## 📁 Files Overview

### Ready-to-Use Files
- **`vapi-chatbot-embed.js`** - Complete standalone chatbot script
- **`vapi-chatbot-standalone.html`** - Full demo page with advanced chatbot UI
- **`integration-guide.html`** - Step-by-step integration instructions
- **`chatbot.html`** - Your existing website with chatbot implementations

## 🚀 Quick Start

### Option 1: Simple Integration (Recommended for beginners)

Copy and paste this code before the closing `</body>` tag in your HTML:

```html
<!-- Vapi Chatbot Integration -->
<script type="module">
// ⚠️ IMPORTANT: Replace these with your actual Vapi credentials
const VAPI_CONFIG = {
    publicKey: 'your-vapi-public-key-here',
    assistantId: 'your-vapi-assistant-id-here',
    assistantName: 'Sara',
    welcomeMessage: 'Hi! How can I help you today?',
    primaryColor: '#4c8697',
    position: 'bottom-right'
};

// Load Vapi SDK
let Vapi;
try {
    const module = await import('https://cdn.skypack.dev/@vapi-ai/web');
    Vapi = module.default;
} catch (error) {
    console.error('Failed to load Vapi SDK:', error);
}

// Create chatbot elements
function createChatbot() {
    const styles = document.createElement('style');
    styles.innerHTML = `
        #vapi-launcher {
            position: fixed; bottom: 24px; right: 24px;
            background: ${VAPI_CONFIG.primaryColor}; color: white;
            border: none; border-radius: 50px; padding: 16px 20px;
            font-size: 14px; font-weight: 600; cursor: pointer;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15); z-index: 1000;
            font-family: system-ui, sans-serif;
            display: flex; align-items: center; gap: 8px;
        }
        #vapi-launcher:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 25px rgba(0,0,0,0.2);
        }
    `;
    document.head.appendChild(styles);

    const launcher = document.createElement('button');
    launcher.id = 'vapi-launcher';
    launcher.innerHTML = '💬 Chat with ' + VAPI_CONFIG.assistantName;
    launcher.onclick = startChat;
    document.body.appendChild(launcher);
}

// Initialize Vapi session
let vapi = null;
let isActive = false;

async function startChat() {
    if (isActive || !Vapi) return;
    
    try {
        vapi = new Vapi(VAPI_CONFIG.publicKey);
        await vapi.start(VAPI_CONFIG.assistantId);
        isActive = true;
        
        console.log('✅ Vapi chat started successfully!');
        document.getElementById('vapi-launcher').innerHTML = '🟢 Chat Active';
        
        vapi.on('call-end', () => {
            isActive = false;
            document.getElementById('vapi-launcher').innerHTML = '💬 Chat with ' + VAPI_CONFIG.assistantName;
        });
        
    } catch (error) {
        console.error('Failed to start Vapi chat:', error);
        alert('Chat service is temporarily unavailable. Please try again later.');
    }
}

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createChatbot);
} else {
    createChatbot();
}
</script>
```

### Option 2: Advanced Integration (Full UI)

Include the complete chatbot script:

```html
<script src="vapi-chatbot-embed.js"></script>
```

## ⚙️ Configuration

Update the `VAPI_CONFIG` object with your settings:

```javascript
const VAPI_CONFIG = {
    publicKey: 'your-vapi-public-key',           // Get from Vapi dashboard
    assistantId: 'your-vapi-assistant-id',       // Get from Vapi dashboard
    assistantName: 'Sara',                       // Display name
    welcomeMessage: 'Hi! How can I help?',       // First message
    primaryColor: '#4c8697',                     // Theme color
    position: 'bottom-right',                    // Position on screen
    consentKey: 'vapi_widget_consent'            // Storage key
};
```

## 🔧 Your Current Implementation

Your `chatbot.html` file currently has two implementations:

1. **Vapi React Widget** (commented out) - Lines 2940-2966
2. **Custom Implementation** (active) - Lines 2967-3131

### Issues Found & Fixed:
- ✅ Fixed HTML comment structure
- ✅ Improved error handling
- ✅ Added proper accessibility attributes
- ✅ Enhanced mobile responsiveness

## 🌐 Platform-Specific Instructions

### WordPress
1. Go to **Appearance → Theme Editor**
2. Edit **footer.php**
3. Paste the script before `</body>`
4. Save changes

### Static HTML Sites
1. Open your HTML file
2. Paste the script before `</body>`
3. Save and upload to your server

### React/Vue/Angular
Use the `vapi-chatbot-embed.js` file and import it as a module.

## 🛠️ Troubleshooting

### Common Issues:

**"Failed to load Vapi SDK"**
- Solution: Ensure website is served over HTTPS
- Local development: Use `npx serve` or similar

**"Authentication failed"**
- Solution: Check your public key and assistant ID
- Verify credentials in Vapi dashboard

**Button appears but chat doesn't start**
- Solution: Open browser console (F12) for error messages
- Usually a configuration issue

**No button visible**
- Solution: Check browser console for JavaScript errors
- Ensure script is placed before `</body>` tag

## 📱 Features

### Simple Integration:
- ✅ One-click voice chat activation
- ✅ Visual status indicators
- ✅ Minimal code footprint
- ✅ Mobile responsive

### Advanced Integration:
- ✅ Full chat interface with message history
- ✅ Typing indicators
- ✅ Privacy consent modal
- ✅ Customizable themes
- ✅ Accessibility compliant
- ✅ Mobile optimized

## 🔍 Testing

1. Open your website in a browser
2. Look for the chat button (bottom-right corner)
3. Click to start a conversation
4. Check browser console for any errors

## 📞 Support

If you need help:
1. Check the browser console for error messages
2. Verify your Vapi credentials
3. Test with the simple integration first
4. Ensure HTTPS is enabled

## 🎨 Customization

You can customize colors, position, and messages by modifying the `VAPI_CONFIG` object. The chatbot automatically adapts to your brand colors and positioning preferences.

---

**Note**: Always keep your Vapi credentials secure and never expose them in client-side code in production environments. Consider using environment variables or server-side proxy for enhanced security.