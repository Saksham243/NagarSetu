with open('src/App.jsx', 'r', encoding='utf-8', errors='replace') as f:
    lines = f.readlines()

# Find and remove the problematic line
new_lines = []
for line in lines:
    if '// Deployment trigger' not in line:
        new_lines.append(line)

with open('src/App.jsx', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print(f"Removed problematic line. File now has {len(new_lines)} lines")
