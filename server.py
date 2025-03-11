# This is a wrapper file for Render.com deployment
# It imports and runs the FastAPI application from server_interior.py

import os
import importlib.util
import sys

# Determine which server to run based on environment variable
server_type = os.environ.get('SERVER_TYPE', 'interior')

if server_type.lower() == 'text2image':
    # Load the text2image.py module
    spec = importlib.util.spec_from_file_location("text2image", "text2image.py")
    text2image = importlib.util.module_from_spec(spec)
    sys.modules["text2image"] = text2image
    spec.loader.exec_module(text2image)
    
    # Get the FastAPI app from the module
    app = text2image.app
else:
    # Load the server_interior.py module
    spec = importlib.util.spec_from_file_location("server_interior", "server_interior.py")
    server_interior = importlib.util.module_from_spec(spec)
    sys.modules["server_interior"] = server_interior
    spec.loader.exec_module(server_interior)
    
    # Get the FastAPI app from the module
    app = server_interior.app

# This file will be used by Render.com to run the application
# The app variable will be used by gunicorn to serve the application 