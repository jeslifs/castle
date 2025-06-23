uniform sampler2D uDay;
uniform sampler2D uNight;
uniform float uProgress;

varying vec2 vUv;

void main()
{
    vec4 night = texture2D(uNight, vUv);
    vec4 day = texture2D(uDay, vUv);
    vec4 mixTexture = mix(day, night, smoothstep(0.0, 1.0, uProgress));
    gl_FragColor = vec4(mixTexture);
}