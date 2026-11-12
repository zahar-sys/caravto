# Run with Blender: blender --background --python scripts/blender-import.py
# Produces a real .blend only when actually executed in Blender, never a renamed GLB.
import bpy
from pathlib import Path
root = Path(__file__).resolve().parent.parent
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
bpy.ops.import_scene.gltf(filepath=str(root/'public/models/rovny-touring.glb'))
for obj in bpy.context.scene.objects:
    if obj.type == 'MESH':
        for poly in obj.data.polygons:
            poly.use_smooth = True
bpy.ops.wm.save_as_mainfile(filepath=str(root/'design/rovny-touring.blend'))
