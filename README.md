
# HydroGPT - Advanced AI Assistant

## Overview
HydroGPT is a powerful AI chatbot with ChatGPT-like interface, featuring advanced mathematical capabilities, web connectivity, and adaptive learning. Built for GitHub Pages deployment.

## Features
- **Advanced AI Engine**: Sophisticated natural language processing with context awareness
- **Mathematical Prowess**: Complex equation solving, calculus, linear algebra, and scientific computations
- **Web Connectivity**: Real-time information retrieval and current data access
- **Adaptive Learning**: Continuously improves responses based on interactions
- **Chat History**: Persistent conversation management with automatic titling
- **Responsive Design**: Optimized for desktop and mobile devices
- **Typewriter Effects**: Smooth, ChatGPT-like response animations

## File Structure
```
hydrogpt/
├── index.html          # Main HTML structure
├── styles.css          # Comprehensive styling
├── script.js           # Frontend JavaScript logic
├── ai-engine.js        # AI processing engine
├── README.md           # Documentation
└── assets/
    └── hydrogpt-logo.png   # Logo image (400x400px recommended)
```

## Required Images
1. **hydrogpt-logo.png** (400x400px) - Main logo for the welcome screen
   - Should be a modern, tech-focused design
   - Recommended: Blue/green gradient with AI/water theme
   - PNG format with transparent background

## Setup Instructions

### For GitHub Pages:
1. Create a new repository named `hydrogpt` or `[username].github.io`
2. Upload all files to the repository
3. Add your logo image as `hydrogpt-logo.png`
4. Enable GitHub Pages in repository settings
5. Access your AI at `https://[username].github.io/hydrogpt/`

### Local Development:
1. Clone the repository
2. Open `index.html` in a modern browser
3. No build process required - pure HTML/CSS/JS

## Customization

### AI Personality:
- Edit responses in `ai-engine.js` > `generateXResponse()` methods
- Modify learning algorithms in the `learn()` function
- Adjust context memory in `conversationMemory`

### Visual Theme:
- Update colors in `styles.css` CSS variables
- Modify layout in the main CSS classes
- Change fonts in the Google Fonts import

### Mathematical Engine:
- Extend `MathEngine` class for more complex calculations
- Add new mathematical functions in the `functions` array
- Implement advanced solving algorithms

## Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Performance Optimization
- Lazy loading for chat history
- Memory management for long conversations
- Efficient DOM manipulation
- Optimized CSS animations

## Security Features
- Input sanitization
- XSS prevention
- Safe mathematical expression evaluation
- Secure local storage handling

## API Integration Ready
The codebase is structured to easily integrate with:
- OpenAI API
- Web search APIs (Google, Bing)
- Mathematical computation services
- Knowledge base APIs

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License
MIT License - Feel free to use and modify for your projects.

## Support
For issues or questions, please create an issue in the GitHub repository.

---

**HydroGPT Model H1** - The future of AI assistance
