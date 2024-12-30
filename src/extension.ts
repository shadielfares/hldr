import * as vscode from 'vscode';
import axios from 'axios';
import * as cp from 'child_process';

let pythonProcess: cp.ChildProcess | undefined;

export function activate(context: vscode.ExtensionContext) {

    // Creating Inital Instance & Adding Empty Instance to WebView
    const provider = new HLDRViewProvider(context.extensionUri);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(HLDRViewProvider.viewType, provider)
    );

    context.subscriptions.push(
        vscode.workspace.onDidSaveTextDocument(async (document) => {
            const fileContent = { snippet: document.getText() };

            try {
                const response = await axios.post('http://localhost:8000/analyze', fileContent, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                // Updating the WebView with the response
                const analysisResult = response.data.replace(/'/g, '`');
                provider.updateContent(analysisResult);
            } catch (error: any) {
                console.error('Error connecting to the backend endpoint', error);
                provider.updateContent('Error: Unable to retrieve analysis.');
            }

        })
    );
    // This is listening for file save events and will perform our logic without the explicit declaration of a while-loop to persist pushes.
}

export function deactivate() {
    if (pythonProcess) {
        pythonProcess.kill();
        console.log('FastAPI endpoint is terminated...');
        pythonProcess = undefined; //Clean up reference
    } else {
        console.warn('No Python process to terminate');
    }
}

export class HLDRViewProvider implements vscode.WebviewViewProvider {

    public static readonly viewType = 'hldr.view';
    private _view?: vscode.WebviewView;
    private _analysisResult: string = 'Awaiting Analysis...'; //Default Value upon load

    // Initially creating it with the current contents of a file.
    constructor(private readonly _extensionUri: vscode.Uri,) { }

    // Specify the function is of type void
    public resolveWebviewView(webviewView: vscode.WebviewView) {

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

    public updateContent(newAnalysisResult: any) {
        if (this._analysisResult !== newAnalysisResult) {
            this._analysisResult = newAnalysisResult;
            if (this._view) {
                this._view.webview.html = this._getHtmlForWebview(this._view.webview);
            }
        }
    }

    private _getHtmlForWebview(webview: vscode.Webview): string {
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

function getNonce(): string {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}