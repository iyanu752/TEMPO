# TEMPO - AI Code Completion for VS Code

TEMPO is a powerful AI-powered code completion extension for Visual Studio Code that provides intelligent suggestions across multiple programming languages using OpenRouter's AI models.

## ✨ Features

- 🤖 **AI-Powered Completions** - Intelligent code suggestions using state-of-the-art language models
- 🌍 **Multi-Language Support** - Works with JavaScript, TypeScript, Python, Java, Go, Rust, C/C++, C#, PHP, Ruby, Swift, Kotlin, Scala, HTML, CSS, and JSON
- ⚡ **Fast & Efficient** - Smart caching system reduces API calls and improves response time
- 🎯 **Context-Aware** - Understands your code context for better suggestions
- 🎨 **Seamless Integration** - Native inline completion like GitHub Copilot
- 🔧 **Customizable** - Choose your preferred AI model and configure settings

## 📋 Prerequisites

Before installing TEMPO, you'll need:

1. **Visual Studio Code** (version 1.85 or higher)
2. **Node.js** (version 18 or higher)
3. **OpenRouter API Key** - Get one from [https://openrouter.ai](https://openrouter.ai)
   - Sign up for a free account
   - Add credits to your account
   - Generate an API key from your dashboard

## 🚀 Installation

### Method 1: From Release (Recommended)

1. Download the latest `.vsix` file from the [Releases](https://github.com/yourusername/tempo/releases) page

2. Install the extension:
   ```bash
   code --install-extension tempo-1.0.0.vsix
   ```

   **Or** install via VS Code UI:
   - Open VS Code
   - Go to Extensions view (`Ctrl+Shift+X` / `Cmd+Shift+X`)
   - Click the `...` menu → `Install from VSIX...`
   - Select the downloaded `tempo-1.0.0.vsix` file

3. Reload VS Code:
   - Press `Ctrl+Shift+P` / `Cmd+Shift+P`
   - Type "Developer: Reload Window" and press Enter

### Method 2: Build From Source

```bash
# Clone the repository
git clone https://github.com/yourusername/tempo.git
cd tempo

# Install dependencies
npm install

# Compile the extension
npm run compile

# Package the extension
npm install -g @vscode/vsce
vsce package

# Install the generated .vsix file
code --install-extension tempo-1.0.0.vsix
```

## ⚙️ Configuration

### 1. Set Your OpenRouter API Key

Open VS Code Settings:
- Press `Ctrl+,` / `Cmd+,`
- Search for "tempo"
- Enter your OpenRouter API key in **Tempo: Open Router Api Key**

**Or** edit `settings.json` directly:
```json
{
  "tempo.openRouterApiKey": "sk-or-v1-your-api-key-here"
}
```

### 2. Configure Settings (Optional)

| Setting | Description | Default |
|---------|-------------|---------|
| `tempo.model` | AI model to use | `anthropic/claude-3.5-sonnet` |
| `tempo.maxTokens` | Maximum tokens for completion | `150` |
| `tempo.enabled` | Enable/disable the extension | `true` |

#### Available Models

- `anthropic/claude-3.5-sonnet` (Recommended - Best balance)
- `anthropic/claude-3-opus` (Highest quality)
- `openai/gpt-4-turbo` (Very good)
- `openai/gpt-3.5-turbo` (Fast and cheaper)
- `google/gemini-pro` (Good alternative)
- `meta-llama/llama-3-70b-instruct` (Open source)
- `mistralai/mistral-large` (Fast and efficient)

## 📖 Usage

1. **Open any supported file** (`.js`, `.py`, `.java`, `.go`, etc.)
2. **Start typing code**
3. **Wait briefly** (~300ms) after you stop typing
4. **See AI suggestions** appear in gray text
5. **Accept** with `Tab` or `→` key
6. **Dismiss** with `Esc` or continue typing

### Example

```javascript
function calculateTotal(items) {
    // Start typing: let total =
    // TEMPO will suggest: let total = items.reduce((sum, item) => sum + item.price, 0);
    // Press Tab to accept
}
```

## 🎮 Commands

Access commands via Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`):

- **Toggle TEMPO** - Enable or disable the extension

## 📊 Status Indicators

Watch the status bar (bottom-right corner) for extension state:

| Icon | Meaning |
|------|---------|
| `$(sparkle) AI Ready` | Extension is active and ready |
| `$(loading~spin) Generating...` | Fetching completion from AI |
| `$(error) AI Error` | An error occurred (check console) |
| `$(alert) No API Key` | API key not configured |

## 🛠️ Troubleshooting

### No Suggestions Appearing

1. **Check API Key**: Ensure your OpenRouter API key is set correctly
2. **Verify Credits**: Make sure your OpenRouter account has credits
3. **Check Status Bar**: Look for error indicators
4. **Wait Longer**: Give it ~500ms after stopping typing
5. **Check Console**: Help → Toggle Developer Tools → Console tab

### Slow Responses

- Try a faster model: `openai/gpt-3.5-turbo`
- Reduce `maxTokens` setting to `100` or less
- Check your internet connection

### Poor Quality Suggestions

- Use a more powerful model: `anthropic/claude-3-opus` or `openai/gpt-4-turbo`
- Increase `maxTokens` to `200-300`
- Ensure your code has clear context around the cursor

### Extension Not Activating

1. Check that the extension is enabled in Extensions view
2. Reload VS Code: `Ctrl+Shift+P` → "Developer: Reload Window"
3. Check Output panel: View → Output → Select "TEMPO"

## 💰 Cost Management

TEMPO uses OpenRouter's pay-per-use pricing. To minimize costs:

- ✅ Built-in caching (5-second cache for repeated requests)
- ✅ Use cheaper models for simple completions (`gpt-3.5-turbo`)
- ✅ Adjust `maxTokens` to reasonable values (100-150)
- ✅ Monitor usage on your OpenRouter dashboard

## 🔒 Privacy & Security

- Your code is sent to OpenRouter's API for processing
- API keys are stored locally in VS Code settings
- No telemetry or data collection by TEMPO
- Review OpenRouter's [Privacy Policy](https://openrouter.ai/privacy)


## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [OpenRouter](https://openrouter.ai) for AI model access
- Powered by models from Anthropic, OpenAI, Google, Meta, and more
- Inspired by GitHub Copilot

## 📧 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/tempo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/tempo/discussions)
- **Email**: iyanu752@gmail.com

## 🌟 Star History

If you find TEMPO useful, please consider giving it a star on GitHub!

---

**Made with ❤️ by [Your Name](https://github.com/yourusername)**
