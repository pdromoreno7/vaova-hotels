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

/**
 * A component that renders different UI states based on asynchronous data fetching.
 *
 * This component handles loading, error, and empty states, and renders the provided
 * children function with the data once it is successfully fetched and available.
 *
 * Props:
 * - `isLoading`: A boolean indicating if the data is currently being loaded.
 * - `isError`: A boolean indicating if there was an error fetching the data.
 * - `data`: The data to be rendered or used to determine empty state.
 * - `children`: A render prop function that receives the data and returns a ReactNode.
 * - `renderLoading`: An optional function that returns a ReactNode to be displayed when loading.
 * - `renderError`: An optional function that returns a ReactNode to be displayed when there is an error.
 * - `renderEmpty`: An optional function that returns a ReactNode to be displayed when the data is empty.
 * - `isEmpty`: An optional function that determines if the data is considered empty.
 * - `errorMessage`: A string to display when there is an error and no custom renderError is provided.
 *
 * The component will render the appropriate state based on the boolean flags and data:
 * - If `isLoading` is true, it renders the loading state.
 * - If `isError` is true, it renders the error state.
 * - If `isEmpty(data)` is true, it renders the empty state.
 * - Otherwise, it renders the `children` function with the data.
 *
 * @param {AsyncStateRendererProps<T>} props - The props for the AsyncStateRenderer component.
 */
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
