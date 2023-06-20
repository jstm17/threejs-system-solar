import * as THREE from "three"
import {
    OrbitControls
} from "three/examples/jsm/controls/OrbitControls.js";

// Time
let years = 0;

setInterval(function(){
    years++;
document.querySelector('.year').innerText = years + " years passed";

}, 5000);   

// Scene 
const scene = new THREE.Scene();
const loader = new THREE.TextureLoader();


// Planètes data
const planets = [
    {
        name: 'sun',
        texture: 'sunSurfaceMaterial.jpg',
        size: 20,
        posX: 0
    },
    {
        name: 'mercury',
        texture: 'mercurySurfaceMaterial.jpg',
        size: 1,
        posX: 0
    },
    {
        name: 'venus',
        texture: 'venusSurfaceMaterial.jpg',
        size: 3,
        posX: 0
    },
    {
        name: 'earth',
        texture: 'earthSurfaceMaterial.jpg',
        size: 4,
        posX: 0,
        satellite: {
            name: 'lune',
            texture: 'moon.jpg',
            size: 1,
            posX: 0
        }
    },
    {
        name: 'mars',
        texture: 'marsSurfaceMaterial.png',
        size: 2,
        posX: 0
    },
    {
        name: 'jupiter',
        texture: 'jupiterSurfaceMaterial.jpg',
        size: 10,
        posX: 0
    },
    {
        name: 'saturn',
        texture: 'saturnSurfaceMaterial.jpg',
        size: 7,
        posX: 0,
        ring: {
            innerRadius: 10,
            outerRadius: 15,
            rotationX: 2.1,
            rotationY: -0.5
        }
    },
    {
        name: 'uranus',
        texture: 'uranusSurfaceMaterial.jpg',
        size: 6,
        posX: 0,
        ring: {
            innerRadius: 10,
            outerRadius: 11,
            rotationX: 1.1,
            rotationY: 0.5
        }
    },
    {
        name: 'neptune',
        texture: 'neptuneSurfaceMaterial.jpg',
        size: 5,
        posX: 0
    },
]


// Calcul position X des planètes
const distance = 20;

planets[1].posX = planets[0].size + planets[1].size*2 + distance;
planets[2].posX = planets[1].posX + planets[2].size*2 + distance;
planets[3].posX = planets[2].posX + planets[3].size*2 + distance;
planets[4].posX = planets[3].posX + planets[4].size*2 + distance;
planets[5].posX = planets[4].posX + planets[5].size + distance;
planets[6].posX = planets[5].posX + planets[6].size*2 + distance;
planets[7].posX = planets[6].posX + planets[7].size*2 + distance;
planets[8].posX = planets[7].posX + planets[8].size*2 + distance;
console.log(planets[8].posX);

// Création des planètes
const planetsMesh = {};
const ringsMesh = {};

planets.forEach(item => {
    const planetTexture = loader.load('textures/' + item.texture ); 

    const planetGeometry =  new THREE.SphereGeometry(item.size, 32, 32);
    const planetMaterial = new THREE.MeshLambertMaterial( { map: planetTexture } );
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);
    planet.position.set(item.posX, 0, 0)

    scene.add(planet);

    planetsMesh[item.name] = planet;

    // Anneaux
    if(item.ring) {
        const ringGeometry = new THREE.RingGeometry( item.ring.innerRadius, item.ring.outerRadius, 32 );
        const ringMaterial = new THREE.MeshLambertMaterial( { 
            map: planetTexture,
            color: 0xffffff,
            side: THREE.DoubleSide,
            transparent: true,
         } );
        const ring = new THREE.Mesh( ringGeometry, ringMaterial );
        ring.position.set(item.posX, 0, 0)
        ring.rotation.set(item.ring.rotationX, item.ring.rotationY, 0)
        scene.add( ring );

        ringsMesh[item.name] = ring;
    }

    // Lune
    if(item.satellite) {
        const satelliteTexture = loader.load('textures/' + item.satellite.texture ); 

        const satelliteGeometry =  new THREE.SphereGeometry(item.satellite.size, 32, 32);
        const satelliteMaterial = new THREE.MeshLambertMaterial( { map: satelliteTexture } );
        const satellite = new THREE.Mesh(satelliteGeometry, satelliteMaterial);
        satellite.position.set(item.posX + 9, 0, 0)

        scene.add(satellite);

        planetsMesh[item.satellite.name] = satellite;
    }

    // Trajectoires
        const pathGeometry = new THREE.RingGeometry( item.posX, item.posX + 0.1, 64 );
        const pathMaterial = new THREE.MeshLambertMaterial( { 
            color: 0xffffff,
            side: THREE.DoubleSide
         } );
        const path = new THREE.Mesh( pathGeometry, pathMaterial );
        path.rotation.set(Math.PI / 2, 0, 0)
        scene.add( path );


});

// Lumière
const pointLight = new THREE.PointLight( 0xffffff, 5, 500, 3 );
pointLight.position.set( 5, 5, 5 );
scene.add( pointLight );
// const helper = new THREE.PointLightHelper( pointLight, 50 );
// scene.add( helper );

const ambientLight = new THREE.AmbientLight( 0xffffff, 0.5 ); // soft white light
scene.add( ambientLight );

// Stars
const starsNb = 6000;

for(let i=0; i < starsNb; i++){
    const starGeometry =  new THREE.SphereGeometry(0.1, 32, 32);
    const starMaterial = new THREE.MeshLambertMaterial( {color: 0xffffff} );
    const star = new THREE.Mesh(starGeometry, starMaterial);

    star.position.set(Math.random()*1000 - 500 , Math.random()*1000 - 500 ,  Math.random()*1000 - 500);
    
    scene.add( star );
}


// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height)
camera.position.set(0, 300, 500)
scene.add(camera);

// Renderer 
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height);

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

console.log(planetsMesh)
// Animate
const animate = () => {

    // Rotation planète + anneaux autour du soleil
    let time = new Date() * 0.0001;
    
    planetsMesh["mercury"].position.x = Math.cos( time * 77.4 ) * planets[1].posX;
    planetsMesh["mercury"].position.z = Math.sin( time * 77.4 ) * planets[1].posX;

    planetsMesh["venus"].position.x = Math.cos( time * 38.7 ) * planets[2].posX;
    planetsMesh["venus"].position.z = Math.sin( time * 38.7 ) * planets[2].posX;

    planetsMesh["earth"].position.x = Math.cos( time * 12.9 ) * planets[3].posX;
    planetsMesh["earth"].position.z = Math.sin( time * 12.9 ) * planets[3].posX;
    planetsMesh["lune"].position.x = Math.cos( time * 12.9 ) * planets[3].posX + 5;
    planetsMesh["lune"].position.z = Math.sin( time * 12.9 ) * planets[3].posX + 5;

    planetsMesh["mars"].position.x = Math.cos( time * 7.74 ) * planets[4].posX;
    planetsMesh["mars"].position.z = Math.sin( time * 7.74 ) * planets[4].posX;

    planetsMesh["jupiter"].position.x = Math.cos( time * 4.128 ) * planets[5].posX;
    planetsMesh["jupiter"].position.z = Math.sin( time * 4.128 ) * planets[5].posX;

    planetsMesh["saturn"].position.x = Math.cos( time * 0.645 ) * planets[6].posX;
    planetsMesh["saturn"].position.z = Math.sin( time * 0.645 ) * planets[6].posX;
    ringsMesh["saturn"].position.x = Math.cos( time * 0.645 ) * planets[6].posX;
    ringsMesh["saturn"].position.z = Math.sin( time * 0.645 ) * planets[6].posX;

    planetsMesh["uranus"].position.x = Math.cos( time * 0.258 ) * planets[7].posX;
    planetsMesh["uranus"].position.z = Math.sin( time * 0.258 ) * planets[7].posX;
    ringsMesh["uranus"].position.x = Math.cos( time * 0.258 ) * planets[7].posX;
    ringsMesh["uranus"].position.z = Math.sin( time * 0.258 ) * planets[7].posX;

    planetsMesh["neptune"].position.x = Math.cos( time * 0.007 ) * planets[8].posX;
    planetsMesh["neptune"].position.z = Math.sin( time * 0.007 ) * planets[8].posX;

    // Rotation planète + anneaux
    for (let key in planetsMesh) {
        planetsMesh[key].rotation.y += 0.001;
      }

      for (let key in ringsMesh) {
        ringsMesh[key].rotation.y += 0.001;
      }
    // console.log(time)
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate()