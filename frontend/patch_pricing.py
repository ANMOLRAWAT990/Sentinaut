import re

file_path = r'a:\Project\SentiNaut\frontend\src\pages\public\PricingPage.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# For simple fetch calls (GET) in useEffect
content = re.sub(
    r"fetch\((`[^`]+`)\)",
    r"fetch(\1, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })",
    content
)

# For fetch with headers already present
content = re.sub(
    r"headers:\s*\{\s*'Content-Type':\s*'application/json'\s*\}",
    r"headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` }",
    content
)

# For fetch with method POST and no headers
content = re.sub(
    r"\{\s*method:\s*'POST'\s*\}",
    r"{ method: 'POST', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }",
    content
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("PricingPage.jsx fixed")
