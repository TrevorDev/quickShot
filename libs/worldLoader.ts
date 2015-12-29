import THREE = require("three")
import OBJloader from "./OBJLoader";
export default {
  load: function(url, progress?){
    return new Promise<THREE.Object3D>((res, rej)=>{
      var loader = new OBJloader();
      loader.load(
        url,
        (mod:THREE.Object3D)=>{
          res(mod)
        },
        (progress)=>{},
        (err)=>{rej(err)
      })
    });
  }
}
