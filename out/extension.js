"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HLDRViewProvider = void 0;
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const axios_1 = __importDefault(require("axios"));
const crypto = __importStar(require("crypto"));
function activate(context) {
    const provider = new HLDRViewProvider(context.extensionUri);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(HLDRViewProvider.viewType, provider));
    // Debounce implementation
    let debounceTimer = null;
    // Last hashed content
    let lastContentHash = '';
    // Function to hash content
    const hashContent = (content) => {
        return crypto.createHash('sha256').update(content).digest('hex');
    };
    context.subscriptions.push(vscode.workspace.onDidSaveTextDocument((document) => {
        provider.updateContent("Retrieving Analysis...");
        // Debounce function
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }
        debounceTimer = setTimeout(async () => {
            const fileContent = document.getText();
            const currentHash = hashContent(fileContent);
            // Skip analysis if content hasn't changed
            if (currentHash === lastContentHash) {
                provider.updateContent('Content has not changed; skipping analysis.');
                return;
            }
            lastContentHash = currentHash; // Update the last hash
            const filePayload = { snippet: fileContent };
            try {
                const response = await axios_1.default.post('https://backend-floral-leaf-1548.fly.dev/analyze2', filePayload, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const analysisResult = response.data;
                provider.updateContent(analysisResult);
            }
            catch (error) {
                console.error('Error connecting to the backend endpoint:', error);
                provider.updateContent('Error: Unable to retrieve analysis.');
            }
        }, 1500); // Debounce delay in milliseconds
    }));
}
function deactivate() { }
class HLDRViewProvider {
    _extensionUri;
    static viewType = 'hldr.view';
    _view;
    _analysisResult = 'Awaiting Analysis...'; // Default value upon load
    constructor(_extensionUri) {
        this._extensionUri = _extensionUri;
    }
    resolveWebviewView(webviewView) {
        this._view = webviewView;
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri],
        };
        if (this._view) {
            this._view.webview.html = this._getHtmlForWebview(this._view.webview);
        }
    }
    updateContent(newAnalysisResult) {
        if (this._analysisResult !== newAnalysisResult) {
            this._analysisResult = newAnalysisResult;
            if (this._view) {
                this._view.webview.html = this._getHtmlForWebview(this._view.webview);
            }
        }
    }
    _getHtmlForWebview(webview) {
        const analysisResult = this._analysisResult;
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'script.js'));
        const styleResetUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'reset.css'));
        const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.css'));
        const nonce = getNonce();
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}' https://cdn.jsdelivr.net;">

                <meta name="viewport" content="width=device-width, initial-scale=1.0">

                <link href="${styleResetUri}" rel="stylesheet">
                <link href="${styleMainUri}" rel="stylesheet">

                <script src="https://cdn.jsdelivr.net/npm/markdown-it@14.1.0/dist/markdown-it.min.js"></script>

                <title>H.L.D.R Code Mentor</title>
            </head>
            <body>
                <div id="history" class="result" data-analysis-result="${analysisResult}"></div>
                <script type="module" nonce="${nonce}" src="${scriptUri}"></script>
            </body>
            </html>
        `;
    }
}
exports.HLDRViewProvider = HLDRViewProvider;
function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
//# sourceMappingURL=extension.js.map