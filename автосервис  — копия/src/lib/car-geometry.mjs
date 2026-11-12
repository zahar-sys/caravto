import * as T from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
// Original low-poly touring car. No third-party meshes or textures. CC0-1.0.
export function createCar(){
 const root=new T.Group();root.name='Rovny_Touring';
 const mat=(color,metalness=0,roughness=.4)=>new T.MeshStandardMaterial({color,metalness,roughness});
 const paint=mat('#aec0ce',.58,.28),glass=mat('#263a47',.55,.18),black=mat('#1e242a',.12,.48),rubber=mat('#202329',0,.93),silver=mat('#c7cdd2',.86,.23),darkMetal=mat('#47515a',.72,.4),light=mat('#f7faf9',.2,.2),red=mat('#d5413f',.25,.25);
 const add=(g,m,pos,name,rot)=>{const mesh=new T.Mesh(g,m);mesh.position.set(...pos);if(rot)mesh.rotation.set(...rot);mesh.castShadow=true;mesh.receiveShadow=true;mesh.name=name;root.add(mesh);return mesh};
 const box=(size,pos,m,r=.04,name='Body')=>add(new RoundedBoxGeometry(...size,3,r),m,pos,name);
 // Side silhouette, extrusion spans the width. Rounded edges retain a compact weight.
 const shape=new T.Shape();shape.moveTo(-2,.57);shape.lineTo(-2.04,.88);shape.quadraticCurveTo(-2.02,1.06,-1.72,1.11);shape.lineTo(-1.28,1.14);shape.lineTo(-.79,1.7);shape.quadraticCurveTo(-.69,1.81,-.46,1.81);shape.lineTo(.5,1.79);shape.quadraticCurveTo(.71,1.76,.87,1.59);shape.lineTo(1.28,1.17);shape.lineTo(1.86,1.08);shape.quadraticCurveTo(2.08,1.04,2.09,.85);shape.lineTo(2.03,.57);shape.closePath();
 const geo=new T.ExtrudeGeometry(shape,{depth:1.55,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.055,bevelThickness:.055,curveSegments:12});geo.translate(0,0,-.775);add(geo,paint,[0,0,0],'Monocoque');
 box([3.95,.22,1.66],[0,.57,0],black,.07,'Lower sills');
 box([1.63,.08,1.47],[.04,1.82,0],black,.035,'Panoramic roof');
 // Flat side glass shapes, slightly inset to preserve body pillars.
 function windowSide(points,z,name){const s=new T.Shape();points.forEach(([x,y],i)=>i?s.lineTo(x,y):s.moveTo(x,y));s.closePath();const g=new T.ShapeGeometry(s);const m=glass.clone();m.side=T.DoubleSide;add(g,m,[0,0,z],name)}
 for(const side of [-1,1]){windowSide([[-1.12,1.18],[-.72,1.69],[-.17,1.71],[-.17,1.19]],side*.833,'Rear side glass');windowSide([[-.1,1.19],[-.1,1.71],[.53,1.7],[1.04,1.19]],side*.833,'Front side glass');
 box([.32,.14,.16],[.97,1.29,side*.96],paint,.045,'Side mirror');box([.22,.045,.035],[.43,1.08,side*.847],darkMetal,.015,'Door handle');box([.2,.045,.035],[-.7,1.08,side*.847],darkMetal,.015,'Door handle');box([2.25,.025,.027],[-.01,1.155,side*.846],silver,.008,'Window belt trim');box([2.5,.035,.04],[.02,.67,side*.871],paint,.012,'Side skirt trim');
 // Door seam deliberately shallow: geometry, not external textures.
 box([.012,.43,.013],[-.13,.94,side*.839],darkMetal,.003,'Door seam');}
 const wind=box([.69,.025,1.42],[.91,1.47,0],glass,.012,'Windshield');wind.rotation.z=-.84;
 const back=box([.5,.025,1.42],[-1.02,1.45,0],glass,.012,'Rear window');back.rotation.z=.87;
 box([.07,.22,1.14],[2.132,.81,0],black,.025,'Front grille');
 for(let z=-.45;z<=.45;z+=.15)box([.012,.14,.016],[2.175,.81,z],darkMetal,.003,'Grille vane');
 for(const s of [-1,1]){const hl=box([.09,.115,.42],[2.08,.987,s*.58],light,.025,'LED headlamp');hl.material.emissive=new T.Color('#e1f4ff');hl.material.emissiveIntensity=.25;box([.06,.08,.43],[-2.07,1.007,s*.58],red,.025,'Tail lamp');box([.09,.1,.11],[1.86,.66,s*.72],silver,.025,'Fog light');}
 box([.03,.13,.48],[2.18,.66,0],light,.012,'Number plate');box([.04,.03,.3],[2.203,.66,0],black,.003,'Plate lettering');
 box([.07,.09,1.35],[-2.09,.68,0],black,.015,'Rear diffuser');
 for(const x of [-1.28,1.3])for(const side of [-1,1]){const z=side*.845;const wheel=new T.Group();wheel.name='Wheel';wheel.position.set(x,.45,z);root.add(wheel);
 const tire=new T.Mesh(new T.CylinderGeometry(.425,.425,.24,40,1),rubber);tire.rotation.x=Math.PI/2;tire.castShadow=true;wheel.add(tire);
 const rim=new T.Mesh(new T.CylinderGeometry(.3,.3,.252,32),darkMetal);rim.rotation.x=Math.PI/2;wheel.add(rim);
 const brake=new T.Mesh(new T.CylinderGeometry(.225,.225,.255,32),silver);brake.rotation.x=Math.PI/2;wheel.add(brake);
 for(let k=0;k<5;k++){const spoke=new T.Mesh(new RoundedBoxGeometry(.055,.53,.025,2,.01),silver);spoke.rotation.z=k*Math.PI/5;spoke.position.z=side*.14;wheel.add(spoke)}
 const hub=new T.Mesh(new T.CylinderGeometry(.075,.075,.29,20),silver);hub.rotation.x=Math.PI/2;wheel.add(hub);
 const ring=new T.Mesh(new T.TorusGeometry(.321,.012,6,40),silver);ring.position.z=side*.137;wheel.add(ring);
 // Tire shoulder grooves.
 for(let k=0;k<30;k++){const angle=k/30*Math.PI*2;const tread=new T.Mesh(new T.BoxGeometry(.025,.012,.2),black);tread.position.set(Math.sin(angle)*.424,Math.cos(angle)*.424,0);tread.rotation.z=-angle;wheel.add(tread)} }
 return root;
}
