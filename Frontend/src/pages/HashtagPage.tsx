export function HashtagPage() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Hashtag thịnh hành</h2>
      <p className="text-gray-600">Mục này đã sẵn sàng để tích hợp API hashtag.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {['#react', '#dotnet', '#tailwind', '#signalr', '#typescript'].map((tag) => (
          <span key={tag} className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
