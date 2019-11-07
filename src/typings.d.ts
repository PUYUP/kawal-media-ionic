// Empty typings for the editor used in the app to satisfy the TS compiler in the strict mode:
declare module '@ckeditor/ckeditor5-build-classic' {
	const ClassicEditor: any;
	export = ClassicEditor;
}

declare module '@ckeditor/ckeditor5-image/src/imageresize' {}