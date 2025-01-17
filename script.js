console.log("let's write js");
let leftside = document.querySelector(".left");
let menu = document.querySelector(".firstMenu");
let currentsong = new Audio();
let songs = [];

function formatTime(seconds) {
    // Calculate minutes and seconds
    let mins = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);

    // Add leading zero if needed
    if (mins < 10) mins = `0${mins}`;
    if (secs < 10) secs = `0${secs}`;

    // Return the formatted time
    return `${mins}:${secs}`;
}



async function getsong() {
    let a = await fetch("http://127.0.0.1:3002/songs/");
    let responce = await a.text()
    // console.log(responce);

    let div = document.createElement("div");
    div.innerHTML = responce
    let anchor = div.getElementsByTagName("a");
    // console.log(anchor);

    for (let i = 0; i < anchor.length; i++) {
        const element = anchor[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1]);
        }

    }
    return songs;
    // console.log(songs);
}
const playmusic = (track) => {
    if (currentsong.src !== `/songs/${track}`) {
        currentsong.src = `/songs/${track}`; // Set new track
        play.innerHTML = `<i class='fa-solid fa-circle-pause'></i>`;

    }
    document.querySelector(".song-info").innerHTML = track;
    document.querySelector(".song-time").innerHTML = "00.00/00.00";
    currentsong.play();
}

async function main() {


    songs = await getsong();
    // console.log(songs);
    if (songs.length > 0) {
        currentsong.src = `/songs/${songs[0]}`;

    }
    let playaudio = document.getElementById("play");

    playaudio.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.innerHTML = `<i class='fa-solid fa-circle-pause'></i>`;
        }
        else {
            currentsong.pause()
            play.innerHTML = `<i class='fa-solid fa-circle-play'></i>`;
        }

    });

    let songul = document.querySelector(".songList").getElementsByTagName("ul")[0];
for (const song of songs) {
    if (song.length > 18) {
        songul.innerHTML = songul.innerHTML +
            `<li>
                <img src="SvgImages/song_logo.svg" alt="" class="invert">
                <marquee behavior="" width="130px" scrollamount="3" direction="Left to right">
                    <div class="songs-info">
                        <div class="song-name">${song}</div>
                        <div>Govind</div>
                    </div>
                </marquee>
                <div class="play_now">
                    <span>Play Now</span>
                    <span class="librabry-inner-play"><i class='fa-solid fa-circle-play'></i></span>
                </div>
            </li>`;
    } else {

        songul.innerHTML = songul.innerHTML +
            `<li>
                <img src="SvgImages/song_logo.svg" alt="" class="invert">
                <div class="songs-info">
                    <div class="song-name">${song}</div>
                    <div class="song-artist">Govind</div>
                </div>
                <div class="play_now">
                    <span>Play Now</span>
                    <span class="librabry-inner-play"><i class='fa-solid fa-circle-play'></i></span>
                </div>
            </li>`;
    }
}


    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            console.log(e.querySelector(".songs-info").firstElementChild.innerHTML);
            playmusic(e.querySelector(".songs-info").firstElementChild.innerHTML.trim());


        });

    });

    let play = document.getElementById("play");
    let previous=document.getElementById("previous");
    let next=document.getElementById("next");
    

    previous.addEventListener("click",(event)=>{
        event.preventDefault();
        console.log("previous btn");
        let index=songs.indexOf(currentsong.src.split("/").splice(-1)[0]);
        if ((index-1)>=0) {
            playmusic(songs[index-1])
        }
        console.log(index);
        
        
        
    })
    next.addEventListener("click",(event)=>{
        event.preventDefault();
        console.log("next btn");
        let index=songs.indexOf(currentsong.src.split("/").splice(-1)[0]);
        if ((index+1)< songs.length) {
            playmusic(songs[index+1])
        }
        console.log(index);
        
    })
    
    play.addEventListener("click", (event) => {
        event.preventDefault();
        console.log("play");
        
        if (currentsong.src === "") {
            console.error("No song loaded.");

            return;
        }

        let track = currentsong.src.split("/songs/")[1];
        document.querySelector(".song-info").innerHTML = track;
        document.querySelector(".song-time").innerHTML = "00.00/00.00";


    });

    currentsong.addEventListener("timeupdate", () => {
        if (!isNaN(currentsong.duration)) {
            document.querySelector(".song-time").innerHTML = `${formatTime(currentsong.currentTime)}:${formatTime(currentsong.duration)}`;
            document.querySelector(".circle").style.left = ((currentsong.currentTime) / (currentsong.duration)) * 99 + "%";
        }
    });

    document.querySelector(".seekbar").addEventListener("click", e => {
        if (!isNaN(currentsong.duration)) {
            let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
            document.querySelector(".circle").style.left = percent + "%";
            currentsong.currentTime = ((currentsong.duration) * percent) / 100;
        } else {
            console.error("Audio duration is not available yet.");
        }
    });

let volume=document.querySelector(".vol-seekbar");
volume.addEventListener("change",(e)=>{
    console.log("Volume is : "+e.target.value);
    currentsong.volume=parseInt(e.target.value)/100;
    
})

}
function mymenu() {
    let close = document.querySelector(".closing-btn");
    menu.addEventListener("click", () => {
        menu.style.transform="rotate(90deg)"
        menu.style.transition="all 0.5s ease"
        close.style.transform="rotate(0deg)"
        leftside.style.left = 0 + "%";
    })
}

function mycloseMenu() {
    let close = document.querySelector(".closing-btn");
    close.addEventListener("click",()=>{
        menu.style.transform="rotate(0deg)"
        close.style.transform="rotate(-90deg)"
        close.style.transition="all 0.5s ease"
        leftside.style.left = -100 + "%";
    })
}
mycloseMenu()
mymenu()
main()


