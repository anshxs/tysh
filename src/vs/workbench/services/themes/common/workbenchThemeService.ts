/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { refineServiceDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { Event } from '../../../../base/common/event.js';
import { Color } from '../../../../base/common/color.js';
import { IColorTheme, IThemeService, IFileIconTheme, IProductIconTheme } from '../../../../platform/theme/common/themeService.js';
import { ConfigurationTarget } from '../../../../platform/configuration/common/configuration.js';
import { isBoolean, isString } from '../../../../base/common/types.js';
import { IconContribution, IconDefinition } from '../../../../platform/theme/common/iconRegistry.js';
import { ColorScheme, ThemeTypeSelector } from '../../../../platform/theme/common/theme.js';

export const IWorkbenchThemeService = refineServiceDecorator<IThemeService, IWorkbenchThemeService>(IThemeService);

export const THEME_SCOPE_OPEN_PAREN = '[';
export const THEME_SCOPE_CLOSE_PAREN = ']';
export const THEME_SCOPE_WILDCARD = '*';

export const themeScopeRegex = /\[(.+?)\]/g;

export enum ThemeSettings {
	COLOR_THEME = 'workbench.colorTheme',
	FILE_ICON_THEME = 'workbench.iconTheme',
	PRODUCT_ICON_THEME = 'workbench.productIconTheme',
	COLOR_CUSTOMIZATIONS = 'workbench.colorCustomizations',
	TOKEN_COLOR_CUSTOMIZATIONS = 'editor.tokenColorCustomizations',
	SEMANTIC_TOKEN_COLOR_CUSTOMIZATIONS = 'editor.semanticTokenColorCustomizations',

	PREFERRED_DARK_THEME = 'workbench.preferredDarkColorTheme',
	PREFERRED_LIGHT_THEME = 'workbench.preferredLightColorTheme',
	PREFERRED_HC_DARK_THEME = 'workbench.preferredHighContrastColorTheme', /* id kept for compatibility reasons */
	PREFERRED_HC_LIGHT_THEME = 'workbench.preferredHighContrastLightColorTheme',
	DETECT_COLOR_SCHEME = 'window.autoDetectColorScheme',
	DETECT_HC = 'window.autoDetectHighContrast',

	SYSTEM_COLOR_THEME = 'window.systemColorTheme'
}

export namespace ThemeSettingDefaults {
	export const COLOR_THEME_DARK = 'Black';
	export const COLOR_THEME_LIGHT = 'White';
	export const COLOR_THEME_HC_DARK = 'Black';
	export const COLOR_THEME_HC_LIGHT = 'White';

	export const FILE_ICON_THEME = 'vs-seti';
	export const PRODUCT_ICON_THEME = 'Default';
}

/**
 * Migrates legacy theme settings IDs to White and Black themes.
 */
export function migrateThemeSettingsId(settingsId: string): string {
	switch (settingsId) {
		case 'White': return 'White';
		case 'Black': return 'Black';
		case 'Light 2026':
		case 'Light Modern':
		case 'Light+':
		case 'Default Light+':
		case 'Default Light Modern':
		case 'Visual Studio Light':
		case 'Default High Contrast Light':
		case 'Experimental Light':
		case 'tysh Light':
		case 'Quiet Light':
		case 'Solarized Light':
			return ThemeSettingDefaults.COLOR_THEME_LIGHT;
		default:
			if (settingsId.toLowerCase().includes('light')) {
				return ThemeSettingDefaults.COLOR_THEME_LIGHT;
			}
			return ThemeSettingDefaults.COLOR_THEME_DARK;
	}
}

export const COLOR_THEME_DARK_INITIAL_COLORS = {
	'actionBar.toggledBackground': '#222222',
	'activityBar.activeBorder': '#FFFFFF',
	'activityBar.background': '#000000',
	'activityBar.border': '#1c1c1c',
	'activityBar.foreground': '#FFFFFF',
	'activityBar.inactiveForeground': '#666666',
	'activityBarBadge.background': '#FFFFFF',
	'activityBarBadge.foreground': '#000000',
	'badge.background': '#222222',
	'badge.foreground': '#FFFFFF',
	'button.background': '#FFFFFF',
	'button.border': '#FFFFFF',
	'button.foreground': '#000000',
	'button.hoverBackground': '#E0E0E0',
	'button.secondaryBackground': '#161616',
	'button.secondaryForeground': '#CCCCCC',
	'button.secondaryHoverBackground': '#222222',
	'chat.slashCommandBackground': '#222222',
	'chat.slashCommandForeground': '#FFFFFF',
	'chat.editedFileForeground': '#E2C08D',
	'checkbox.background': '#0d0d0d',
	'checkbox.border': '#282828',
	'debugToolBar.background': '#000000',
	'descriptionForeground': '#888888',
	'dropdown.background': '#0d0d0d',
	'dropdown.border': '#282828',
	'dropdown.foreground': '#CCCCCC',
	'dropdown.listBackground': '#0d0d0d',
	'editor.background': '#000000',
	'editor.findMatchBackground': '#55555566',
	'editor.foreground': '#EDEDED',
	'editor.inactiveSelectionBackground': '#222222',
	'editor.selectionHighlightBackground': '#33333380',
	'editorGroup.border': '#1c1c1c',
	'editorGroupHeader.tabsBackground': '#000000',
	'editorGroupHeader.tabsBorder': '#1c1c1c',
	'editorGutter.addedBackground': '#2EA043',
	'editorGutter.deletedBackground': '#F85149',
	'editorGutter.modifiedBackground': '#3B82F6',
	'editorIndentGuide.activeBackground1': '#444444',
	'editorIndentGuide.background1': '#222222',
	'editorLineNumber.activeForeground': '#FFFFFF',
	'editorLineNumber.foreground': '#444444',
	'editorOverviewRuler.border': '#000000',
	'editorWidget.background': '#080808',
	'errorForeground': '#F85149',
	'focusBorder': '#333333',
	'foreground': '#CCCCCC',
	'icon.foreground': '#CCCCCC',
	'input.background': '#0d0d0d',
	'input.border': '#282828',
	'input.foreground': '#EDEDED',
	'input.placeholderForeground': '#666666',
	'inputOption.activeBackground': '#222222',
	'inputOption.activeBorder': '#444444',
	'keybindingLabel.foreground': '#CCCCCC',
	'list.activeSelectionIconForeground': '#FFF',
	'list.dropBackground': '#222222',
	'menu.background': '#080808',
	'menu.border': '#1c1c1c',
	'menu.foreground': '#CCCCCC',
	'menu.selectionBackground': '#222222',
	'menu.separatorBackground': '#1c1c1c',
	'notificationCenterHeader.background': '#080808',
	'notificationCenterHeader.foreground': '#CCCCCC',
	'notifications.background': '#080808',
	'notifications.border': '#1c1c1c',
	'notifications.foreground': '#CCCCCC',
	'panel.background': '#000000',
	'panel.border': '#1c1c1c',
	'panelInput.border': '#1c1c1c',
	'panelTitle.activeBorder': '#FFFFFF',
	'panelTitle.activeForeground': '#FFFFFF',
	'panelTitle.inactiveForeground': '#666666',
	'peekViewEditor.background': '#080808',
	'peekViewEditor.matchHighlightBackground': '#44444466',
	'peekViewResult.background': '#050505',
	'peekViewResult.matchHighlightBackground': '#44444466',
	'pickerGroup.border': '#1c1c1c',
	'ports.iconRunningProcessForeground': '#369432',
	'progressBar.background': '#FFFFFF',
	'quickInput.background': '#080808',
	'quickInput.foreground': '#CCCCCC',
	'settings.dropdownBackground': '#0d0d0d',
	'settings.dropdownBorder': '#282828',
	'settings.headerForeground': '#FFFFFF',
	'settings.modifiedItemIndicator': '#FFFFFF88',
	'sideBar.background': '#000000',
	'sideBar.border': '#1c1c1c',
	'sideBar.foreground': '#CCCCCC',
	'sideBarSectionHeader.background': '#000000',
	'sideBarSectionHeader.border': '#1c1c1c',
	'sideBarSectionHeader.foreground': '#CCCCCC',
	'sideBarTitle.foreground': '#CCCCCC',
	'statusBar.background': '#000000',
	'statusBar.border': '#1c1c1c',
	'statusBar.debuggingBackground': '#000000',
	'statusBar.debuggingForeground': '#FFFFFF',
	'statusBar.focusBorder': '#444444',
	'statusBar.foreground': '#999999',
	'statusBar.noFolderBackground': '#000000',
	'statusBarItem.focusBorder': '#444444',
	'statusBarItem.prominentBackground': '#222222',
	'statusBarItem.remoteBackground': '#00000000',
	'statusBarItem.remoteForeground': '#CCCCCC',
	'tab.activeBackground': '#000000',
	'tab.activeBorder': '#000000',
	'tab.activeBorderTop': '#FFFFFF',
	'tab.activeForeground': '#FFFFFF',
	'tab.border': '#1c1c1c',
	'tab.hoverBackground': '#080808',
	'tab.inactiveBackground': '#000000',
	'tab.inactiveForeground': '#666666',
	'tab.lastPinnedBorder': '#222222',
	'tab.selectedBackground': '#111111',
	'tab.selectedBorderTop': '#FFFFFF',
	'tab.selectedForeground': '#FFFFFF',
	'tab.unfocusedActiveBorder': '#000000',
	'tab.unfocusedActiveBorderTop': '#666666',
	'tab.unfocusedHoverBackground': '#080808',
	'terminal.foreground': '#CCCCCC',
	'terminal.inactiveSelectionBackground': '#222222',
	'terminal.tab.activeBorder': '#FFFFFF',
	'textBlockQuote.background': '#0f0f0f',
	'textBlockQuote.border': '#333333',
	'textCodeBlock.background': '#0f0f0f',
	'textLink.activeForeground': '#FFFFFF',
	'textLink.foreground': '#CCCCCC',
	'textPreformat.background': '#1c1c1c',
	'textPreformat.foreground': '#D0D0D0',
	'textSeparator.foreground': '#1c1c1c',
	'titleBar.activeBackground': '#000000',
	'titleBar.activeForeground': '#CCCCCC',
	'titleBar.border': '#1c1c1c',
	'titleBar.inactiveBackground': '#000000',
	'titleBar.inactiveForeground': '#666666',
	'welcomePage.progress.foreground': '#FFFFFF',
	'welcomePage.tileBackground': '#0a0a0a',
	'widget.border': '#1c1c1c'
};

export const COLOR_THEME_LIGHT_INITIAL_COLORS = {
	'actionBar.toggledBackground': '#EEEEEE',
	'activityBar.activeBorder': '#000000',
	'activityBar.background': '#FFFFFF',
	'activityBar.border': '#E5E5E5',
	'activityBar.foreground': '#000000',
	'activityBar.inactiveForeground': '#888888',
	'activityBarBadge.background': '#000000',
	'activityBarBadge.foreground': '#FFFFFF',
	'badge.background': '#EEEEEE',
	'badge.foreground': '#000000',
	'button.background': '#000000',
	'button.border': '#000000',
	'button.foreground': '#FFFFFF',
	'button.hoverBackground': '#222222',
	'button.secondaryBackground': '#F0F0F0',
	'button.secondaryForeground': '#111111',
	'button.secondaryHoverBackground': '#E5E5E5',
	'chat.slashCommandBackground': '#EEEEEE',
	'chat.slashCommandForeground': '#000000',
	'chat.editedFileForeground': '#895503',
	'checkbox.background': '#FFFFFF',
	'checkbox.border': '#CCCCCC',
	'descriptionForeground': '#666666',
	'diffEditor.unchangedRegionBackground': '#FAFAFA',
	'dropdown.background': '#FFFFFF',
	'dropdown.border': '#D5D5D5',
	'dropdown.foreground': '#111111',
	'dropdown.listBackground': '#FFFFFF',
	'editor.background': '#FFFFFF',
	'editor.foreground': '#111111',
	'editor.inactiveSelectionBackground': '#EBEBEB',
	'editor.selectionHighlightBackground': '#D0D0D080',
	'editorGroup.border': '#E5E5E5',
	'editorGroupHeader.tabsBackground': '#FFFFFF',
	'editorGroupHeader.tabsBorder': '#E5E5E5',
	'editorGutter.addedBackground': '#2EA043',
	'editorGutter.deletedBackground': '#F85149',
	'editorGutter.modifiedBackground': '#2563EB',
	'editorIndentGuide.activeBackground1': '#CCCCCC',
	'editorIndentGuide.background1': '#E8E8E8',
	'editorLineNumber.activeForeground': '#000000',
	'editorLineNumber.foreground': '#AAAAAA',
	'editorOverviewRuler.border': '#E5E5E5',
	'editorSuggestWidget.background': '#FFFFFF',
	'editorWidget.background': '#FFFFFF',
	'errorForeground': '#F85149',
	'focusBorder': '#CCCCCC',
	'foreground': '#111111',
	'icon.foreground': '#111111',
	'input.background': '#FFFFFF',
	'input.border': '#D5D5D5',
	'input.foreground': '#111111',
	'input.placeholderForeground': '#888888',
	'inputOption.activeBackground': '#EEEEEE',
	'inputOption.activeBorder': '#999999',
	'inputOption.activeForeground': '#000000',
	'keybindingLabel.foreground': '#111111',
	'list.activeSelectionBackground': '#F0F0F0',
	'list.activeSelectionForeground': '#000000',
	'list.activeSelectionIconForeground': '#000000',
	'list.focusAndSelectionOutline': '#000000',
	'list.hoverBackground': '#F8F8F8',
	'menu.border': '#E5E5E5',
	'menu.selectionBackground': '#F0F0F0',
	'menu.selectionForeground': '#000000',
	'notebook.cellBorderColor': '#E5E5E5',
	'notebook.selectedCellBackground': '#F0F0F0',
	'notificationCenterHeader.background': '#FFFFFF',
	'notificationCenterHeader.foreground': '#111111',
	'notifications.background': '#FFFFFF',
	'notifications.border': '#E5E5E5',
	'notifications.foreground': '#111111',
	'panel.background': '#FFFFFF',
	'panel.border': '#E5E5E5',
	'panelInput.border': '#E5E5E5',
	'panelTitle.activeBorder': '#000000',
	'panelTitle.activeForeground': '#000000',
	'panelTitle.inactiveForeground': '#888888',
	'peekViewEditor.matchHighlightBackground': '#E0E0E080',
	'peekViewResult.background': '#FAFAFA',
	'peekViewResult.matchHighlightBackground': '#E0E0E080',
	'pickerGroup.border': '#E5E5E5',
	'pickerGroup.foreground': '#8B949E',
	'ports.iconRunningProcessForeground': '#369432',
	'progressBar.background': '#000000',
	'quickInput.background': '#FFFFFF',
	'quickInput.foreground': '#111111',
	'searchEditor.textInputBorder': '#D5D5D5',
	'settings.dropdownBackground': '#FFFFFF',
	'settings.dropdownBorder': '#D5D5D5',
	'settings.headerForeground': '#000000',
	'settings.modifiedItemIndicator': '#00000088',
	'settings.numberInputBorder': '#D5D5D5',
	'settings.textInputBorder': '#D5D5D5',
	'sideBar.background': '#FFFFFF',
	'sideBar.border': '#E5E5E5',
	'sideBar.foreground': '#111111',
	'sideBarSectionHeader.background': '#FFFFFF',
	'sideBarSectionHeader.border': '#E5E5E5',
	'sideBarSectionHeader.foreground': '#111111',
	'sideBarTitle.foreground': '#000000',
	'statusBar.background': '#FFFFFF',
	'statusBar.border': '#E5E5E5',
	'statusBar.debuggingBackground': '#FFFFFF',
	'statusBar.debuggingForeground': '#000000',
	'statusBar.focusBorder': '#CCCCCC',
	'statusBar.foreground': '#555555',
	'statusBar.noFolderBackground': '#FFFFFF',
	'statusBarItem.compactHoverBackground': '#E5E5E5',
	'statusBarItem.errorBackground': '#C72E0F',
	'statusBarItem.focusBorder': '#CCCCCC',
	'statusBarItem.hoverBackground': '#00000010',
	'statusBarItem.prominentBackground': '#F0F0F0',
	'statusBarItem.remoteBackground': '#00000000',
	'statusBarItem.remoteForeground': '#111111',
	'tab.activeBackground': '#FFFFFF',
	'tab.activeBorder': '#FFFFFF',
	'tab.activeBorderTop': '#000000',
	'tab.activeForeground': '#000000',
	'tab.border': '#E5E5E5',
	'tab.hoverBackground': '#F8F8F8',
	'tab.inactiveBackground': '#FFFFFF',
	'tab.inactiveForeground': '#888888',
	'tab.lastPinnedBorder': '#E5E5E5',
	'tab.selectedBackground': '#F5F5F5',
	'tab.selectedBorderTop': '#000000',
	'tab.selectedForeground': '#000000',
	'tab.unfocusedActiveBorder': '#FFFFFF',
	'tab.unfocusedActiveBorderTop': '#AAAAAA',
	'tab.unfocusedHoverBackground': '#F8F8F8',
	'terminal.foreground': '#111111',
	'terminal.inactiveSelectionBackground': '#EBEBEB',
	'terminal.tab.activeBorder': '#000000',
	'terminalCursor.foreground': '#000000',
	'textBlockQuote.background': '#F5F5F5',
	'textBlockQuote.border': '#CCCCCC',
	'textCodeBlock.background': '#F5F5F5',
	'textLink.activeForeground': '#000000',
	'textLink.foreground': '#333333',
	'textPreformat.background': '#00000010',
	'textPreformat.foreground': '#333333',
	'textSeparator.foreground': '#E5E5E5',
	'titleBar.activeBackground': '#FFFFFF',
	'titleBar.activeForeground': '#111111',
	'titleBar.border': '#E5E5E5',
	'titleBar.inactiveBackground': '#FFFFFF',
	'titleBar.inactiveForeground': '#888888',
	'welcomePage.tileBackground': '#F7F7F7',
	'widget.border': '#E5E5E5'
};

export interface IWorkbenchTheme {
	readonly id: string;
	readonly label: string;
	readonly extensionData?: ExtensionData;
	readonly description?: string;
	readonly settingsId: string | null;
}

export interface IWorkbenchColorTheme extends IWorkbenchTheme, IColorTheme {
	readonly settingsId: string;
	readonly tokenColors: ITextMateThemingRule[];
}

export interface IColorMap {
	[id: string]: Color;
}

export interface IWorkbenchFileIconTheme extends IWorkbenchTheme, IFileIconTheme {
}

export interface IWorkbenchProductIconTheme extends IWorkbenchTheme, IProductIconTheme {
	readonly settingsId: string;

	getIcon(icon: IconContribution): IconDefinition | undefined;
}

export type ThemeSettingTarget = ConfigurationTarget | undefined | 'auto' | 'preview';


export interface IWorkbenchThemeService extends IThemeService {
	readonly _serviceBrand: undefined;
	setColorTheme(themeId: string | undefined | IWorkbenchColorTheme, settingsTarget: ThemeSettingTarget): Promise<IWorkbenchColorTheme | null>;
	getColorTheme(): IWorkbenchColorTheme;
	getColorThemes(): Promise<IWorkbenchColorTheme[]>;
	getMarketplaceColorThemes(publisher: string, name: string, version: string): Promise<IWorkbenchColorTheme[]>;
	readonly onDidColorThemeChange: Event<IWorkbenchColorTheme>;

	getPreferredColorScheme(): ColorScheme | undefined;

	setFileIconTheme(iconThemeId: string | undefined | IWorkbenchFileIconTheme, settingsTarget: ThemeSettingTarget): Promise<IWorkbenchFileIconTheme>;
	getFileIconTheme(): IWorkbenchFileIconTheme;
	getFileIconThemes(): Promise<IWorkbenchFileIconTheme[]>;
	getMarketplaceFileIconThemes(publisher: string, name: string, version: string): Promise<IWorkbenchFileIconTheme[]>;
	readonly onDidFileIconThemeChange: Event<IWorkbenchFileIconTheme>;

	setProductIconTheme(iconThemeId: string | undefined | IWorkbenchProductIconTheme, settingsTarget: ThemeSettingTarget): Promise<IWorkbenchProductIconTheme>;
	getProductIconTheme(): IWorkbenchProductIconTheme;
	getProductIconThemes(): Promise<IWorkbenchProductIconTheme[]>;
	getMarketplaceProductIconThemes(publisher: string, name: string, version: string): Promise<IWorkbenchProductIconTheme[]>;
	readonly onDidProductIconThemeChange: Event<IWorkbenchProductIconTheme>;
}

export interface IThemeScopedColorCustomizations {
	[colorId: string]: string;
}

export interface IColorCustomizations {
	[colorIdOrThemeScope: string]: IThemeScopedColorCustomizations | string;
}

export interface IThemeScopedTokenColorCustomizations {
	[groupId: string]: ITextMateThemingRule[] | ITokenColorizationSetting | boolean | string | undefined;
	comments?: string | ITokenColorizationSetting;
	strings?: string | ITokenColorizationSetting;
	numbers?: string | ITokenColorizationSetting;
	keywords?: string | ITokenColorizationSetting;
	types?: string | ITokenColorizationSetting;
	functions?: string | ITokenColorizationSetting;
	variables?: string | ITokenColorizationSetting;
	textMateRules?: ITextMateThemingRule[];
	semanticHighlighting?: boolean; // deprecated, use ISemanticTokenColorCustomizations.enabled instead
}

export interface ITokenColorCustomizations {
	[groupIdOrThemeScope: string]: IThemeScopedTokenColorCustomizations | ITextMateThemingRule[] | ITokenColorizationSetting | boolean | string | undefined;
	comments?: string | ITokenColorizationSetting;
	strings?: string | ITokenColorizationSetting;
	numbers?: string | ITokenColorizationSetting;
	keywords?: string | ITokenColorizationSetting;
	types?: string | ITokenColorizationSetting;
	functions?: string | ITokenColorizationSetting;
	variables?: string | ITokenColorizationSetting;
	textMateRules?: ITextMateThemingRule[];
	semanticHighlighting?: boolean; // deprecated, use ISemanticTokenColorCustomizations.enabled instead
}

export interface IThemeScopedSemanticTokenColorCustomizations {
	[styleRule: string]: ISemanticTokenRules | boolean | undefined;
	enabled?: boolean;
	rules?: ISemanticTokenRules;
}

export interface ISemanticTokenColorCustomizations {
	[styleRuleOrThemeScope: string]: IThemeScopedSemanticTokenColorCustomizations | ISemanticTokenRules | boolean | undefined;
	enabled?: boolean;
	rules?: ISemanticTokenRules;
}

export interface IThemeScopedExperimentalSemanticTokenColorCustomizations {
	[themeScope: string]: ISemanticTokenRules | undefined;
}

export interface IExperimentalSemanticTokenColorCustomizations {
	[styleRuleOrThemeScope: string]: IThemeScopedExperimentalSemanticTokenColorCustomizations | ISemanticTokenRules | undefined;
}

export type IThemeScopedCustomizations =
	IThemeScopedColorCustomizations
	| IThemeScopedTokenColorCustomizations
	| IThemeScopedExperimentalSemanticTokenColorCustomizations
	| IThemeScopedSemanticTokenColorCustomizations;

export type IThemeScopableCustomizations =
	IColorCustomizations
	| ITokenColorCustomizations
	| IExperimentalSemanticTokenColorCustomizations
	| ISemanticTokenColorCustomizations;

export interface ISemanticTokenRules {
	[selector: string]: string | ISemanticTokenColorizationSetting | undefined;
}

export interface ITextMateThemingRule {
	name?: string;
	scope?: string | string[];
	settings: ITokenColorizationSetting;
}

export interface ITokenColorizationSetting {
	foreground?: string;
	background?: string;
	fontStyle?: string; /* [italic|bold|underline|strikethrough] */
	fontFamily?: string;
	fontSize?: number;
	lineHeight?: number;
}

export interface ISemanticTokenColorizationSetting {
	foreground?: string;
	fontStyle?: string; /* [italic|bold|underline|strikethrough] */
	bold?: boolean;
	underline?: boolean;
	strikethrough?: boolean;
	italic?: boolean;
}

export interface ExtensionData {
	extensionId: string;
	extensionPublisher: string;
	extensionName: string;
	extensionIsBuiltin: boolean;
}

export namespace ExtensionData {
	export function toJSONObject(d: ExtensionData | undefined): any {
		return d && { _extensionId: d.extensionId, _extensionIsBuiltin: d.extensionIsBuiltin, _extensionName: d.extensionName, _extensionPublisher: d.extensionPublisher };
	}
	export function fromJSONObject(o: any): ExtensionData | undefined {
		if (o && isString(o._extensionId) && isBoolean(o._extensionIsBuiltin) && isString(o._extensionName) && isString(o._extensionPublisher)) {
			return { extensionId: o._extensionId, extensionIsBuiltin: o._extensionIsBuiltin, extensionName: o._extensionName, extensionPublisher: o._extensionPublisher };
		}
		return undefined;
	}
	export function fromName(publisher: string, name: string, isBuiltin = false): ExtensionData {
		return { extensionPublisher: publisher, extensionId: `${publisher}.${name}`, extensionName: name, extensionIsBuiltin: isBuiltin };
	}
}

export interface IThemeExtensionPoint {
	id: string;
	label?: string;
	description?: string;
	path: string;
	uiTheme?: ThemeTypeSelector;
	_watch: boolean; // unsupported options to watch location
}
