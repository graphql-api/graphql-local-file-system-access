import { gql } from '@apollo/client'

export const typeDefs = gql`
  interface Entry {
    name: String!
  }

  scalar FileContentt

  type File implements Entry {
    name: String!
    content: FileContent
  }

  type Directory implements Entry {
    name: String!
  }

  type DirectoryContent {
    edges: EntryEdge
  }

  type EntryEdge {
    node: Entry
  }

  type Query {
    file(name: String): File
    directory(name: String): Directory
  }

  type Mutation {
    createFile(directory: String): File
    createDirectory(directory: String): Directory
    permitDirectory: Directory
  }
`
