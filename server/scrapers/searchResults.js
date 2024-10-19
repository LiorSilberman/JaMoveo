const axios = require('axios');
const cheerio = require('cheerio');

// Function to scrape songs from the search results page
const scrapeSongs = async (searchQuery) => {
    try {
        const url = `https://www.tab4u.com/resultsSimple?tab=songs&q=${encodeURIComponent(searchQuery)}`;
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        let songs = [];

        // Scrape each song entry from the table
        $('table.tbl_type5 tbody tr').each((i, row) => {
            const songRow = $(row).find('.ruSongLink');
            if (songRow.length) {
                const href = songRow.attr('href');
                const fullUrl = `https://www.tab4u.com/${href}`;
                const songTitle = songRow.find('.sNameI19').text().trim();
                const artistName = songRow.find('.aNameI19').text().trim();
                let imageUrl = songRow.find('.ruArtPhoto').css('background-image');
                
                // If an image URL is found in the background-image, extract and clean it
                if (imageUrl) {
                    imageUrl = imageUrl.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
                    // Handle cases where the image URL is relative, prepend the base URL if needed
                    if (!imageUrl.startsWith('http')) {
                        imageUrl = `https://www.tab4u.com${imageUrl}`;
                    }
                } else {
                    imageUrl = 'default-image.jpg';  // Fallback to a default image if none found
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
