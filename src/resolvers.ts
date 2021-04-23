import { InMemoryCacheConfig, Resolvers } from '@apollo/client'
import { getDirectoryHandle, getDirectoryEntries, resolveTree } from './fs-helper'
import { FileSystemFileHandle, FileSystemDirectoryHandle, FileSystemHandle } from './types'
import { Dexie, Table } from 'dexie'

const db = new Dexie('FileSystemAccess')
db.version(1).stores({
  entries: 'name, kind'
})

const table: Table = db['entries']
// window?.['FileSystemDirectoryHandle'] && table?.mapToClass(window['FileSystemDirectoryHandle'])

const typePolicies: InMemoryCacheConfig['typePolicies'] = {
  File: {
    fields: {
      content: {
        read(root: FileSystemFileHandle) {
          return root.getFile()
        }
      }
    }
  },
  Directory: {
    fields: {
      content: {
        async read(root: FileSystemDirectoryHandle) {
          const entries: FileSystemHandle[] = []
          for await (const entry of root.values()) {
            entries.push(entry)
          }
          return entries
        }
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
        read(root, { variables }) {
          console.log('DIR', root)
          return {
            __typename: 'Directory',
            name: 'TEST'
          }
        }
      }
    }
  }
}

const resolvers: Resolvers = {
  Entry: {
    __resolveType(obj) {
      switch (obj?.kind) {
        case 'directory':
          return 'Directory'
        case 'file':
          return 'File'
        default:
          return null
      }
    }
  },
  Query: {
    async directories() {
      const entries = await table.toArray()
      const trees = await Promise.all(
        entries.map(async (entry) => {
          const permission = await entry.handler.queryPermission()
          if (permission === 'denied') await entry.handler.requestPermission({ mode: 'read' })
          const tree = await resolveTree(entry.handler)
          return tree
        })
      )
      return trees
    }
  },
  Mutation: {
    async pick(...args) {
      const dirHandle = await getDirectoryHandle()
      const hasEntry = await table?.get(dirHandle.name)
      if (!!hasEntry) {
        const isEntry = await hasEntry?.handler?.isSameEntry(dirHandle)
        if (isEntry)
          return {
            __typename: dirHandle.kind,
            name: dirHandle.name,
            content: await resolveTree(dirHandle)
          }
      }

      const entries = (await table.toArray()).map(({ handler }) => handler)
      const isChild = await getParents(dirHandle, entries)
      if (isChild.length > 0) {
        return {
          __typename: dirHandle.kind,
          name: dirHandle.name,
          content: await resolveTree(dirHandle)
        }
      }

      const isParent = await getChildren(dirHandle, entries)
      if (isParent.length > 0) {
        console.log('is parent', dirHandle, isParent)
        const children = await table.where('name').anyOf(isParent.map(({ name }) => name))

        console.log('CHILDREN', children)
        // children

        // children.delete()
      }
      // await set(dirHandle.name, dirHandle)
      table.add({
        name: dirHandle.name,
        kind: dirHandle.kind,
        handler: dirHandle,
        children: isChild.length > 0 ? isChild : null,
        parents: isParent.length > 0 ? isParent : null
      })
      // const handle = await table.where('name').equals(dirHandle.name).toArray()
      // const handler = handle[0].handler

      // const children = await getDirectoryEntries(handler)
      // // const t = await get(dirHandle.name)
      // console.log(await resolveTree(dirHandle))
    }
  }
}

const getParents = async (entryHandle: FileSystemHandle, handlers: FileSystemHandle[]) => {
  const parents: { name: string; path: string[]; handler: FileSystemDirectoryHandle }[] = []

  for (const handler of handlers) {
    if (handler && handler.kind === 'directory') {
      const path = await handler.resolve(entryHandle)
      if (!!path) {
        parents.push({ name: handler.name, path, handler })
      }
    }
  }

  return parents
}

const getChildren = async (
  entryHandle: FileSystemDirectoryHandle,
  handlers: FileSystemHandle[]
) => {
  const children = []
  for (const handler of handlers) {
    const path = await entryHandle.resolve(handler)
    if (!!path) {
      children.push({ path, handler })
    }
  }
  return children
}

export { typePolicies, resolvers }
