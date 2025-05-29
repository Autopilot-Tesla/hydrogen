
class HydroGPTApp {
    constructor() {
        this.currentChatId = null;
        this.chatHistory = this.loadChatHistory();
        this.isTyping = false;
        this.initializeElements();
        this.attachEventListeners();
        this.loadWelcomeScreen();
    }

    initializeElements() {
        this.sidebar = document.getElementById('sidebar');
        this.sidebarToggle = document.getElementById('sidebarToggle');
        this.newChatBtn = document.getElementById('newChatBtn');
        this.chatHistoryContainer = document.getElementById('chatHistory');
        this.welcomeScreen = document.getElementById('welcomeScreen');
        this.messagesContainer = document.getElementById('messages');
        this.chatContainer = document.getElementById('chatContainer');
        this.messageInput = document.getElementById('messageInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.loadingOverlay = document.getElementById('loadingOverlay');
    }

    attachEventListeners() {
        // Sidebar toggle
        this.sidebarToggle.addEventListener('click', () => this.toggleSidebar());
        
        // New chat button
        this.newChatBtn.addEventListener('click', () => this.startNewChat());
        
        // Message input
        this.messageInput.addEventListener('input', () => this.handleInputChange());
        this.messageInput.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Send button
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        
        // Auto-resize textarea
        this.messageInput.addEventListener('input', () => this.autoResizeTextarea());
        
        // Close sidebar on mobile when clicking outside
        document.addEventListener('click', (e) => this.handleOutsideClick(e));
    }

    toggleSidebar() {
        this.sidebar.classList.toggle('open');
    }

    handleOutsideClick(e) {
        if (window.innerWidth <= 768 && 
            !this.sidebar.contains(e.target) && 
            !this.sidebarToggle.contains(e.target)) {
            this.sidebar.classList.remove('open');
        }
    }

    loadWelcomeScreen() {
        this.welcomeScreen.style.display = 'flex';
        this.messagesContainer.style.display = 'none';
        this.renderChatHistory();
    }

    startNewChat() {
        this.currentChatId = this.generateChatId();
        this.welcomeScreen.style.display = 'none';
        this.messagesContainer.style.display = 'block';
        this.messagesContainer.innerHTML = '';
        this.messageInput.focus();
        
        // Create new chat in history
        const newChat = {
            id: this.currentChatId,
            title: 'New Chat',
            messages: [],
            timestamp: new Date().toISOString()
        };
        
        this.chatHistory.unshift(newChat);
        this.saveChatHistory();
        this.renderChatHistory();
        this.setActiveChatInHistory(this.currentChatId);
    }

    generateChatId() {
        return 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    handleInputChange() {
        const hasText = this.messageInput.value.trim().length > 0;
        this.sendBtn.disabled = !hasText || this.isTyping;
        
        // Show send button animation
        if (hasText) {
            this.sendBtn.style.opacity = '1';
            this.sendBtn.style.transform = 'translateY(-50%) scale(1)';
        } else {
            this.sendBtn.style.opacity = '0.5';
        }
    }

    handleKeyPress(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!this.sendBtn.disabled) {
                this.sendMessage();
            }
        }
    }

    autoResizeTextarea() {
        this.messageInput.style.height = 'auto';
        const maxHeight = 200;
        const newHeight = Math.min(this.messageInput.scrollHeight, maxHeight);
        this.messageInput.style.height = newHeight + 'px';
    }

    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message || this.isTyping) return;

        // If no current chat, start a new one
        if (!this.currentChatId) {
            this.startNewChat();
        }

        // Clear input and disable send button
        this.messageInput.value = '';
        this.handleInputChange();
        this.autoResizeTextarea();
        this.isTyping = true;

        // Add user message to chat
        this.addMessage('user', message);
        
        // Show typing indicator
        const typingElement = this.showTypingIndicator();

        try {
            // Generate AI response
            const response = await window.hydroGPT.generateResponse(message, this.currentChatId);
            
            // Remove typing indicator
            typingElement.remove();
            
            // Add AI response with typewriter effect
            await this.addMessage('ai', response, true);
            
            // Update chat title if it's the first message
            this.updateChatTitle(message);
            
            // Save chat history
            this.saveChatToHistory(message, response);
            
        } catch (error) {
            console.error('Error sending message:', error);
            typingElement.remove();
            this.addMessage('ai', 'I apologize, but I encountered an error. Please try again.');
        } finally {
            this.isTyping = false;
            this.handleInputChange();
            this.messageInput.focus();
        }
    }

    addMessage(sender, content, useTypewriter = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;

        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';

        const avatar = document.createElement('div');
        avatar.className = `message-avatar ${sender}-avatar`;
        avatar.innerHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';

        const messageText = document.createElement('div');
        messageText.className = 'message-text';

        if (sender === 'user') {
            messageContent.appendChild(messageText);
            messageContent.appendChild(avatar);
        } else {
            messageContent.appendChild(avatar);
            messageContent.appendChild(messageText);
        }

        messageDiv.appendChild(messageContent);
        this.messagesContainer.appendChild(messageDiv);

        if (useTypewriter && sender === 'ai') {
            return this.typeWriterEffect(messageText, content);
        } else {
            messageText.innerHTML = this.formatMessage(content);
            this.scrollToBottom();
            return Promise.resolve();
        }
    }

    async typeWriterEffect(element, text) {
        element.innerHTML = '';
        const formattedText = this.formatMessage(text);
        
        // For demonstration, we'll show the text immediately with a slight delay
        await this.delay(500);
        element.innerHTML = formattedText;
        this.scrollToBottom();
    }

    formatMessage(text) {
        // Format markdown-like syntax
        let formatted = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<span class="inline-code">$1</span>')
            .replace(/\n/g, '<br>');
        
        // Format code blocks
        formatted = formatted.replace(/```([\s\S]*?)```/g, '<div class="code-block">$1</div>');
        
        // Format math expressions
        formatted = formatted.replace(/\$\$([\s\S]*?)\$\$/g, '<div class="math-expression">$1</div>');
        
        return formatted;
    }

    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message ai-message typing-message';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar ai-avatar';
        avatar.innerHTML = '<i class="fas fa-robot"></i>';
        
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        
        messageContent.appendChild(avatar);
        messageContent.appendChild(typingIndicator);
        typingDiv.appendChild(messageContent);
        
        this.messagesContainer.appendChild(typingDiv);
        this.scrollToBottom();
        
        return typingDiv;
    }

    updateChatTitle(firstMessage) {
        const currentChat = this.chatHistory.find(chat => chat.id === this.currentChatId);
        if (currentChat && currentChat.title === 'New Chat') {
            // Generate title from first message
            const title = firstMessage.length > 30 
                ? firstMessage.substring(0, 30) + '...'
                : firstMessage;
            currentChat.title = title;
            this.renderChatHistory();
        }
    }

    saveChatToHistory(userMessage, aiResponse) {
        const currentChat = this.chatHistory.find(chat => chat.id === this.currentChatId);
        if (currentChat) {
            currentChat.messages.push({
                user: userMessage,
                ai: aiResponse,
                timestamp: new Date().toISOString()
            });
            currentChat.timestamp = new Date().toISOString();
            this.saveChatHistory();
        }
    }

    renderChatHistory() {
        this.chatHistoryContainer.innerHTML = '';
        
        this.chatHistory.forEach(chat => {
            const chatItem = document.createElement('div');
            chatItem.className = 'chat-item';
            chatItem.textContent = chat.title;
            chatItem.addEventListener('click', () => this.loadChat(chat.id));
            this.chatHistoryContainer.appendChild(chatItem);
        });
    }

    setActiveChatInHistory(chatId) {
        const chatItems = this.chatHistoryContainer.querySelectorAll('.chat-item');
        chatItems.forEach((item, index) => {
            if (this.chatHistory[index]?.id === chatId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    loadChat(chatId) {
        const chat = this.chatHistory.find(c => c.id === chatId);
        if (!chat) return;

        this.currentChatId = chatId;
        this.welcomeScreen.style.display = 'none';
        this.messagesContainer.style.display = 'block';
        this.messagesContainer.innerHTML = '';

        // Load chat messages
        chat.messages.forEach(messageData => {
            this.addMessage('user', messageData.user);
            this.addMessage('ai', messageData.ai);
        });

        this.setActiveChatInHistory(chatId);
        this.sidebar.classList.remove('open'); // Close sidebar on mobile
        this.scrollToBottom();
    }

    loadChatHistory() {
        try {
            const stored = localStorage.getItem('hydrogpt-chat-history');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading chat history:', error);
            return [];
        }
    }

    saveChatHistory() {
        try {
            localStorage.setItem('hydrogpt-chat-history', JSON.stringify(this.chatHistory));
        } catch (error) {
            console.error('Error saving chat history:', error);
        }
    }

    scrollToBottom() {
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.hydroGPTApp = new HydroGPTApp();
});

// Add some startup animations
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});
