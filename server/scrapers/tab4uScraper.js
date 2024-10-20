const axios = require('axios');
const cheerio = require('cheerio');


/**
 * Scrapes song data including lyrics and chords from a specified URL.
 * The function makes an HTTP request to retrieve the HTML content of the song page,
 * parses it using Cheerio to extract lyrics and chords, and formats them into a structured array.
 *
 * @param {string} url - The URL of the song page to scrape.
 * @returns {Array|Object} An array of song data objects where each object represents a verse or a line with corresponding chords and lyrics,
 *                          or an object with a message if no lyrics or chords are found, or an error message if an exception occurs.
 *
 * Each song data object includes:
 * - chords: A string representing the chords aligned with the lyrics based on their position in the HTML content.
 * - lyrics: A string of the lyrics corresponding to the chords.
 *
 * The function navigates through each table row assumed to contain chords data and finds the next row as lyrics.
 * It calculates spaces to align chords with lyrics based on their HTML structure and spacing.
 */
const scrapeSongData = async (url) => {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        let songData = [];
        let currentVerse = [];

        $('table tbody tr').each((i, row) => {
            const chordsHtml = $(row).find('td.chords_en, td.chords').html() || '';

            let chordsLine = '';
            let lastIndex = 0;

            $(row).find('td.chords_en span, td.chords span').each((i, el) => {
                const chordText = $(el).text().trim();
                const chordHtml = $.html(el);

                const index = chordsHtml.indexOf(chordHtml, lastIndex);
                const spacesBefore = chordsHtml.substring(lastIndex, index).replace(/&nbsp;/g, ' ').length;

                chordsLine += ' '.repeat(spacesBefore) + chordText;
                lastIndex = index + chordHtml.length;
            });

            const remainingSpaces = chordsHtml.substring(lastIndex).replace(/&nbsp;/g, ' ').length;
            chordsLine += ' '.repeat(remainingSpaces);

            const nextRow = $(row).next();
            if (nextRow.length) {
                const lyricsLine = nextRow.find('td.song').html()?.replace(/&nbsp;/g, ' ').trim() || '';
    
                if (chordsLine || lyricsLine) {
                    const lineObj = {
                        chords: chordsLine,  
                        lyrics: lyricsLine
                    };
                    currentVerse.push(lineObj);
                }
            }
            
            if (currentVerse.length > 0) {
                songData.push(currentVerse);
                currentVerse = [];
            }
        });

        return songData.length > 0 ? songData : { message: 'No lyrics or chords found' };
    } catch (error) {
        console.error(`Error scraping the song page: ${error}`);
        return { error: 'Error scraping the song page' };
    }
};

module.exports = scrapeSongData;

