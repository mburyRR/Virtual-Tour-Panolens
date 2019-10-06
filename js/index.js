// Get html element where panoramas will be inserted
const container = document.querySelector('#container');

// Create Viewer which contains pre-defined scene, camera and renderer
const viewer = new PANOLENS.Viewer({container: container});

const jsonURL = './json/map.json';
const hotspotURL = '/MGR_Panolens/img/box.png';


/**
 * Main function
 */
async function app() {
  const map = await fetchData();
  const panoramas = await createPanoramas(map);
  const panoramasWithHotspots = await createHotspotActions(map, panoramas);
  const scene = await createScene(panoramasWithHotspots);
}

/**
 * Fetch map data from local json file
 */
function fetchData() {
  return fetch(jsonURL).then(res => res.json());
}

/**
 * Create panoramas for all scenes in map json file and push each of them into auxiliary array
 * @param {array} map - [{"id": "p0_0","src":..}
 */
function createPanoramas(map) {
  const panoramas = [];

  map.forEach(scene => {
    const url = scene.src;
    const id = scene.id;

    // Create equirectangular based image panorama
    newPanorama = new PANOLENS.ImagePanorama(url);
    // Push new panorama to array of objects object which include all panoramas
    panoramas.push({image: newPanorama, id: id});
  })

  return panoramas;
}

/**
 * Create hotspot elements and attach them to specific panoramas
 * @param {array} map - [{"id": "p0_0","src":..}
 * @param {array} panoramas - [{image: P…S.ImagePanorama, id: "p0_0"},..]
 */
function createHotspotActions(map, panoramas) {
  map.forEach(scene => {
    const hotspots = scene.spots;

    hotspots.forEach(hotspot => {
      // Get 3D position of simple hotspot in panorama
      const positionX = hotspot.position.x * 100;
      const positionY = hotspot.position.y * 100;
      const positionZ = hotspot.position.z * 100;

      // Create new hotspot attached to panorama
      const newSpot = new PANOLENS.Infospot(500, hotspotURL);
      // Set position of hotspot
      newSpot.position.set(positionX, positionY, positionZ);
      
      // For set hostspot onClick event, the destination scene need to be assigned to it.
      // For this one is obligatory to have the image url of scene ('panoramas' array include that one).
      // There is mapping through 'panoramas' and checking if panorama contains scene id, the same as
      // current hotspot scene id. If yes, the hotspot destination scene is set using image url form 'panoramas'.
      // Additionally, it is necessary to assign camera rotation depending on the view/user scene movement.
      panoramas.forEach(panorama => {
        if(panorama.id === hotspot.id){
          newSpot.addEventListener('click', () => {
            const rotationX = hotspot.rotation.x * 100;
            const rotationY = hotspot.rotation.y * 100;
            const rotationZ = hotspot.rotation.z * 100;

            // Create camera rotation vector for next scene
            const cameraLookAt = new THREE.Vector3(rotationX, rotationY, rotationZ);

            // After focus on a specific vector when enter-fade-start event fires on panorama, it is necessary to 
            // locate the infospot position that is required to see as initial and call it using 'tweenControlCenter'
            panorama.image.addEventListener( 'enter-fade-start', function(){
              viewer.tweenControlCenter( cameraLookAt, 0 );
            } );
            // Set a panorama to be the current one after click on current hotspot
            viewer.setPanorama(panorama.image);
          });
        }
      })

      // Attach current hotspot to correct panorama image as its child
      panoramas.forEach(panorama => {
        if(panorama.id === scene.id){
          panorama.image.add(newSpot);
        }
      })
    })
  })

  return panoramas;
}

/**
 * Create scene and add to it previously created panoramas
 * @param {array} panoramasWithHotspots - [{image: P…S.ImagePanorama, id: "p0_0"},..]
 */
function createScene(panoramasWithHotspots) {
  panoramasWithHotspots.forEach(panorama => {
    // Add an object to the scene Automatically hookup with panolens-viewer-handler listener 
    // to communicate with viewer method
    viewer.add( panorama.image );
  })
}

/**
 * Calling the main function
 */
app();