import React, { ReactNode } from 'react';
import { Spinner } from '@heroui/react';

interface AsyncStateRendererProps<T> {
  isLoading: boolean;
  isError: boolean;
  data: T | null | undefined;
  renderLoading?: () => ReactNode;
  renderError?: (error?: unknown) => ReactNode;
  renderEmpty?: () => ReactNode;
  children: (data: T) => ReactNode;

  isEmpty?: (data: T | null | undefined) => boolean;
  errorMessage?: string;
}

export function AsyncStateRenderer<T>({
  isLoading,
  isError,
  data,
  children,
  renderLoading,
  renderError,
  renderEmpty,
  isEmpty = (data) => !data || (Array.isArray(data) && data.length === 0),
  errorMessage = 'No se pudo cargar la información. Por favor, intenta más tarde.',
}: AsyncStateRendererProps<T>) {
  if (isLoading) {
    return renderLoading ? (
      renderLoading()
    ) : (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return renderError ? (
      renderError()
    ) : (
      <div className="bg-red-50 text-red-600 p-4 rounded-md">
        <p>{errorMessage}</p>
      </div>
    );
  }

  if (isEmpty(data)) {
    return renderEmpty ? (
      renderEmpty()
    ) : (
      <div className="bg-gray-50 text-gray-600 p-4 rounded-md">
        <p>No hay información disponible.</p>
      </div>
    );
  }

  return <>{children(data as T)}</>;
}
