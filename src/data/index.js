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

exports.getVideoById = getVideoById;