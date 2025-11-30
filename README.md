# **TEMPO – Free Autocomplete & Auto-Suggestion VS Code Extension**

**TEMPO** is my personal autocomplete and AI-powered auto-suggestion VS Code extension — running with **no subscriptions**, **no locked features**, and **100% completely free**.

It uses **OpenRouter** (OpenAI-compatible API) while keeping everything lightweight, fast, and open.

---

## **📁 Project Structure**

```
TEMPO/
├── src/
│   └── extension.ts
├── out/                 (generated after compile)
├── .env                 (create this - not committed)
├── .env.example         (template)
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## **⚙️ Setup Instructions**

### **1. Install Dependencies**

```bash
npm install
# or if dotenv is missing:
npm install dotenv --save
```

---

### **2. Create Your `.env` File**

Create a `.env` in your **project root** (same level as `package.json`):

```bash
HTTP_REFERER_URL=https://github.com/yourusername/tempo-vscode
```

🔹 Replace `yourusername/tempo-vscode` with your actual GitHub repository or website.

---

### **3. Update `.gitignore`**

Ensure you **never** commit your `.env`:

```
.env
```

---

### **4. Build & Run**

```bash
npm run compile
```

Then press **F5** inside VS Code to launch the extension in a development window.

---

## **🔑 OpenRouter API Information**

The API endpoint **is correct**:

### **✅ `https://openrouter.ai/api/v1/chat/completions`**

OpenRouter fully supports **OpenAI-compatible format**, so this is the right endpoint for TEMPO.

If you're seeing errors, they are usually caused by:

- ❌ Invalid API key  
- ❌ Incorrect auth headers  
- ❌ Missing HTTP-Referer header  
- ❌ Rate limits  
- ❌ Network issues  

---

## **🔧 Configuration**

### **Option 1 — VS Code Settings (Recommended)**  
1. Open **Settings** → search **"tempo"**  
2. Add your **OpenRouter API key**

---

### **Option 2 — Environment Variable (Development Only)**

Add to your `.env`:

```bash
OPENROUTER_API_KEY=sk-or-v1-...
```

⚠️ **Do NOT use this method for production or distributing the extension.**

---

## **🐛 Troubleshooting**

### **❗ “API error”**
Open the Developer Console:  
**Help → Toggle Developer Tools → Console**

---

### **401 – Unauthorized**
- Invalid API key  
- Missing API key  

✔️ Fix: Re-check your key from:  
https://openrouter.ai/keys

---

### **403 – Forbidden**
- Missing required **HTTP-Referer** header  

✔️ Fix: Ensure `.env` contains:

```bash
HTTP_REFERER_URL=https://your-url-here
```

---

### **429 – Too Many Requests**
- Rate limit exceeded  

✔️ Fix: Wait briefly — TEMPO has caching to reduce this.

---

### **Network Errors**
- Internet issues  
- VPN / firewall / proxy blocking  

✔️ Fix: Check connection or allow VS Code through firewall.

---

### **API Key Not Working**
- Generate a new key  
- Ensure you have credits  
- Use a key starting with `sk-or-v1-`

OpenRouter keys page:  
https://openrouter.ai/keys

---

### **Environment Variables Not Loading**
Ensure:

- `.env` is in **project root**
- File name is **exactly** `.env`
- No `.env.txt`
- No spaces around `=`  
- Rebuild after creating:

```bash
npm run compile
```

---

## **🎉 You're Ready to Use TEMPO**

If you want, I can help you:

- add badges  
- add screenshots/demo GIFs  
- prepare the extension for marketplace publishing  
- write a changelog or feature list  

Just tell me!
