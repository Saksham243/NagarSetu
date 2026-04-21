# Read file as binary and remove the problematic line
with open('src/App.jsx', 'rb') as f:
    content = f.read()

# Find and remove lines containing "Deployment trigger"
lines = content.split(b'\n')
new_lines = []
for line in lines:
    # Skip lines that contain "Deployment trigger" in any encoding
    if b'Deployment trigger' not in line and b'D\x00e\x00p\x00l' not in line:
        new_lines.append(line)

new_content = b'\n'.join(new_lines)

# Write back as clean UTF-8
# Try to decode with different methods
try:
    text = new_content.decode('utf-8', errors='ignore')
except:
    try:
        text = new_content.decode('utf-16-le', errors='ignore')
    except:
        text = new_content.decode('latin-1', errors='ignore')

# Remove any null bytes and extra whitespace
text = text.replace('\x00', '')
lines = text.split('\n')
# Remove empty or whitespace-only lines at the end
while lines and not lines[-1].strip():
    lines.pop()

text = '\n'.join(lines)

with open('src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print('Cleaned up file')
print(f"File now has {len(text.split(chr(10)))} lines")
