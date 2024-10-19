const axios = require('axios');
const cheerio = require('cheerio');

// Function to scrape the song data (lyrics and chords) and count spaces
const scrapeSongData = async (url) => {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        let songData = [];
        let currentVerse = [];

        // Iterate over each row in the table (lyrics and chords)
        $('table tbody tr').each((i, row) => {
            const chordsHtml = $(row).find('td.chords_en, td.chords').html() || '';

            // Split around the <span> tags to extract the content before and after each chord
            let chordsLine = '';
            let lastIndex = 0;

            // Go through each chord <span> element
            $(row).find('td.chords_en span, td.chords span').each((i, el) => {
                const chordText = $(el).text().trim();  // Extract chord name
                const chordHtml = $.html(el);  // Full HTML of the chord

                // Find where the <span> starts and count spaces before it
                const index = chordsHtml.indexOf(chordHtml, lastIndex);
                const spacesBefore = chordsHtml.substring(lastIndex, index).replace(/&nbsp;/g, ' ').length;

                // Add the correct number of spaces before the chord
                chordsLine += ' '.repeat(spacesBefore) + chordText;

                // Update lastIndex to the end of this <span>
                lastIndex = index + chordHtml.length;
            });

            // Add remaining spaces after the last chord
            const remainingSpaces = chordsHtml.substring(lastIndex).replace(/&nbsp;/g, ' ').length;
            chordsLine += ' '.repeat(remainingSpaces);

            // Get lyrics with preserved spaces
            const nextRow = $(row).next();
            if (nextRow.length) {
                const lyricsLine = nextRow.find('td.song').html()?.replace(/&nbsp;/g, ' ').trim() || '';
                // If there is either chords or lyrics, add them to the current verse
                if (chordsLine || lyricsLine) {
                    const lineObj = {
                        chords: chordsLine,  // Chords line with correct spacing
                        lyrics: lyricsLine   // Lyrics line with original spacing
                    };
                    currentVerse.push(lineObj);
                }
            }
            

            // If a verse (group of lines) is complete, add it to songData
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

