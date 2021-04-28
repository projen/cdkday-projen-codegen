import { FileBase, Project } from 'projen';
import { SourceCode } from './source-code';

export class TypeScriptSource extends SourceCode {
  constructor(project: Project, filePath: string) {
    super(project, filePath);

    // add the projen marker at the top followed by a newline
    this.comment(FileBase.PROJEN_MARKER);
    this.line();
  }

  public comment(text: string) {
    this.line(`// ${text}`);
  }

  public docstring(summary: string, options: DocstringOptions = {}) {
    this.line('/**');

    const emit = (s: string = '') => {
      for (const line of s.split('\n')) {
        this.line(` * ${line.trim()}`);
      }
    };

    emit(summary);

    if (options.remarks) {
      emit(); // newline before remarks
      emit(options.remarks);
    }

    const tags = options.tags ?? [];

    let defaultValue = options.defaultValue !== undefined ? JSON.stringify(options.defaultValue) : undefined;
    if (options.defaultDescription && defaultValue === undefined) {
      defaultValue = '-';
    }

    if (defaultValue) {
      tags.push({ default: `${defaultValue} ${options.defaultDescription ?? ''}` });
    }

    if (tags.length > 0) {
      emit(); // newline before tags
    }

    for (const tag of tags) {
      for (const [k, v] of Object.entries(tag)) {
        emit(`@${k} ${v.split('\n').join(' ')}`);
      }
    }

    this.line(' */');
  }
}

export interface DocstringOptions {
  readonly remarks?: string;

  /**
   * Adds a "@returns" tag.
   */
  readonly returns?: string;

  /**
   * Adds "@param" tags.
   */
  readonly params?: { [name: string]: string };

  /**
   * The default value (will be JSON stringified).
   *
   * If `defaultDescription` is specified and `defaultValue` is not specified, the default value will be "-".
   * @default - no default value
   */
  readonly defaultValue?: any;

  /**
   * The default description.
   * @default - no default description
   */
  readonly defaultDescription?: string;

  /**
   * Arbitrary tags to add to the docstring
   */
  readonly tags?: Array<{ [tag: string]: string }>;
}

export class TypeScriptInterface {

}