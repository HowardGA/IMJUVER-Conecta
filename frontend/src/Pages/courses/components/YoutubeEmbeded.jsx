import YouTube from 'react-youtube';

const YoutubeEmbeded = ({ embedId }) => {
    const opts = {
        height: '520',
        width: '920',
    };

    const onReady = (event) => {
        const player = event.target;
        player.pause()
    };

    return( 
            <YouTube videoId={embedId} opts={opts} onReady={onReady} />
    );
}

export default YoutubeEmbeded;