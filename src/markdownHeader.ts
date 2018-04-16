
'use strict';

import * as vscode from "vscode";

export class MarkdownHeader {

    constructor(
        public title : string, 
        public lineNum : number, 
        public depth : number)
    {

    }
}