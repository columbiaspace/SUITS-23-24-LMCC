import rockData from './../assets/json_data/rocks/RockData.json'


//setting html values for the rock
export function populateRockData() {
    const container = document.getElementById('rockContainer');

    // Clear the container before populating
    container.innerHTML = '';

    rockData.ROCKS.forEach(rock => {
        const rockContainer = document.createElement('div');
        rockContainer.className = 'column';

        const h3 = document.createElement('h3');
        h3.innerHTML = `Name:&nbsp;<span id="name" className="specData">${rock.name}, Id: ${rock.id}</span>`;
        rockContainer.appendChild(h3);

        const specDataContainer = document.createElement('div');
        specDataContainer.className = 'specDataContainer';

        Object.entries(rock.data).forEach(([key, value]) => {
            const h5 = document.createElement('h5');
            h5.innerHTML = `${key}:&nbsp;<span id="${key.toLowerCase()}" className="specData">${value}</span>`;
            specDataContainer.appendChild(h5);
        });
        rockContainer.appendChild(document.createElement('br'));

        rockContainer.appendChild(specDataContainer);
        rockContainer.appendChild(document.createElement('br'));
        container.appendChild(rockContainer);
        
    });
}


//const fs = require('fs'); // import 'fs' module ot work with file system

// converts image to Base64
//function imageToBase64(imagePath) {
 //   const imageBuffer = fs.readFileSync(imagePath); // read image file
 //   const base64Image = imageBuffer.toString('base64'); // convert image file to Base64
//    return base64Image;
//}

export const RockData = [

    {
        id: "rock1",
        name: "Rock 1",
        location: "1°N 1°W",
        color: "red",
   //     photo: imageToBase64("https://static.wikia.nocookie.net/minecraft_gamepedia/images/e/e1/Redstone_Dust_JE2_BE2.png/revision/latest?cb=20210427032319")

    },

    {
        id: "rock2",
        name: "Rock 2",
        location: "2°N 2°W",
        color: "orange",
     //   photo: imageToBase64("")
    },

    {
        id: "rock3",
        name: "Rock 3",
        location: "3°N 3°W",
        color: "yellow",
     //   photo: imageToBase64("")
    },
];