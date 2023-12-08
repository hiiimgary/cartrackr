import { formatFiles, generateFiles, Tree } from '@nx/devkit';
import * as path from 'path';
import { AdminFeatureGeneratorSchema } from './schema';
import { strings } from '@angular-devkit/core';

export async function adminFeatureGenerator(
  tree: Tree,
  options: AdminFeatureGeneratorSchema
) {
  const projectRoot = `apps/cartrackr-admin`;

  const featurePath = `${projectRoot}/src/app/pages/dashboard/features/${options.featureName}`;

  generateFiles(tree, path.join(__dirname, 'files'), featurePath, {
    dasherize: strings.dasherize,
    classify: strings.classify,
    camelize: strings.camelize,
    featureFileName: strings.dasherize(options.featureName),
    template: '',
    ...options,
  });
  await formatFiles(tree);
}

export default adminFeatureGenerator;
