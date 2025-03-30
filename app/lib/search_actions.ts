'use server';

async function searchWikiAPI(query: string) {
    try {
        const encodedQuery = encodeURIComponent(query);
        const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodedQuery}&srwhat=text&format=json`);
        const responseJson = await response.json();
        const results =  responseJson.query?.search ?? [];
        let titleList: string[] = [];
        if (Array.isArray(results)) {
            results.forEach(element => {
                titleList.push(element.title.split(' ').join('_'));
            });
        }
        return titleList;
    } catch(error) {
        console.error('There was an error communicating with the Wiki API.')
        throw error;
    }
}

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

export async function fetchSearchCardsData(query: string) {
    try {
        const wikiResults = await searchWikiAPI(query);
        const pageInfoPromises = wikiResults.map(title => getPageInfoPromise(title));
        const pageInfoResults = await Promise.all(pageInfoPromises);
        console.log(pageInfoResults);
        // Fall back image //
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
                        console.log(imageUrl);
                        pageInfoResults[i]!.image = imageUrl;
                    }
                }
            } catch (error) {
                console.log('Error fecthing fall back images: ', error);
                continue;
            }
        }
        // Fall back image //
        return pageInfoResults;
    } catch (error) {
        throw error;
    }
}