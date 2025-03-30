import {fetchSearchCardsData} from '@/app/lib/search_actions';
import ImageCard from '@/ui/image-card';

export default async function SearchResults({ query }: { query: string }) {
    const searchResults = await fetchSearchCardsData(query);
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {searchResults.map((item) => (
                <ImageCard
                    imageUrl={item?.image}
                    title={item?.title}
                    subtitle={item?.subtitle}
                    description={item?.desc}
                    alt={item?.title}
                    key={item?.title}
                />
            ))}
      </div>
    );
}