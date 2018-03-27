const videoA = {
  id: '1',
  title: 'Youtube',
  duration: 180,
  watched: true,
};

const videoB = {
  id: '1',
  title: 'Vimeo',
  duration: 180,
  watched: true,
};

const videos = [ videoA, videoB ];

const getVideoById = (id) => new Promise(resolve => {
  const [video] = videos.filter((video) => video.id === id);
  resolve(video);
});

const getVideos = () => new Promise(resolve => resolve(videos));

const createVideo = ({ title, duration , watched}) => {
  const video = {
    id: (new Buffer(title, 'utf8').toString('base64')),
    title,
    duration,
    watched
  };
  videos.push(video);

  return video;
};

module.exports = {
  getVideoById,
  getVideos,
  createVideo
}