import { SourceCode } from '..';
import { TestProject } from './util';

test('lines', () => {
  const project = new TestProject();
  const hello = new SourceCode(project, 'test.txt');
  hello.line('this is my first source file');
  hello.line(); // empty line
  hello.line('last line');

  expect(project.snapshot('test.txt')).toStrictEqual([
    'this is my first source file',
    '',
    'last line',
  ].join('\n'));
});

test('open/close', () => {
  const project = new TestProject();
  const hello = new SourceCode(project, 'test.txt');
  hello.line('level0');
  hello.open();
  hello.line('level1');
  hello.open();
  hello.line('level2');
  hello.close();
  hello.line('level1');
  hello.close();
  hello.line('level0');
  expect(project.snapshot('test.txt')).toStrictEqual([
    'level0',
    '  level1',
    '    level2',
    '  level1',
    'level0',
  ].join('\n'));
});

test('indent', () => {
  const project = new TestProject();
  const hello = new SourceCode(project, 'test.txt', { indent: 4 });
  hello.line('level0');
  hello.open();
  hello.line('level1');
  hello.close();
  hello.line('level0');
  expect(project.snapshot('test.txt')).toStrictEqual([
    'level0',
    '    level1',
    'level0',
  ].join('\n'));
});
