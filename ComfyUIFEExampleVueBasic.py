import folder_paths
import nodes
import json
from comfy.comfy_types import ComfyNodeABC

class ComfyUIFEExampleVueBasic:
    def __init__(self):
        pass

    @classmethod
    def INPUT_TYPES(s):
        return {
            "required": {
                "custom_vue_component_basic": ("CUSTOM_VUE_COMPONENT_BASIC", {}),
            },
        }

    RETURN_TYPES = ("IMAGE",)
    RETURN_NAMES = ("image",)

    FUNCTION = "run"

    CATEGORY = "examples"

    def run(self,  **kwargs):
        print(kwargs["custom_vue_component_basic"]["image"])

        image_path = folder_paths.get_annotated_filepath(kwargs["custom_vue_component_basic"]["image"])

        load_image_node = nodes.LoadImage()
        output_image, ignore_mask = load_image_node.load_image(image=image_path)

        return output_image,


class NodeAlignmentPanel(ComfyNodeABC):
    """
    A utility node that provides alignment functionality for selected nodes in the ComfyUI canvas.
    This node creates a panel with alignment buttons that can align multiple selected nodes.
    """

    DESCRIPTION = "Provides a panel with alignment tools for organizing nodes on the canvas"
    CATEGORY = "housekeeper/alignment"
    
    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {},
            "optional": {},
            "hidden": {
                "extra_pnginfo": "EXTRA_PNGINFO",
                "prompt": "PROMPT"
            }
        }

    RETURN_TYPES = ()
    RETURN_NAMES = ()
    FUNCTION = "process_alignment"
    OUTPUT_NODE = True

    def process_alignment(self, **kwargs):
        """
        This function doesn't need to do much on the backend since the alignment
        logic will be handled by the Vue frontend. This node mainly serves
        as a way to register the Vue extension.
        """
        return ()


class AlignmentCommand:
    """
    A hidden node that processes alignment commands from the frontend.
    This is used internally by the Vue component to execute alignment operations.
    """

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "alignment_type": (["left", "right", "top", "bottom"], {"default": "left"}),
                "node_ids": ("STRING", {"default": "[]"}),
                "canvas_info": ("STRING", {"default": "{}"})
            },
            "hidden": {
                "extra_pnginfo": "EXTRA_PNGINFO",
                "prompt": "PROMPT"
            }
        }

    RETURN_TYPES = ("STRING",)
    RETURN_NAMES = ("result",)
    FUNCTION = "execute_alignment"
    OUTPUT_NODE = False
    CATEGORY = "housekeeper/alignment"

    def execute_alignment(self, alignment_type, node_ids, canvas_info, **kwargs):
        """
        Process alignment command. The actual alignment is handled by Vue component,
        this just provides a way for the frontend to communicate back to the backend.
        """
        try:
            nodes_list = json.loads(node_ids)
            canvas_data = json.loads(canvas_info)
            
            result = {
                "success": True,
                "alignment_type": alignment_type,
                "processed_nodes": len(nodes_list),
                "message": f"Aligned {len(nodes_list)} nodes to {alignment_type}"
            }
            
            return (json.dumps(result),)
        except Exception as e:
            error_result = {
                "success": False,
                "error": str(e),
                "message": f"Failed to process alignment: {str(e)}"
            }
            return (json.dumps(error_result),)


NODE_CLASS_MAPPINGS = {
    "vue-basic": ComfyUIFEExampleVueBasic,
    "housekeeper-alignment": NodeAlignmentPanel,
    "housekeeper-alignment-cmd": AlignmentCommand
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "vue-basic": "Vue Basic",
    "housekeeper-alignment": "Node Alignment Panel (Housekeeper)",
    "housekeeper-alignment-cmd": "Alignment Command (Internal)"
}