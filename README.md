# Google Veo Free - Text & Image to Video Generator

A web-based application that converts text prompts and images into high-quality videos using Google's Veo AI model. Create professional videos effortlessly with an intuitive interface.

## Features

🎬 **Multiple Input Modes**
- Convert text descriptions into videos
- Generate videos from image inputs
- Customize video length and quality settings

🎨 **User-Friendly Interface**
- Drag-and-drop image upload
- Real-time preview capabilities
- Progress tracking for video generation

⚡ **Performance**
- Fast processing with optimized API integration
- Support for various video formats
- Batch processing capabilities (future)

📱 **Responsive Design**
- Works seamlessly on desktop and mobile
- Progressive web app support

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Python 3.8+ (for backend services)
- Google API credentials (for Veo access)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Stubbyfare/Google-Veo-Free.git
cd Google-Veo-Free
```

2. **Install dependencies**
```bash
npm install
# If using Python backend:
pip install -r requirements.txt
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your Google API credentials
GOOGLE_API_KEY=your_api_key_here
```

4. **Start the application**
```bash
npm run dev
# Backend (if applicable):
python app.py
```

5. **Open your browser**
Navigate to `http://localhost:3000`

## Usage

### Text to Video

1. Navigate to the **Text to Video** tab
2. Enter your video description in the text field
3. Adjust settings:
   - Video duration (5-60 seconds)
   - Quality (SD/HD/4K)
   - Frame rate (24/30/60 fps)
4. Click **Generate Video**
5. Wait for processing and download your video

### Image to Video

1. Navigate to the **Image to Video** tab
2. Upload an image or drag-and-drop
3. Enter a text prompt describing the motion/changes
4. Configure video parameters
5. Click **Generate Video**
6. Download your generated video

## Project Structure

```
Google-Veo-Free/
├── index.html              # Main HTML file
��── css/
│   └── style.css          # Styling
├── js/
│   ├── app.js             # Main application logic
│   ├── api-client.js      # Google Veo API integration
│   └── ui-handler.js      # UI interactions
├── python/
│   ├── app.py             # Flask backend (optional)
│   └── veo-handler.py     # Veo API wrapper
├── README.md              # This file
└── .env.example           # Environment configuration template
```

## Configuration

### Video Parameters

| Parameter | Options | Default |
|-----------|---------|---------|
| Duration | 5-60 seconds | 10s |
| Quality | SD (480p), HD (720p), 4K (2160p) | HD |
| Frame Rate | 24, 30, 60 fps | 30 |
| Format | MP4, WebM, AVI | MP4 |

## API Integration

This project uses the **Google Veo API** for video generation:

- **Text to Video**: Converts text descriptions to videos
- **Image to Video**: Extends images with AI-generated motion

Learn more: [Google Veo Documentation](https://deepmind.google/technologies/veo/)

## Troubleshooting

### Common Issues

**"API Key Invalid"**
- Verify your API key in `.env`
- Ensure you have the correct permissions

**"Video generation timeout"**
- Try with a shorter duration
- Reduce the quality setting
- Check your internet connection

**"CORS errors"**
- Enable CORS in backend configuration
- Use the proxy server if provided

## Performance Tips

- Use specific, detailed prompts for better results
- Start with lower quality settings for faster processing
- Keep prompts under 500 characters for optimal results
- Ideal video duration: 10-30 seconds

## Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This is an unofficial tool for accessing Google Veo functionality. Users must comply with Google's Terms of Service and usage policies. The creators are not affiliated with or endorsed by Google.

## Support

- 📧 Email: support@example.com
- 🐛 Report bugs: [GitHub Issues](https://github.com/Stubbyfare/Google-Veo-Free/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/Stubbyfare/Google-Veo-Free/discussions)

## Roadmap

- [ ] Advanced prompt engineering tools
- [ ] Batch video generation
- [ ] Video editing suite
- [ ] Custom model fine-tuning
- [ ] API rate limiting optimization
- [ ] Multi-language support
- [ ] Mobile app version

## Acknowledgments

- [Google DeepMind](https://deepmind.google/) for Veo technology
- Contributors and community members

---

**Happy Creating! 🎥**