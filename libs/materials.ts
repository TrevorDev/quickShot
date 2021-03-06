import THREE = require("three")
var depthShader = THREE.ShaderLib[ "depthRGBA" ];
var depthUniforms = THREE.UniformsUtils.clone( depthShader.uniforms );
export default {
  depth:new THREE.ShaderMaterial( {
    fragmentShader: depthShader.fragmentShader,
    vertexShader: depthShader.vertexShader,
    uniforms: depthUniforms, blending: THREE.NoBlending
  }),
  toon: new THREE.ShaderMaterial({
    lights: true,
  	uniforms: {
  		time: { type: "f", value: 1.0 },
  		resolution: { type: "v2", value: new THREE.Vector2() },

      //light uniforms populated from lights
      ambientLightColor : { type: "fv", value: [] },

  		directionalLightDirection : { type: "fv", value: [] },
  		directionalLightColor : { type: "fv", value: [] },

  		hemisphereLightDirection : { type: "fv", value: [] },
  		hemisphereLightSkyColor : { type: "fv", value: [] },
  		hemisphereLightGroundColor : { type: "fv", value: [] },

  		pointLightColor : { type: "fv", value: [] },
  		pointLightPosition : { type: "fv", value: [] },
  		pointLightDistance : { type: "fv1", value: [] },
  		pointLightDecay : { type: "fv1", value: [] },

  		spotLightColor : { type: "fv", value: [] },
  		spotLightPosition : { type: "fv", value: [] },
  		spotLightDirection : { type: "fv", value: [] },
  		spotLightDistance : { type: "fv1", value: [] },
  		spotLightAngleCos : { type: "fv1", value: [] },
  		spotLightExponent : { type: "fv1", value: [] },
  		spotLightDecay : { type: "fv1", value: [] }
  	},
  	vertexShader: `
  	varying vec3 vPositionW;
  	varying vec3 vNormalW;
  	varying vec2 vUV;
    void main() {
      //regular vertex shader
      vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
      gl_Position = projectionMatrix * mvPosition;
  		vPositionW = vec3(modelViewMatrix * vec4(position, 1.0));
      vNormalW = normalize(vec3(modelViewMatrix * vec4(normal, 0.0)));
    }
    `,
  	fragmentShader: `
  	uniform vec3 ambientLightColor;
  	uniform vec3 pointLightPosition[ 1 ];
    varying vec3 vPositionW;
  	varying vec3 vNormalW;
    void main() {

      float ToonThresholds[4];
      ToonThresholds[0] = 0.99;
      ToonThresholds[1] = 0.6;
      ToonThresholds[2] = 0.2;
      ToonThresholds[3] = 0.03;

      float ToonBrightnessLevels[5];
      ToonBrightnessLevels[0] = 0.94;
      ToonBrightnessLevels[1] = 0.8;
      ToonBrightnessLevels[2] = 0.6;
      ToonBrightnessLevels[3] = 0.35;
      ToonBrightnessLevels[4] = 0.2;

      //vector from light to pixel
      vec3 lightVectorW = normalize(pointLightPosition[0] - vPositionW);
      //angle between normal and pixel
      float ndl = max(0., dot(vNormalW, lightVectorW));
      vec3 color = ambientLightColor;

      //toon levels
      if (ndl > ToonThresholds[0])
      {
          color *= ToonBrightnessLevels[0];
      }
      else if (ndl > ToonThresholds[1])
      {
          color *= ToonBrightnessLevels[1];
      }
      else if (ndl > ToonThresholds[2])
      {
          color *= ToonBrightnessLevels[2];
      }
      else if (ndl > ToonThresholds[3])
      {
          color *= ToonBrightnessLevels[3];
      }
      else
      {
          color *= ToonBrightnessLevels[4];
      }
      //add normal shading ontop of toon shader
      color *= ndl * ndl;
      gl_FragColor = vec4 (color, 1.0);
    }
    `
  })
}
