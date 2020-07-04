const assert = require('assert');

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
const vscode = require('vscode');
const extension = require('../../extension');

suite('YamlSorter Test Suite', () => {
	
	test('Sample test', async () => {
		const content = "X:\n\n\nZ:\nA:\n\n\nB:"
		const document = await vscode.workspace.openTextDocument({
			language: 'plaintext',
			content
		});
		await vscode.window.showTextDocument(document);
		
		const editor = vscode.window.activeTextEditor;
		
		// Selecting 3rd and 4th lines
		editor.selections = [
			new vscode.Selection(3, 0, 4, 99),
		];
		await vscode.commands.executeCommand('yaml-sorter.sortYamlKeys');
		assert.equal(editor.document.getText(), "X:\n\n\nA:\nZ:\n\n\nB:");
	});
	
	// Unit testing exposing the sortYamlMethod.
	test('sorts keys alphabetically', () => {
		const text = "B:\nA:";
		
		assert.equal(extension.sortYamlLines(text), "A:\nB:");
	});

	test('groups comment with next key', () => {
		const text = "# My comment\nB:\nA:";
		
		assert.equal(extension.sortYamlLines(text), "A:\n# My comment\nB:");
	});
	
	test('nested keys are grouped with parent', () => {
		const text = "C:\n  b:\nA:";
		
		assert.equal(extension.sortYamlLines(text), "A:\nC:\n  b:");
	});

	test('Comments alone are sorted alone', () => {
		const text = "A:\n\n# A comment\n\nC:";
		
		assert.equal(extension.sortYamlLines(text), "\n# A comment\n\nA:\nC:");
	});

});
