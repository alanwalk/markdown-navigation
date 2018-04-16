'use strict';

enum CodeBlockType {
    None,
    Backquote,
    Tiled
}

const REGEXP_CODE_BLOCK_BACKQUOTE = /^```/;
const REGEXP_CODE_BLOCK_TILDE = /^~~~/;

export class CodeBlockChecker {

    private codeBlockStatus : CodeBlockType = CodeBlockType.None;

    public pushAndCheck(text : string) {
        if (text.match(REGEXP_CODE_BLOCK_BACKQUOTE)) {
            if (this.codeBlockStatus == CodeBlockType.None) {
                this.codeBlockStatus = CodeBlockType.Backquote
            } else if (this.codeBlockStatus == CodeBlockType.Backquote) {
                this.codeBlockStatus = CodeBlockType.None;
            }
        } else if(text.match(REGEXP_CODE_BLOCK_TILDE)) {
            if (this.codeBlockStatus == CodeBlockType.None) {
                this.codeBlockStatus = CodeBlockType.Tiled
            } else if (this.codeBlockStatus == CodeBlockType.Tiled) {
                this.codeBlockStatus = CodeBlockType.None;
            }
        }
        return this.codeBlockStatus != CodeBlockType.None;
    }
}