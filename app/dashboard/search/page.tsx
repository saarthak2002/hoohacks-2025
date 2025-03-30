import { AnimatedSearch } from '@/ui/search-bar';
import SearchResults from '@/ui/search-results';

export default async function Page(props: {
    searchParams?: Promise<{
        query?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const query = searchParams?.query || '';
    console.log(query);
    return (
        <div className="p-6 space-y-6">
            <AnimatedSearch />
            <SearchResults query={query} />
        </div>
    );
}