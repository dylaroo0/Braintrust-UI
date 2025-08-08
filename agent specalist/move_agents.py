import os
import shutil
import json

def move_agents():
    """Move JSON agent files to their proper folders"""
    
    # Source and destination paths
    source_dir = "json_agents"
    dest_base = "AI-Specialist-Agents"
    
    # Agent to folder mapping (sample - will expand)
    agent_mapping = {
        "AcademicToneWriter_270525.json": "Creative-Content-Creation/Writing-Editing/Academic-Tone-Writer",
        "EnthusiasticText_270525.json": "Creative-Content-Creation/Writing-Editing/Enthusiastic-Text",
        "ZapierAutomationHelper_270525.json": "Technical-Development/Programming-Tools/Zapier-Automation-Helper",
        "ADHDTechAdvisor_270525.json": "Professional-Development-Career/Cognitive-Support/ADHD-Tech-Advisor",
        "ADHDTreatmentNews_270525.json": "Professional-Development-Career/Cognitive-Support/ADHD-Treatment-News",
        "ZigbeeHardwareFinder(MQTT)_270525.json": "Home-Lifestyle/Household-Organization/ZigbeeHardwareFinder(MQTT)"
    }
    
    if not os.path.exists(source_dir):
        print(f"Source directory {source_dir} not found!")
        return
    
    # Get all JSON files
    json_files = [f for f in os.listdir(source_dir) if f.endswith('.json')]
    print(f"Found {len(json_files)} JSON files to move")
    
    moved_count = 0
    
    for json_file in json_files:
        if json_file in agent_mapping:
            # Get destination folder
            dest_folder = os.path.join(dest_base, agent_mapping[json_file])
            
            # Create destination if it doesn't exist
            os.makedirs(dest_folder, exist_ok=True)
            
            # Move the file
            source_path = os.path.join(source_dir, json_file)
            dest_path = os.path.join(dest_folder, json_file)
            
            try:
                shutil.move(source_path, dest_path)
                print(f"Moved: {json_file} → {dest_folder}")
                moved_count += 1
            except Exception as e:
                print(f"Error moving {json_file}: {e}")
        else:
            print(f"No mapping found for: {json_file}")
    
    print(f"\nMoved {moved_count} files successfully!")
    print(f"Remaining files: {len(json_files) - moved_count}")

if __name__ == "__main__":
    move_agents()