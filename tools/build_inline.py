# Generates js/assets-inline.js : the two WebGL textures as data-URIs so the site
# also works when index.html is opened straight from disk (file://), where WebGL
# would otherwise refuse to read image files.
import base64, os
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def uri(p,m): return f"data:{m};base64,"+base64.b64encode(open(os.path.join(R,p),'rb').read()).decode()
open(os.path.join(R,'js/assets-inline.js'),'w').write(
 "window.__ASSETS={head:'%s',depth:'%s'};\n"%(uri('assets/head.webp','image/webp'),uri('assets/depth.png','image/png')))
print('ok')
