import * as React from 'react'
import clsx from 'clsx'
import { FileWithPath, useDropzone } from 'react-dropzone'

interface DropzoneProps {
  className?: string
  name: string
}

export function Dropzone({ className, name }: DropzoneProps) {
  const onDrop = React.useCallback(acceptedFiles => {
    acceptedFiles.forEach((file: FileWithPath) => {
      const reader = new FileReader()

      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
        // Do whatever you want with the file contents
        const binaryStr = reader.result
        console.log(binaryStr)
      }
      reader.readAsArrayBuffer(file)
    })
  }, [])

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({ onDrop })

  const files = acceptedFiles.map((file: FileWithPath) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ))

  return (
    <section className={clsx('', className)}>
      <div
        {...getRootProps({
          className:
            'flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md',
        })}
      >
        <input name={name} {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <aside>
        <h4>Files</h4>
        <ul>{files}</ul>
      </aside>
    </section>
  )
}
