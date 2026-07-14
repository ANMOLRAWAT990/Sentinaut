import os, glob, re

for file in glob.glob('frontend/src/**/*.jsx', recursive=True):
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # If it has the const declaration with localhost:8000, fix it first
    content = content.replace("import.meta.env.VITE_API_URL || 'http://localhost:8000'", "import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'")
    
    # Replace any single quote API calls with backticks
    content = re.sub(r"'http://localhost:8000(/.*?)'", r"`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}\1`", content)
    
    # Replace inside existing backticks
    content = content.replace('http://localhost:8000', "${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}")

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
print('Done!')
