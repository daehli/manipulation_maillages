uniform vec3 lightPosition;
varying vec3 lightDir;
varying vec3 eyeDir;
varying vec3 normalV;

void main() {
	vec4 worldPos = modelMatrix * vec4(position, 1.0);
	lightDir = lightPosition - worldPos.xyz;
	eyeDir = cameraPosition - worldPos.xyz;
	normalV = normal;
	gl_Position = projectionMatrix * viewMatrix * worldPos;
}