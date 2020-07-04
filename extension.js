// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const { EndOfLineState, createNoSubstitutionTemplateLiteral, updateNamespaceExport } = require('typescript');
const { Linter } = require('eslint');
const util = require('util');

// Helper method when debugging
function inspect(obj){
	console.log(util.inspect(obj))
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	const disposable = vscode.commands.registerCommand('yaml-sorter.sortYamlKeys', function () {
		// Get the active text editor
		const editor = vscode.window.activeTextEditor;

		if (editor) {
			const document = editor.document;
			const selection = editor.selection;

			// Get the text selected
			const text = document.getText(selection);
			const sorted_text = sortYamlLines(text)
			return editor.edit(editBuilder => {
				editBuilder.replace(selection, sorted_text);
			});
		}
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

function sortYamlLines(text){
	const lines = text.split("\n");
	var groups = groupLines(lines);
	groups.sort(compareGroups);
	var out = ungroup(groups);
	return out;
}

function compareGroups(a, b){
	return groupKey(a).localeCompare(groupKey(b));
}

function groupKey(group){
	// Ignore all coments and return first line that is not a comment, or the comment.
	for (let i = 0; i < group.length; i++) {
		const element = group[i];
		if(element[0] != "#" && element[0] != " "){
			return element;
		}
	}
	// When no key found return first line.
	return group[0];
}

function last(array){
	return array[array.length -1];
}

/**
 * @param {any[]} rows
 */
function groupLines(rows){
  var groups = []
  rows.forEach(row => {
	// When tabbed row or empty line we push it to last group
    if(row[0] == " " || row.strip == ""){
      // Indented or empty line
      if(last(groups))
        last(groups).push(row)
	  else
		groups.push([row])	
	}else if ( row[0] == "#" ){
      // Merge with next row ...
      mergeWithLastIfCommentOrNewGroup(row, groups)
	}else{
      // Main group
      mergeWithLastIfCommentOrNewGroup(row, groups)
	}
  
  });
  return groups; 
}

/**
 * @param {any} row
 * @param {any[]} groups
 */
function mergeWithLastIfCommentOrNewGroup(row, groups){
	if(last(groups)){
		if(last(last(groups))[0]=="#"){ // When last group ends with a comment.
			// We add the next line to it even when its a yaml key.
			last(groups).push(row)
		}else{
			// When last group
			groups.push([row])
		}
	}else{
		groups.push([row])		
	}
}

function ungroup(groups){
	var lines = [];
	groups.forEach(group => {
		group.forEach(line => {
			lines.push(line);	
		});
	});
	return lines.join("\n");
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate,
	sortYamlLines
}
