'use strict';

import * as vscode from 'vscode';
import { CodeBlockChecker } from './codeBlockChecker';
import { MarkdownHeader } from './markdownHeader';
import { MarkdownHeaderProvider } from './markdownHeaderProvider'

const REGEXP_HEADER = /^(\#{1,6})\s*(.+)/;
const REGEXP_SPECIAL_HEADER_1 = /^=+$/;
const REGEXP_SPECIAL_HEADER_2 = /^-+$/;

export class MarkdownTocTools {
    constructor(private markdownHeaderProvider : MarkdownHeaderProvider) {}

    public updateToc() {
        let headerList = this.GetHeaderList();
        this.markdownHeaderProvider.SetHeaderList(headerList);
    }

    private GetHeaderList() : MarkdownHeader[] {
        let headerList = [];
        if (vscode.window.activeTextEditor) {
            let doc = vscode.window.activeTextEditor.document;
            let codeBlockChecker = new CodeBlockChecker();
    
            for (let lineNum = 0; lineNum < doc.lineCount; ++lineNum) {
                let lineText = doc.lineAt(lineNum).text
    
                // Skip CodeBlock
                if (codeBlockChecker.pushAndCheck(lineText)) continue;
                
                // Special Header
                if (lineNum > 0) {
                    let lastLineNum = lineNum - 1
                    let lastLineText = doc.lineAt(lastLineNum).text
                    if (lineText.match(REGEXP_SPECIAL_HEADER_1)) {
                        headerList.push(new MarkdownHeader(lastLineText, lastLineNum, 1));
                        continue;
                    }else if (lineText.match(REGEXP_SPECIAL_HEADER_2)) {
                        headerList.push(new MarkdownHeader(lastLineText, lastLineNum, 2));
                        continue;
                    }
                }
    
                let headerResult = lineText.match(REGEXP_HEADER);
                if (headerResult) {
                    headerList.push(new MarkdownHeader(headerResult[2], lineNum, headerResult[1].length));
                }
            }
        }
        return headerList;
    }
}
