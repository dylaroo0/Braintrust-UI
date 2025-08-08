import os
import shutil
import re

def clean_filename(filename):
    """Clean filename to match folder naming convention"""
    # Remove date suffix like _270525
    name = filename.replace('_270525', '').replace('_010825', '').replace('_040625', '').replace('_050625', '').replace('_100725', '').replace('_110725', '').replace('_170725', '').replace('_220725', '').replace('_240725', '').replace('_280725', '').replace('_290525', '').replace('_070725', '')
    
    # Remove .json extension
    name = name.replace('.json', '')
    
    # Handle special characters and formatting
    name = name.replace('&', 'And').replace('(', '').replace(')', '').replace(',', '').replace("'", '').replace('"', '')
    name = name.replace('-', ' ').replace('_', ' ')
    
    # Handle number prefixes (like "1-")
    if len(name) > 2 and name[0].isdigit() and name[1] in ['-', ' ']:
        name = name[2:]
    
    # Convert to title case and add hyphens
    words = name.split()
    clean_words = []
    for word in words:
        if word:  # Skip empty words
            clean_words.append(word.capitalize())
    
    return '-'.join(clean_words)

def move_all_agents():
    """Move all JSON agent files to appropriate folders based on keywords"""
    
    source_dir = "json_agents"
    dest_base = "AI-Specialist-Agents"
    
    if not os.path.exists(source_dir):
        print(f"Source directory {source_dir} not found!")
        return
    
    # Get all JSON files
    json_files = [f for f in os.listdir(source_dir) if f.endswith('.json')]
    print(f"Found {len(json_files)} JSON files to move")
    
    moved_count = 0
    
    # Keyword-based categorization
    categories = {
        # Creative Content Creation - Writing Editing
        'writing': 'Creative-Content-Creation/Writing-Editing',
        'text': 'Creative-Content-Creation/Writing-Editing', 
        'editor': 'Creative-Content-Creation/Writing-Editing',
        'blog': 'Creative-Content-Creation/Writing-Editing',
        'academic': 'Creative-Content-Creation/Writing-Editing',
        'formal': 'Creative-Content-Creation/Writing-Editing',
        'email': 'Creative-Content-Creation/Writing-Editing',
        'document': 'Creative-Content-Creation/Writing-Editing',
        
        # Creative Content Creation - Visual Design
        'ux': 'Creative-Content-Creation/Visual-Design',
        'ui': 'Creative-Content-Creation/Visual-Design',
        'design': 'Creative-Content-Creation/Visual-Design',
        'visual': 'Creative-Content-Creation/Visual-Design',
        'graphic': 'Creative-Content-Creation/Visual-Design',
        
        # Creative Content Creation - Audio Multimedia
        'audio': 'Creative-Content-Creation/Audio-Multimedia',
        'voice': 'Creative-Content-Creation/Audio-Multimedia',
        'video': 'Creative-Content-Creation/Audio-Multimedia',
        'movie': 'Creative-Content-Creation/Audio-Multimedia',
        'transcrib': 'Creative-Content-Creation/Audio-Multimedia',
        'dictation': 'Creative-Content-Creation/Audio-Multimedia',
        
        # Technical Development - AI Development
        'ai': 'Technical-Development/AI-Development',
        'llm': 'Technical-Development/AI-Development',
        'agent': 'Technical-Development/AI-Development',
        'prompt': 'Technical-Development/AI-Development',
        'system': 'Technical-Development/AI-Development',
        
        # Technical Development - Programming Tools
        'script': 'Technical-Development/Programming-Tools',
        'code': 'Technical-Development/Programming-Tools',
        'programming': 'Technical-Development/Programming-Tools',
        'tech': 'Technical-Development/Programming-Tools',
        'api': 'Technical-Development/Programming-Tools',
        'json': 'Technical-Development/Programming-Tools',
        'csv': 'Technical-Development/Programming-Tools',
        'python': 'Technical-Development/Programming-Tools',
        'javascript': 'Technical-Development/Programming-Tools',
        'debug': 'Technical-Development/Programming-Tools',
        
        # Technical Development - Web Infrastructure  
        'aws': 'Technical-Development/Web-Infrastructure',
        'cloud': 'Technical-Development/Web-Infrastructure',
        'web': 'Technical-Development/Web-Infrastructure',
        'website': 'Technical-Development/Web-Infrastructure',
        'swagger': 'Technical-Development/Web-Infrastructure',
        'docker': 'Technical-Development/Web-Infrastructure',
        
        # Organization Productivity - Information Management
        'documentation': 'Organization-Productivity/Information-Management',
        'folder': 'Organization-Productivity/Information-Management',
        'organiz': 'Organization-Productivity/Information-Management',
        'file': 'Organization-Productivity/Information-Management',
        'workflow': 'Organization-Productivity/Information-Management',
        
        # Organization Productivity - Personal Productivity
        'task': 'Organization-Productivity/Personal-Productivity',
        'todo': 'Organization-Productivity/Personal-Productivity',
        'calendar': 'Organization-Productivity/Personal-Productivity',
        'productivity': 'Organization-Productivity/Personal-Productivity',
        'planning': 'Organization-Productivity/Personal-Productivity',
        'grocery': 'Organization-Productivity/Personal-Productivity',
        
        # Home Lifestyle - Smart Home Management
        'home': 'Home-Lifestyle/Smart-Home-Management',
        'assistant': 'Home-Lifestyle/Smart-Home-Management',
        'automation': 'Home-Lifestyle/Smart-Home-Management',
        'zigbee': 'Home-Lifestyle/Household-Organization',
        
        # Professional Development Career - Career Building
        'job': 'Professional-Development-Career/Career-Building',
        'career': 'Professional-Development-Career/Career-Building',
        'professional': 'Professional-Development-Career/Career-Building',
        'resume': 'Professional-Development-Career/Career-Building',
        'interview': 'Professional-Development-Career/Career-Building',
        
        # Professional Development Career - Cognitive Support
        'adhd': 'Professional-Development-Career/Cognitive-Support',
        'neurodiverg': 'Professional-Development-Career/Cognitive-Support',
        'imposter': 'Professional-Development-Career/Cognitive-Support',
        
        # Security Privacy - Data Protection
        'security': 'Security-Privacy/Data-Protection',
        'encryption': 'Security-Privacy/Data-Protection',
        'privacy': 'Security-Privacy/Data-Protection',
        'pii': 'Security-Privacy/Data-Protection',
        'secret': 'Security-Privacy/Data-Protection',
        'osint': 'Security-Privacy/Data-Protection',
        
        # Security Privacy - Privacy Management
        'opensource': 'Security-Privacy/Privacy-Management',
        'selfhosted': 'Security-Privacy/Privacy-Management',
        'saas': 'Security-Privacy/Privacy-Management',
    }
    
    for json_file in json_files:
        filename_lower = json_file.lower()
        dest_folder = None
        
        # Try to categorize based on keywords
        for keyword, category in categories.items():
            if keyword in filename_lower:
                dest_folder = os.path.join(dest_base, category)
                break
        
        # Default category if no match found
        if not dest_folder:
            dest_folder = os.path.join(dest_base, "AI-Development-Ideation/Concept-Generation")
        
        # Create destination folder
        os.makedirs(dest_folder, exist_ok=True)
        
        # Move the file
        source_path = os.path.join(source_dir, json_file)
        dest_path = os.path.join(dest_folder, json_file)
        
        try:
            shutil.move(source_path, dest_path)
            print(f"Moved: {json_file}")
            moved_count += 1
        except Exception as e:
            print(f"Error moving {json_file}: {e}")
    
    print(f"\nMoved {moved_count} files successfully!")

if __name__ == "__main__":
    move_all_agents()