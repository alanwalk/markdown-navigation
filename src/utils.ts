'use strict';

import * as vscode from 'vscode';

export function revealLine(lineNum: number) {
    let selection = new vscode.Selection(lineNum, 0, lineNum, 0);
    vscode.window.activeTextEditor.selection = selection;
    vscode.window.activeTextEditor.revealRange(selection, vscode.TextEditorRevealType.AtTop);
}