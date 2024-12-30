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
let pythonProcess;
function activate(context) {
    // Creating Inital Instance & Adding Empty Instance to WebView
    const provider = new HLDRViewProvider(context.extensionUri);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(HLDRViewProvider.viewType, provider));
    context.subscriptions.push(vscode.workspace.onDidSaveTextDocument(async (document) => {
        const fileContent = { snippet: document.getText() };
        try {
            const response = await axios_1.default.post('http://localhost:8000/analyze', fileContent, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            // Updating the WebView with the response
            const analysisResult = response.data.replace(/'/g, '`');
            provider.updateContent(analysisResult);
        }
        catch (error) {
            console.error('Error connecting to the backend endpoint', error);
            provider.updateContent('Error: Unable to retrieve analysis.');
        }
    }));
    // This is listening for file save events and will perform our logic without the explicit declaration of a while-loop to persist pushes.
}
function deactivate() {
    if (pythonProcess) {
        pythonProcess.kill();
        console.log('FastAPI endpoint is terminated...');
        pythonProcess = undefined; //Clean up reference
    }
    else {
        console.warn('No Python process to terminate');
    }
}
class HLDRViewProvider {
    _extensionUri;
    static viewType = 'hldr.view';
    _view;
    _analysisResult = 'Awaiting Analysis...'; //Default Value upon load
    // Initially creating it with the current contents of a file.
    constructor(_extensionUri) {
        this._extensionUri = _extensionUri;
    }
    // Specify the function is of type void
    resolveWebviewView(webviewView) {
        this._view = webviewView;
        webviewView.webview.options = {
            enableScripts: true,
            // Restrict the webview to only load resources from the extension's directory
            localResourceRoots: [this._extensionUri]
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
        const analysisResult = this._analysisResult; //Accessing internal variable
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'script.js'));
        const styleResetUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'reset.css'));
        const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.css'));
        const nonce = getNonce();
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <!-- This is to only import styling and scripts from our extension directory -->
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">

                <meta name="viewport" content="width=device-width, initial-scale=1.0">

                <link href="${styleResetUri}" rel="stylesheet">
                <link href="${styleMainUri}" rel="stylesheet">

                <title>H.L.D.R Code Analysis</title>
            </head>
            <body>
                <div id="history" class="result" data-analysis-result='${analysisResult}'></div>
                <script nonce="${nonce}" src="${scriptUri}"></script>
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