/* ------------------------------------------------------------------
   Cursor-following "3D" character.
   The cartoon is split into a body layer and a head layer. The head is
   drawn with WebGL using a depth map (parallax relief mapping), plus a
   CSS 3D rotation of the head card and a spring-smoothed cursor target.
   Result: the head turns/tilts toward the pointer like a real 3D model.
------------------------------------------------------------------- */
(function () {
  var stage = document.getElementById('stage');
  if (!stage) return;
  var headWrap = document.getElementById('stHead');
  var headImg = document.getElementById('stHeadImg');
  var body = document.getElementById('stBody');
  var canvas = document.getElementById('headGL');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- input -------------------------------------------------------
  var target = { x: 0, y: 0 };
  var pos = { x: 0, y: 0 }, vel = { x: 0, y: 0 };
  var lastMove = 0, headC = { x: 0, y: 0 };
  var ptr = null;

  function measure() {
    var r = headWrap.getBoundingClientRect();
    headC.x = r.left + r.width * 0.5;
    headC.y = r.top + r.height * 0.52;
  }
  function onMove(e) {
    var p = e.touches ? e.touches[0] : e;
    ptr = { x: p.clientX, y: p.clientY };
    lastMove = performance.now();
  }
  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('touchmove', onMove, { passive: true });
  window.addEventListener('resize', measure);
  window.addEventListener('scroll', measure, { passive: true });

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function shape(v) { return Math.sign(v) * Math.pow(Math.abs(v), 0.78); }

  // ---- WebGL -------------------------------------------------------
  var gl = null, prog, uM, uS, uPx, tex = {}, ready = false;

  function loadImg(src) {
    return new Promise(function (res, rej) { var i = new Image(); i.onload = function () { res(i); }; i.onerror = rej; i.src = src; });
  }
  function sh(type, src) {
    var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }
  function mkTex(img, unit) {
    var t = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return t;
  }

  var VS = 'attribute vec2 p;varying vec2 v;void main(){v=vec2(p.x*.5+.5,.5-p.y*.5);gl_Position=vec4(p,0.,1.);}';
  var FS = [
    'precision mediump float;',
    'varying vec2 v;',
    'uniform sampler2D uC;uniform sampler2D uD;',
    'uniform vec2 uM;uniform float uS;uniform vec2 uPx;',
    'void main(){',
    '  vec2 q=v;',
    // fixed-point parallax: nearer (brighter) texels shift further toward the cursor
    '  for(int i=0;i<4;i++){float d=texture2D(uD,q).r;q=v-uM*(d-.30)*uS;}',
    '  vec4 c=texture2D(uC,q);',
    // cheap normal from the depth map -> a light that slides as the head turns
    '  float dx=texture2D(uD,q+vec2(uPx.x,0.)).r-texture2D(uD,q-vec2(uPx.x,0.)).r;',
    '  float dy=texture2D(uD,q+vec2(0.,uPx.y)).r-texture2D(uD,q-vec2(0.,uPx.y)).r;',
    '  vec3 n=normalize(vec3(-dx*5.,-dy*5.,1.));',
    '  vec3 L=normalize(vec3(-uM.x*.7+.25,-uM.y*.7-.35,1.));',
    '  float s=dot(n,L)-dot(vec3(0.,0.,1.),L);',
    '  c.rgb*=1.+clamp(s,-.2,.2)*.55;',
    '  gl_FragColor=c;',
    '}'
  ].join('\n');

  function sizeCanvas() {
    var r = canvas.getBoundingClientRect();
    var d = Math.min(window.devicePixelRatio || 1, 2);
    var w = Math.max(2, Math.round(r.width * d));
    if (canvas.width !== w) { canvas.width = w; canvas.height = w; }
    if (gl) gl.viewport(0, 0, canvas.width, canvas.height);
    measure();
  }

  function draw() {
    if (!ready) return;
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(uM, pos.x, pos.y);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  Promise.all([loadImg(window.__ASSETS.head), loadImg(window.__ASSETS.depth)]).then(function (imgs) {
    try {
      gl = canvas.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: true });
      if (!gl) throw new Error('no webgl');
      prog = gl.createProgram();
      gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS));
      gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error('link');
      gl.useProgram(prog);
      var buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      var loc = gl.getAttribLocation(prog, 'p');
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      tex.c = mkTex(imgs[0], 0); tex.d = mkTex(imgs[1], 1);
      gl.uniform1i(gl.getUniformLocation(prog, 'uC'), 0);
      gl.uniform1i(gl.getUniformLocation(prog, 'uD'), 1);
      uM = gl.getUniformLocation(prog, 'uM');
      uS = gl.getUniformLocation(prog, 'uS');
      uPx = gl.getUniformLocation(prog, 'uPx');
      gl.uniform1f(uS, 0.06);
      gl.uniform2f(uPx, 2 / imgs[1].width, 2 / imgs[1].height);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      ready = true;
      sizeCanvas();
      draw();
      headImg.style.visibility = 'hidden';   // WebGL took over from the fallback <img>
      canvas.classList.add('on');
    } catch (err) {
      gl = null; ready = false;               // keep the static <img> + CSS-only 3D tilt
      console.warn('[character] WebGL unavailable, using CSS tilt only.', err);
    }
  }).catch(function () { /* keep fallback image */ });

  window.addEventListener('resize', sizeCanvas);
  if (window.ResizeObserver) new ResizeObserver(sizeCanvas).observe(canvas);

  // ---- animation loop (spring-smoothed) ----------------------------
  var t0 = performance.now(), prev = t0, active = false;
  function frame(now) {
    var dt = Math.min(0.05, (now - prev) / 1000); prev = now;
    var idle = now - lastMove > 2600 || !ptr;
    var tx, ty;
    if (reduce) { tx = 0; ty = 0; }
    else if (idle) {            // gentle "alive" sway when nobody is moving the mouse
      var t = (now - t0) / 1000;
      tx = Math.sin(t * 0.7) * 0.34; ty = Math.sin(t * 0.5 + 1.2) * 0.14;
    } else {
      tx = shape(clamp((ptr.x - headC.x) / (window.innerWidth * 0.42), -1, 1));
      ty = shape(clamp((ptr.y - headC.y) / (window.innerHeight * 0.5), -1, 1));
    }
    target.x = tx; target.y = ty;
    // critically-ish damped spring (slight overshoot = life)
    var k = 120, c = 15;
    vel.x += ((target.x - pos.x) * k - vel.x * c) * dt;
    vel.y += ((target.y - pos.y) * k - vel.y * c) * dt;
    pos.x += vel.x * dt; pos.y += vel.y * dt;

    var x = pos.x, y = pos.y;
    headWrap.style.transform =
      'perspective(1000px) translate3d(' + (x * 12).toFixed(2) + 'px,' + (y * 7).toFixed(2) + 'px,0) ' +
      'rotateY(' + (x * 15).toFixed(2) + 'deg) rotateX(' + (-y * 11).toFixed(2) + 'deg) rotateZ(' + (x * 2.6).toFixed(2) + 'deg)';
    body.style.transform = 'translate3d(' + (-x * 4).toFixed(2) + 'px,' + (y * 1.5).toFixed(2) + 'px,0) rotate(' + (-x * 0.5).toFixed(2) + 'deg)';
    draw();
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(function (n) { prev = n; measure(); frame(n); });

  // expose for the hero parallax / tests
  window.__character = { pos: pos, setTarget: function (x, y) { ptr = { x: headC.x + x, y: headC.y + y }; lastMove = performance.now(); } };
})();
