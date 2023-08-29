import type { Alignment, AlignmentAttributeDefinition, IconConfig, Size, SizeAttributeDefinition } from './iconconfig';
import type InsertIconCommand from './inserticoncommand';
import type ModifyIconCommand from './modifyiconcommand';

declare module '@ckeditor/ckeditor5-core' {
	interface EditorConfig {
		icon?: IconConfig;
	}
	interface CommandsMap {
		insertIcon: InsertIconCommand;
		sizeIcon: ModifyIconCommand<Size, SizeAttributeDefinition>;
		alignIcon: ModifyIconCommand<Alignment, AlignmentAttributeDefinition>;
	}
}
