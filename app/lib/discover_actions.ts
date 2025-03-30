'use server';

import { getUserInterests } from "./interest_actions";

function getPageInfoPromise(pageTitle: string) {
    const responsePromise = fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${pageTitle}`)
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            return {
                title: data.title ?? '',
                image: data.originalimage?.source ?? '/placeholder.png',
                subtitle: data.description ?? '',
                desc: data.extract ?? ''
            }
        })
        .catch((error) => {
            console.error('there was an error: ', error)
            return null;
        })
    return responsePromise;
}

async function fetchCardsData(pageTitleList: string[]) {
    try {
        const pageInfoPromises = pageTitleList.map(title => getPageInfoPromise(title));
        const pageInfoResults = await Promise.all(pageInfoPromises);
        for (let i = 0; i < pageInfoResults.length; i++) {
            try {
                if (pageInfoResults[i]?.image === '/placeholder.png') {
                    const encoded_title = pageInfoResults[i]?.title.split(' ').join('_')
                    console.log('HAS PH!!', encoded_title);
                    const imagesResponse = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${encoded_title}&format=json&prop=images&origin=*`);
                    const imagesData = await imagesResponse.json();
                    const page = Object.values(imagesData.query.pages)[0] as any;
                    const imageList = page.images ?? [];
                    if (imageList.length > 0) {
                        const fileTitle = imageList[0].title.split(' ').join('_');
                        const imgUrlResponse = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${fileTitle}&prop=imageinfo&iiprop=url&format=json&origin=*`);
                        const imgUrlData = await imgUrlResponse.json();
                        const imgPages = imgUrlData.query.pages;
                        const imgPage = (<any>Object).values(imgPages)[0];
                        const imageUrl = imgPage.imageinfo?.[0]?.url ?? '/placeholder.png';
                        pageInfoResults[i]!.image = imageUrl;
                    }
                }
            } catch (error) {
                console.log('Error fecthing fall back images: ', error);
                continue;
            }
        } 
        return pageInfoResults;
    } catch (error) {
        throw error;
    }
}

export async function fetchRandomWikipediaTitles(count: number): Promise<string[]> {
    const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&format=json&list=random&rnlimit=${count}&rnnamespace=0&origin=*`);
    const data = await response.json();
    return data.query.random.map((item: { title: string }) => item.title.split(' ').join('_'));
}

async function searchWikiAPI(query: string) {
    try {
        const encodedQuery = encodeURIComponent(query);
        const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodedQuery}&srwhat=text&format=json`);
        const responseJson = await response.json();
        const results =  responseJson.query?.search ?? [];
        let titleList: string[] = [];
        if (Array.isArray(results)) {
            results.slice(0, 2).forEach(element => {
                titleList.push(element.title.split(' ').join('_'));
            });
        }
        return titleList;
    } catch(error) {
        console.error('There was an error communicating with the Wiki API.')
        throw error;
    }
}

export async function fetchDiscoverCardsData() {
    // user has added enough interests - IF
    const defaultPages = [
        'Albert_Einstein',
        'Mount_Everest',
        'World_War_II',
        'Milky_Way',
        'Dinosaur',
        'Blue whale',
        'Internet',
        'Titanic',
        'Blues',
        'Transistor',
    ];
    const userInterests: string[] = await getUserInterests();
    let searchResults: string[] = [];

    if (userInterests && userInterests.length > 2) {
        const allResults = await Promise.all(
          userInterests.map((interest) => searchWikiAPI(interest))
        );
    
        searchResults = allResults.flat().filter(Boolean);
    
        const needed = 10 - searchResults.length;
        if (needed > 0) {
          const remaining = defaultPages.filter(
            (title) => !searchResults.includes(title)
          );
          while (searchResults.length < 10 && remaining.length > 0) {
            const randomIndex = Math.floor(Math.random() * remaining.length);
            searchResults.push(remaining.splice(randomIndex, 1)[0]);
          }
        }
    
        return fetchCardsData(searchResults);
      }

    // user has not added enough interests - else
    return fetchCardsData(defaultPages);
}

export async function fetchDiscoverCardsMoreData() {
    console.log('RANDOM random cards!');
    const randomTitles = await fetchRandomWikipediaTitles(10);
    const newCardsData = await fetchCardsData(randomTitles)
    console.log(randomTitles);
    return newCardsData;
}