interface EmptyStateProps {
  message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="min-h-[300px] flex flex-col items-center justify-center text-center px-6 py-10">
      <div className="text-2xl font-bold text-purple-600 mb-4">Oops!</div>
      <div className="text-gray-600 text-lg">{message}</div>
    </div>
  );
}
