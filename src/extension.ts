'use strict';

import * as vscode from 'vscode';
import * as utils from './utils';
import { MarkdownHeaderProvider } from './markdownHeaderProvider'
import { MarkdownTocTools } from './markdownTocTools'

export function activate(context: vscode.ExtensionContext) {
    let markdownHeaderProvider = new MarkdownHeaderProvider();
    let markdownTocTools = new MarkdownTocTools(markdownHeaderProvider);
    markdownTocTools.updateToc();
    context.subscriptions.push(vscode.window.registerTreeDataProvider('MarkdownNavigation', markdownHeaderProvider));
    context.subscriptions.push(vscode.workspace.onDidSaveTextDocument(() => markdownTocTools.updateToc()));
    context.subscriptions.push(vscode.workspace.onDidOpenTextDocument(() => markdownTocTools.updateToc()));
    context.subscriptions.push(vscode.commands.registerCommand('extension.selectHeader', lineNum => utils.revealLine(lineNum)));
}
