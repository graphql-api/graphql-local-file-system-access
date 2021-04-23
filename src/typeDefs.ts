import { gql } from '@apollo/client'

export const typeDefs = gql`
  interface Entry {
    name: String!
  }

  scalar FileContent

  type File implements Entry {
    name: String!
    content: FileContent
  }

  type Directory implements Entry {
    name: String!
    content: DirectoryContent
  }

  type DirectoryContent {
    edges: [EntryEdge]
  }

  type EntryEdge {
    node: Entry
  }

  type Query {
    file(name: String): File
    directory(name: String): Directory
    directories: [Directory]
  }

  type Mutation {
    # createFile(path: String): File
    # updateFile(path: String, content: FileContent): File
    # deleteFile(path: String): File
    # createDirectory(directory: String): Directory
    # deleteDirectory(directory: String): Directory
    pick: String
  }
`
