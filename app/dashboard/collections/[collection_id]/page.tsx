import { getCollectionFromId, getCollectionContents } from "@/app/lib/collection_actions";
import ImageCardView from "@/ui/image-card-view";

export default async function Page(props: { params: Promise<{ collection_id: string }> }) {
    const params = await props.params;
    const collectionId = params.collection_id;
    const collectionInfo = await getCollectionFromId(collectionId);
    const collectionContents = await getCollectionContents(collectionId);

    return(
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold mb-5">{collectionInfo?.title}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {collectionContents!.map((item) => (
                    <ImageCardView
                        imageUrl={item?.image}
                        title={item?.title}
                        subtitle={item?.subtitle}
                        description={item?.desc}
                        alt={item?.title}
                        key={item?.title}
                    />
                ))}
                {collectionContents?.length === 0 ? <p>This collection is empty</p> : <></>}
            </div>
        </div>
    );
}