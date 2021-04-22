export type FileSystemHandle = FileSystemDirectoryHandle | FileSystemFileHandle

/**
 * https://wicg.github.io/file-system-access/#api-filesystemhandle
 */

interface __FileSystemHandle {
  isSameEntry()
  queryPermission(arg?: { mode: 'read' | 'readwrite' }): 'granted' | 'prompt'
  requestPermission()
}

export interface FileSystemDirectoryHandle extends __FileSystemHandle {
  name: string
  kind: 'directory'
  keys()
  resolve()
  values(): Iterable<FileSystemHandle>
  removeEntry()
  getFileHandle()
  getDirectoryHandle()
  entries()
}

export interface FileSystemFileHandle extends __FileSystemHandle {
  name: string
  kind: 'file'
  getFile(): File
  createWritable()
}

export interface FileSystemWritableFileStream {
  write()
  seek()
  truncate()
}

declare global {
  interface Window {
    showOpenFilePicker()
    showSaveFilePicker()
    showDirectoryPicker()
  }
}

interface FilePickerOptions {}
