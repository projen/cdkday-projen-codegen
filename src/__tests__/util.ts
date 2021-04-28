import { mkdtempSync, readFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { LogLevel, Project, ProjectOptions } from 'projen';

export class TestProject extends Project {
  constructor(options: Omit<ProjectOptions, 'name'> = {}) {
    super({
      name: 'test',
      outdir: mkdtempSync(join(tmpdir(), 'projen-test.')),
      logging: {
        level: LogLevel.ERROR,
      },
      ...options,
    });
  }

  public snapshot(file: string) {
    this.synth();
    return readFileSync(join(this.outdir, file), 'utf-8');
  }
}