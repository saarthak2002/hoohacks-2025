import FolderCard from "@/ui/folder-card";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { createCollection, getCollections } from "@/app/lib/collection_actions";

export default async function Page() {
    // const folders = [
    //     { title: 'Science', count: 12 },
    //     { title: 'History', count: 8 },
    //     { title: 'Space', count: 15 },
    // ];

    const userCollections = await getCollections();
    console.log(userCollections)

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold mb-1">Your Collections</h1>
                    <p className="text-muted-foreground">Save your favorite knowledge cards here.</p>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                    <Button variant="default" className="w-full sm:w-auto self-start lg:self-auto">
                        + Create Collection
                    </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Create New Collection</DialogTitle>
                        </DialogHeader>
                        <form action={createCollection}>
                            <div className="py-4">
                                <Input
                                    placeholder="Enter collection name"
                                    name="title"
                                />
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                <Button
                                    type="submit"
                                >
                                    Create
                                </Button>
                                </DialogClose>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
            {userCollections?.length === 0 ? <p className="text-center text-muted-foreground">You have not created any collections yet. Click Create Collection above to get started.</p> : <></>}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
                {userCollections!.map((folder) => (
                    <FolderCard
                        key={folder.title}
                        title={folder.title}
                        count={folder.count}
                        collectionId={folder.id}
                        // onClick={() => alert(`Open folder: ${folder.title}`)}
                    />
                ))}
            </div>
        </div>
    );
  }
  