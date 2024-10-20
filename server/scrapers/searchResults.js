const axios = require('axios');
const cheerio = require('cheerio');


/**
 * Scrapes songs from Tab4U based on a provided search query.
 * The function constructs a search URL, makes an HTTP request to retrieve the page content,
 * then uses Cheerio to parse and extract song information from the HTML.
 * It captures each song's title, artist name, image URL, and details URL.
 * 
 * @param {string} searchQuery - The user's search input used to query songs.
 * @returns {Array|Object} An array of song objects if songs are found, otherwise returns an object with a message indicating no songs were found.
 * Each song object contains:
 *   - title: The title of the song.
 *   - artist: The artist of the song.
 *   - image: A URL to the song's image.
 *   - url: A URL to detailed song information on Tab4U.
 * If an error occurs during the scraping process, returns an object with an error message.
 */
const scrapeSongs = async (searchQuery) => {
    try {
        const url = `https://www.tab4u.com/resultsSimple?tab=songs&q=${encodeURIComponent(searchQuery)}`;
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        let songs = [];

        $('table.tbl_type5 tbody tr').each((i, row) => {
            const songRow = $(row).find('.ruSongLink');
            if (songRow.length) {
                const href = songRow.attr('href');
                const fullUrl = `https://www.tab4u.com/${href}`;
                const songTitle = songRow.find('.sNameI19').text().trim();
                const artistName = songRow.find('.aNameI19').text().trim();
                let imageUrl = songRow.find('.ruArtPhoto').css('background-image');
                
                if (imageUrl) {
                    imageUrl = imageUrl.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
                
                    if (!imageUrl.startsWith('http')) {
                        imageUrl = `https://www.tab4u.com${imageUrl}`;
                    }
                }
                
                if (songTitle && artistName) {
                    songs.push({
                        title: songTitle,
                        artist: artistName,
                        image: imageUrl,
                        url: fullUrl
                    });
                }
            }
        });

        return songs.length > 0 ? songs : { message: 'No songs found' };
    } catch (error) {
        console.error('Error while scraping songs:', error);
        return { error: 'Error while scraping songs' };
    }
};

module.exports = scrapeSongs;
