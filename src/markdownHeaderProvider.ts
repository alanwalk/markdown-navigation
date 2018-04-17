'use strict';

import * as vscode from "vscode";
import { MarkdownHeader } from './markdownHeader';

class MarkdownHeaderNode extends vscode.TreeItem {
	constructor(
		public label: string,
		public collapsibleState: vscode.TreeItemCollapsibleState,
		public depth: number,
		public command: vscode.Command,
		public childNodes: MarkdownHeaderNode[]
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
		let rootStack : MarkdownHeaderNode[] = [];
		headerList.forEach(header => {
			while ((rootStack.length > 0) && (rootStack[rootStack.length - 1].depth >= header.depth)) {
				rootStack.pop();
			}
			let headerNode = this.generateNode(header);
			if ((rootStack.length > 0)) {
				let top = rootStack[rootStack.length - 1]
				top.childNodes.push(headerNode);
			} else {
				this.tree.push(headerNode);
			}
			rootStack.push(headerNode);
		});
		this.tree.forEach(node => {
			this.refreshNodeCollapsibleState(node);
		});
		this.onHeaderListChanged.fire();
	}

	private refreshNodeCollapsibleState(node : MarkdownHeaderNode) {
		if (node.childNodes.length > 0) {
			node.collapsibleState = vscode.TreeItemCollapsibleState.Expanded
			node.childNodes.forEach(childNode => {
				this.refreshNodeCollapsibleState(childNode);
			});
		}
	}

	private generateNode(header : MarkdownHeader): MarkdownHeaderNode {
		let childNodes: MarkdownHeaderNode[] = []
		return new MarkdownHeaderNode(
			header.title,
			vscode.TreeItemCollapsibleState.None,
			header.depth,
			{
				command: 'extension.selectHeader',
				title: 'Select Header',
				arguments: [header.lineNum]
			},
			childNodes
		)
	}
}