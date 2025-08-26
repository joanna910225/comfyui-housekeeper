from .ComfyUIFEExampleVueBasic import NODE_CLASS_MAPPINGS
import os
import nodes
from comfy_config import config_parser

custom_node_dir = os.path.dirname(os.path.realpath(__file__))
print("==========================")

project_config = config_parser.extract_node_configuration(custom_node_dir)

print(project_config.project.name)

print("==========================")

js_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), "js")

nodes.EXTENSION_WEB_DIRS[project_config.project.name] = js_dir

__all__ = ['NODE_CLASS_MAPPINGS']
