import * as vscode from 'vscode';
import axios from 'axios';
import * as crypto from 'crypto';

export function activate(context: vscode.ExtensionContext) {
    const provider = new HLDRViewProvider(context.extensionUri);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(HLDRViewProvider.viewType, provider)
    );

    // Debounce implementation
    let debounceTimer: NodeJS.Timeout | null = null;

    // Last hashed content
    let lastContentHash: string = '';

    // Function to hash content
    const hashContent = (content: string): string => {
        return crypto.createHash('sha256').update(content).digest('hex');
    };

    context.subscriptions.push(
        vscode.workspace.onDidSaveTextDocument((document) => {
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
                    const response = await axios.post(
                        'https://backend-floral-leaf-1548.fly.dev/analyze2',
                        filePayload,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        }
                    );

                    const analysisResult = response.data;
                    provider.updateContent(analysisResult);
                } catch (error: any) {
                    console.error('Error connecting to the backend endpoint:', error);
                    provider.updateContent('Error: Unable to retrieve analysis.');
                }
            }, 1500); // Debounce delay in milliseconds
        })
    );
}

export function deactivate() { }

export class HLDRViewProvider implements vscode.WebviewViewProvider {
	public static readonly viewType = "hldr.view";
	private _view?: vscode.WebviewView;
	private _analysisResults?: String[] = []; // Default value upon load

	constructor(private readonly _extensionUri: vscode.Uri) {}

	public resolveWebviewView(webviewView: vscode.WebviewView) {
		this._view = webviewView;

		webviewView.webview.options = {
			enableScripts: true,
			localResourceRoots: [this._extensionUri],
		};

		if (this._view) {
			this._view.webview.html = this._getHtmlForWebview(this._view.webview);
		}
	}

	public updateContent(newAnalysisResult: any) {
		if (this._analysisResults?.includes(newAnalysisResult)) {
			this._analysisResults.push(newAnalysisResult);
		}

		if (this._view) {
			this._view.webview.html = this._getHtmlForWebview(this._view.webview);
		}
	}

	private _getHtmlForWebview(webview: vscode.Webview): string {
		const analysisResults = this._analysisResults;

		const scriptUri = webview.asWebviewUri(
			vscode.Uri.joinPath(this._extensionUri, "media", "script.js")
		);

		const styleResetUri = webview.asWebviewUri(
			vscode.Uri.joinPath(this._extensionUri, "media", "reset.css")
		);
		const styleMainUri = webview.asWebviewUri(
			vscode.Uri.joinPath(this._extensionUri, "media", "main.css")
		);

		const nonce = getNonce();

		return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${
									webview.cspSource
								}; script-src 'nonce-${nonce}' https://cdn.jsdelivr.net;">

                <meta name="viewport" content="width=device-width, initial-scale=1.0">

                <link href="${styleResetUri}" rel="stylesheet">
                <link href="${styleMainUri}" rel="stylesheet">

                <script src="https://cdn.jsdelivr.net/npm/markdown-it@14.1.0/dist/markdown-it.min.js"></script>

                <title>H.L.D.R Code Mentor</title>
            </head>
            <body>
                <!-- loop through analysis results -->
                <div id="analysis-results">
                    ${analysisResults
											?.map(
												(index, result) =>
													`<div id="history${index} class="result" data-analysis-result="${result}"></div>`
											)
											.join("")}

                </div>
                <script type="module" nonce="${nonce}" src="${scriptUri}"></script>
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
