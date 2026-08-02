import re

file_path = r'a:\Project\SentiNaut\frontend\src\pages\dashboards\OwnerDashboard.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# For fetch with headers already present
content = re.sub(
    r"headers:\s*\{\s*'Content-Type':\s*'application/json'\s*\}",
    r"headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` }",
    content
)

# For fetch with just method but no headers
content = re.sub(
    r"\{\s*method:\s*('POST'|'DELETE'|'PATCH')\s*\}",
    r"{ method: \1, headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }",
    content
)

# For simple fetch calls (GET) in Promise.all
content = re.sub(
    r"fetch\((`[^`]+`)\)",
    r"fetch(\1, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })",
    content
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("OwnerDashboard.jsx fixed")
