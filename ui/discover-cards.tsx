'use client';

import { useState, useEffect } from 'react';
import ImageCard from '@/ui/image-card';
import { fetchDiscoverCardsData, fetchDiscoverCardsMoreData } from '@/app/lib/discover_actions';
import { useDebouncedCallback } from 'use-debounce';
import { Spinner } from '@/components/ui/spinner';


export default function DiscoverCards() {

    const [cardData, setCardData] = useState<({ title: any; image: any; subtitle: any; desc: any; } | null)[]>([]);
    const [loading, setLoading] = useState(false);
    const [initialLoadDone, setInitialLoadDone] = useState(false);

    useEffect(() => {
        async function fetchCards() {
            try {
                setLoading(true);
                const data: ({ title: any; image: any; subtitle: any; desc: any; } | null)[] = await fetchDiscoverCardsData();
                setCardData(data);
            } catch(error) {
                console.error("Failed to fetch cards", error);
            } finally {
                setInitialLoadDone(true);
                setLoading(false);
            }
        }
        fetchCards();
    }, [])

    const handleScroll = useDebouncedCallback(
        async () => {
            if (loading || !initialLoadDone) return;
            const scrollTop = window.scrollY;
            const windowHeight = window.innerHeight;
            const fullHeight = document.documentElement.scrollHeight;
            if (scrollTop + windowHeight >= fullHeight - 100) {
                try {
                    console.log('Scroll to bottom');
                    setLoading(true);
                    const newCards = await fetchDiscoverCardsMoreData(); 
                    setCardData(prev => [...prev, ...newCards.filter(Boolean)]);
                } catch(error) {
                    console.error("Failed to fetch cards", error);
                } finally {
                    setLoading(false);
                }
            }
        },
        1000
    );

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {cardData.map((item) => (
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
            {loading && <Spinner size="large" />}
        </>
        
    );
}