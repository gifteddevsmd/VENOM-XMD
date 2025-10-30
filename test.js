const ffmpeg = require('fluent-ffmpeg');
const webp = require('webp-converter');

ffmpeg.getAvailableFormats((err, formats) => {
  if(err) console.error('FFmpeg error:', err);
  else console.log('FFmpeg works');

  webp.dwebp("test.webp", "test.png", "-o", (status, error) => {
    if(status === '100') console.log('WebP conversion works');
    else console.error('WebP conversion error:', error);
  });
});