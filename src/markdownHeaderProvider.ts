'use strict';

import * as vscode from "vscode";
import { MarkdownHeader } from './markdownHeader';

class MarkdownHeaderNode extends vscode.TreeItem {
	constructor(
		public readonly label: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly command?: vscode.Command,
		public readonly childNodes?: MarkdownHeaderNode[]
	)
	{
		super(label, collapsibleState);
	}
}

export class MarkdownHeaderProvider implements vscode.TreeDataProvider<MarkdownHeaderNode>
{
	private tree: MarkdownHeaderNode[] = [];
	private onHeaderListChanged: vscode.EventEmitter<MarkdownHeaderNode | undefined> = new vscode.EventEmitter<MarkdownHeaderNode | undefined>();
	onDidChangeTreeData: vscode.Event<MarkdownHeaderNode | undefined> = this.onHeaderListChanged.event;

	getTreeItem(element: MarkdownHeaderNode): MarkdownHeaderNode {
		return element;
	}

	getChildren(element?: MarkdownHeaderNode): Thenable<MarkdownHeaderNode[]> {
		return element ? Promise.resolve(element.childNodes) : Promise.resolve(this.tree);
	}
	
	SetHeaderList(headerList : MarkdownHeader[]) {
		this.tree = [];
		let minDepth = 6;
		headerList.forEach(element => {
			minDepth = Math.min(element.depth, minDepth);
		});
		for (let index = 0; index < headerList.length; index++) {
			if (headerList[index].depth == minDepth) {
				this.tree.push(this.generateNode(headerList, index));
			}
		}
		this.onHeaderListChanged.fire();
	}

	private generateNode(headerList : MarkdownHeader[], rootIndex : number): MarkdownHeaderNode {		
		let header = headerList[rootIndex];
		let childNodes: MarkdownHeaderNode[] = []
		for (let index = rootIndex + 1; index < headerList.length; index++) {
			if (header.depth < headerList[index].depth) {
				childNodes.push(this.generateNode(headerList, index));
			} else {
				break;
			}
		}
		return new MarkdownHeaderNode(
			header.title,
			(childNodes.length > 0) ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.None,
			{
				command: 'extension.selectHeader',
				title: 'Select TOC Header',
				arguments: [header.lineNum]
			},
			childNodes
		)
	}
}