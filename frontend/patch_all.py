import re
import glob

files = glob.glob(r'a:\Project\SentiNaut\frontend\src\pages\dashboards\*.jsx')

for file_path in files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    # For fetch with headers already present but missing Authorization
    content = re.sub(
        r"headers:\s*\{\s*'Content-Type':\s*'application/json'\s*\}",
        r"headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` }",
        content
    )

    # For fetch with just method but no headers
    content = re.sub(
        r"\{\s*method:\s*('POST'|'DELETE'|'PATCH'|'PUT')\s*\}",
        r"{ method: \1, headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }",
        content
    )

    # For simple fetch calls (GET)
    content = re.sub(
        r"fetch\((`[^`]+`)\)",
        r"fetch(\1, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })",
        content
    )

    if content != original:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Patched {file_path}")
