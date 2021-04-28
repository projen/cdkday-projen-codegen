import { FileBase } from 'projen';
import { TypeScriptSource } from '../typescript';
import { TestProject } from './util';

test('typescript source includes the projen marker', () => {
  const project = new TestProject();
  new TypeScriptSource(project, 'hello.ts');
  expect(project.snapshot('hello.ts')).toStrictEqual(`// ${FileBase.PROJEN_MARKER}\n`);
});

test('line comment', () => {
  const project = new TestProject();
  const ts = new TypeScriptSource(project, 'hello.ts');

  ts.comment('another comment');
  ts.open();
  ts.comment('indented comment');
  ts.close();

  expect(project.snapshot('hello.ts')).toMatchSnapshot();
});

describe('docstring', () => {
  test('summary only', () => {
    const project = new TestProject();
    const ts = new TypeScriptSource(project, 'hello.ts');

    ts.docstring('summary');

    expect(project.snapshot('hello.ts')).toMatchSnapshot();
  });

  test('multiline summary', () => {
    const project = new TestProject();
    const ts = new TypeScriptSource(project, 'hello.ts');

    ts.docstring('summary\nline2\nline3');

    expect(project.snapshot('hello.ts')).toMatchSnapshot();
  });

  test('summary + remarks', () => {
    const project = new TestProject();
    const ts = new TypeScriptSource(project, 'hello.ts');

    ts.docstring('summary', {
      remarks: 'Hello, world this is awesome\nanother remakrs section',
    });

    expect(project.snapshot('hello.ts')).toMatchSnapshot();
  });

  test('tags', () => {
    const project = new TestProject();
    const ts = new TypeScriptSource(project, 'hello.ts');

    ts.docstring('summary\nline2\nline3', {
      tags: [
        { param: 'foo\tbar' },
        {
          returns: 'Hello world',
          default: 'boom boom',
        },
        { param: 'zoo\tzar\nnewlinx' },
      ],
    });

    expect(project.snapshot('hello.ts')).toMatchSnapshot();
  });

  test('default value', () => {
    const project = new TestProject();
    const ts = new TypeScriptSource(project, 'hello.ts');

    ts.docstring('string', {
      defaultValue: 'this is the default value',
    });

    ts.docstring('boolean', {
      defaultValue: false,
      defaultDescription: 'no no no',
    });

    ts.docstring('number', {
      defaultValue: 1234,
    });

    ts.docstring('array', {
      defaultValue: [1, 2, 3, 'hello'],
      defaultDescription: 'this is an array',
    });

    ts.docstring('just description', {
      defaultDescription: 'no default value but there is a desc',
    });

    expect(project.snapshot('hello.ts')).toMatchSnapshot();
  });
});