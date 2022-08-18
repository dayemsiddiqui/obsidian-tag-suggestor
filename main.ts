import { DocumentClassificationModel } from 'DocumentClassificationModel';
import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import {extractTags, generateTags} from "./FileProcessor";
import {generateKeywords} from "./generateKeywords";

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
	tags:  Record <string, string>
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default',
	tags: {}
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('This is a notice!');
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Tag Suggester');


		this.addCommand({
			id: 'recommend-tags',
			name: 'Recommend Tags',
			callback: async () => {
				statusBarItemEl.setText('Tag Suggester: Running ML inference...');
				const file = this.app.workspace.getActiveFile()
				let content = await this.app.vault.read(file)
				const tags = await this.predictTags(content)
				const processedTags = tags.data.choices[0].text.split('\n-').map((value: string) => value.trim()).join(', #')
				console.log(processedTags)
				content = content.concat("\n\n").concat("Recommended Tags: \n").concat(processedTags)
				await this.app.vault.modify(file, content)
				console.log("Current file content: ", content)
				statusBarItemEl.setText('Tag Suggester: Finished');
			}
		});


		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}


	private async predictTags(targetDocument: string) {
		return generateKeywords(targetDocument)
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async updateSettings(settings: MyPluginSettings) {
		await this.saveData(settings);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Settings for my awesome plugin.'});

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					console.log('Secret: ' + value);
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Tags')
			.setDesc('You current tags are')
			.addDropdown(component =>  {
				component
                    .addOptions(this.plugin.settings.tags)
			})
	}
}
