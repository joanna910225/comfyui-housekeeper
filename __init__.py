"""Housekeeper - ComfyUI node alignment and colour tools.

This is a frontend-only extension: all behaviour lives in js/main.js, which ComfyUI serves
from the directory named by WEB_DIRECTORY. There are no backend nodes.

NODE_CLASS_MAPPINGS is exported as an empty dict on purpose. ComfyUI's custom-node loader
registers WEB_DIRECTORY first, but then requires either NODE_CLASS_MAPPINGS or a
comfy_entrypoint to consider the module loaded; without one it logs a skip warning and
reports "(IMPORT FAILED)" next to this pack on every startup. The loader's check is
`getattr(module, "NODE_CLASS_MAPPINGS") is not None`, so an empty dict satisfies it.
"""

WEB_DIRECTORY = "./js"

NODE_CLASS_MAPPINGS = {}
NODE_DISPLAY_NAME_MAPPINGS = {}

__all__ = ["WEB_DIRECTORY", "NODE_CLASS_MAPPINGS", "NODE_DISPLAY_NAME_MAPPINGS"]
