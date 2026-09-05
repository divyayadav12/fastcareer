import re

files = [
    'src/pages/PlacementDriveForm.tsx',
    'src/pages/candidate/Dashboard.tsx'
]

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    def replacer(match):
        classNames = match.group(1)
        newClasses = classNames
        if 'pr-10' not in newClasses and 'pr-8' not in newClasses:
            newClasses = re.sub(r'\bp-1\b', 'p-1 pr-8', newClasses)
            newClasses = re.sub(r'\bp-2\b', 'p-2 pr-8', newClasses)
            newClasses = re.sub(r'\bp-3\b', 'p-3 pr-10', newClasses)
            newClasses = re.sub(r'\bpy-2\b', 'py-2 pr-8', newClasses)
            
        return match.group(0).replace(classNames, newClasses)

    new_content = re.sub(r'<select[^>]*?className="([^"]*)"', replacer, content)

    with open(file, 'w', encoding='utf-8') as f:
        f.write(new_content)
