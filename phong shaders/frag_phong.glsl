uniform vec3 lightColor;
uniform vec3 sphereColor;
uniform float sphereShininess;
varying vec3 lightDir;
varying vec3 eyeDir;
varying vec3 normalV;

void main() {
	vec3 N = normalize(normalV);
	vec3 L = normalize(lightDir);
	float l = clamp(dot(N, L), 0.0, 1.0);
	vec3 col = l * (lightColor*sphereColor);
	vec3 E = normalize(eyeDir);
	// vec3 R = reflect(-L, N);
	// "manual" computation of reflected vector
	vec3 R = -L - 2.0 * dot(-L, N) * N;
	float specular = pow(max(dot(R, E), 0.0), sphereShininess);
	col += lightColor * specular;
	gl_FragColor = vec4(col, 1.0);
}