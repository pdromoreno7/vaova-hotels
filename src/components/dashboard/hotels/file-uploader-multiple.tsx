'use client';
import { Icon } from '@iconify/react';
import { Upload } from 'lucide-react';
import Image from 'next/image';
import { Fragment, useState } from 'react';
import { useDropzone } from 'react-dropzone';

import { Button } from '@heroui/react';

interface FileWithPreview extends File {
  preview: string;
}

const FileUploaderMultiple = () => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  const renderFilePreview = (file: FileWithPreview) => {
    if (file.type.startsWith('image')) {
      return (
        <div className="h-24 w-24 overflow-hidden rounded border">
          <Image width={96} height={96} alt={file.name} src={file.preview} className="h-full w-full object-cover" />
        </div>
      );
    } else {
      return <Icon icon="tabler:file-description" className="h-24 w-24" />;
    }
  };

  const handleRemoveFile = (file: FileWithPreview) => {
    const uploadedFiles = files;
    const filtered = uploadedFiles.filter((i) => i.name !== file.name);
    setFiles([...filtered]);
  };

  const fileList = files.map((file) => (
    <div key={file.name} className="relative flex flex-col rounded-md border p-2">
      <div className="file-preview mb-2 flex justify-center">{renderFilePreview(file)}</div>
      <div className="overflow-hidden text-ellipsis whitespace-nowrap">
        <div className="text-xs text-card-foreground">{file.name}</div>
        <div className="text-xs font-light text-muted-foreground">
          {Math.round(file.size / 100) / 10 > 1000 ? (
            <>{(Math.round(file.size / 100) / 10000).toFixed(1)}</>
          ) : (
            <>{(Math.round(file.size / 100) / 10).toFixed(1)}</>
          )}
          {' kb'}
        </div>
      </div>

      <Button
        isIconOnly
        color="danger"
        className="absolute right-1 top-1 h-6 w-6 rounded-full border-none p-0"
        onPress={() => handleRemoveFile(file)}
      >
        <Icon icon="tabler:x" className="h-4 w-4" />
      </Button>
    </div>
  ));

  const handleRemoveAllFiles = () => {
    setFiles([]);
  };

  return (
    <Fragment>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-1/3">
          <div {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            <div className="flex w-full flex-col items-center rounded-md border border-dashed py-4 px-2 text-center">
              <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                <Upload className="h-5 w-5 text-default-500" />
              </div>
              <h4 className="mb-1 text-sm font-medium text-card-foreground/80">
                Arrastra y suelta o haz clic para subir.
              </h4>
              <div className="text-xs text-muted-foreground">(Los archivos seleccionados no se suben realmente.)</div>
            </div>
          </div>
        </div>

        <div className="md:w-2/3">
          {files.length ? (
            <Fragment>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">{fileList}</div>
              <div className="flex justify-end gap-2 mt-4">
                <Button color="danger" onPress={handleRemoveAllFiles} size="sm">
                  Remover todas las imágenes
                </Button>
                {/* <Button size="sm">Upload Files</Button> */}
              </div>
            </Fragment>
          ) : (
            <div className="flex items-center justify-center h-full border border-dashed rounded-md p-4">
              <p className="text-sm text-muted-foreground">No files selected</p>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default FileUploaderMultiple;
