import urllib.request
import zipfile
import os
import subprocess
import sys
import shutil

NODE_URL = 'https://nodejs.org/dist/v20.11.1/node-v20.11.1-win-x64.zip'
NODE_ZIP = 'node.zip'
NODE_DIR = 'node-v20.11.1-win-x64'

print("Downloading portable Node.js...")
urllib.request.urlretrieve(NODE_URL, NODE_ZIP)

print("Extracting Node.js...")
with zipfile.ZipFile(NODE_ZIP, 'r') as zip_ref:
    zip_ref.extractall('.')

print("Setting up paths...")
node_path = os.path.abspath(NODE_DIR)
npm_cmd = os.path.join(node_path, 'npm.cmd')
node_exe = os.path.join(node_path, 'node.exe')

# Clean up zip
os.remove(NODE_ZIP)

frontend_dir = os.path.join(os.getcwd(), 'frontend')

print("Running npm install in frontend...")
subprocess.run([npm_cmd, 'install'], cwd=frontend_dir, env={**os.environ, 'PATH': f"{node_path};{os.environ['PATH']}"}, check=True)

print("Dependencies downloaded successfully!")
print(f"You can now run: {npm_cmd} run dev")
