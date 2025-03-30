import FolderCard from "@/ui/folder-card";

export default async function Page() {
    const folders = [
        { title: 'Science', count: 12 },
        { title: 'History', count: 8 },
        { title: 'Space', count: 15 },
    ];
    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold mb-6">Your Collections</h1>
            <p className="text-muted-foreground mb-6">Save your favorite knowledge cards here.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
                {folders.map((folder) => (
                    <FolderCard
                        key={folder.title}
                        title={folder.title}
                        count={folder.count}
                        // onClick={() => alert(`Open folder: ${folder.title}`)}
                    />
                ))}
            </div>
        </div>
    );
  }
  