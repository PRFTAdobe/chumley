/* eslint-disable import/no-extraneous-dependencies */

import aemClientlibGenerator from 'aem-clientlib-generator'
import { promises as fsPromises } from 'fs'
import path from 'path'

interface AssetItem {
  [key: string]: {
    cwd: string
    files: string[]
    flatten: boolean
    ignore?: string[]
  }
}

interface ClientLibItem {
  path?: string
  name: string
  serializationFormat?: 'json' | 'xml' | 'slingxml'
  allowProxy: boolean
  embed?: string[]
  dependencies?: string[]
  categories: string[]
  customProperties?: string[]
  cssProcessor: string[]
  jsProcessor: string[]
  assets: AssetItem
  guideComponentType?: string
}

const directoryName = process.cwd()
const context = path.join(directoryName, 'dist')
const clientLibRoot = path.join(
  directoryName,
  '..',
  'ui.apps',
  'src',
  'main',
  'content',
  'jcr_root',
  'apps',
  'chumley',
  'clientlibs',
)

const libsBaseConfig = {
  allowProxy: true,
  serializationFormat: 'xml',
  cssProcessor: ['default:none', 'min:none'],
  jsProcessor: ['default:none', 'min:none'],
}

const clientLibraryConfigurations: ClientLibItem[] = [
  {
    ...libsBaseConfig,
    name: 'clientlib-react',
    categories: ['chumley.react'],
    serializationFormat: 'xml',
    cssProcessor: ['default:none', 'min:none'],
    jsProcessor: ['default:none', 'min:none'],
    assets: {
      // Copy entrypoint scripts and stylesheets into the respective ClientLib
      // directories
      js: {
        cwd: 'clientlib-react',
        files: ['**/*.js'],
        flatten: false,
      },
      css: {
        cwd: 'clientlib-react',
        files: ['**/*.css'],
        flatten: false,
      },

      // Copy all other files into the `resources` ClientLib directory
      resources: {
        cwd: 'clientlib-react/resources',
        files: ['**/*.*'],
        flatten: false,
        ignore: ['**/*.js', '**/*.css'],
      },
    },
  },
]

const options = {
  context,
  clientLibRoot,
  verbose: true,
}

const updateReactResourcePath = async () => {
  try {
    const bundleFile = path.join(context, 'clientlib-react', 'react.bundle.css')
    const contents = await fsPromises.readFile(bundleFile, 'utf-8')
    const replaced = contents.replace(/\/resources/gi, '../resources')

    await fsPromises.writeFile(bundleFile, replaced)
  } catch (err) {
    console.log(err)
  }
}

await updateReactResourcePath()

aemClientlibGenerator(clientLibraryConfigurations, options, () => {
  console.log('generator has finished')
})
