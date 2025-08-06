interface InvalidDataFallbackProps {
    fallbackTitle: string;
    fallbackMessage: string;
}

export function InvalidDataFallback({
    fallbackTitle,
    fallbackMessage
}: InvalidDataFallbackProps) {
    return (
        <div className="text-center py-8">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg
                    className="w-8 h-8 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {fallbackTitle}
            </h3>
            <p className="text-gray-600">
                {fallbackMessage}
            </p>
        </div>
    )
}