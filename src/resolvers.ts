import { InMemoryCacheConfig } from '@apollo/client'
import { getDirectoryHandle } from './fs-helper'
import { FileSystemFileHandle, FileSystemDirectoryHandle, FileSystemHandle } from './types'
import { Dexie } from 'dexie'

const db = new Dexie('FSA')
// Declare tables, IDs and indexes
db.version(1).stores({
  handles: '++id, name, kind'
})

const typePolicies: InMemoryCacheConfig['typePolicies'] = {
  File: {
    fields: {
      read(root: FileSystemFileHandle) {
        return root.getFile()
      }
    }
  },
  Directory: {
    fields: {
      async read(root: FileSystemDirectoryHandle) {
        const entries: FileSystemHandle[] = []
        for await (const entry of root.values()) {
          entries.push(entry)
        }
        return entries
      }
    }
  },
  Query: {
    fields: {
      file: {
        async read(root, { variables }) {
          return await db['handles'].where(variables.name)
        }
      },
      directory: {
        read(root, { variables }) {}
      }
    }
  },
  Mutation: {
    fields: {
      createFile: {
        read(root, { variables }) {}
      },
      createDirectory: {
        read(root, { variables }) {}
      },
      permitDirectory: {
        async read(root, { variables }) {
          const entries = await getDirectoryHandle()
          entries.forEach((entry) => db['handles'].add(entry))
        }
      }
    }
  }
}

const resolvers = {
  File: {},
  Directory: {},
  Query: {},
  Mutation: {}
}

export { typePolicies, resolvers }
