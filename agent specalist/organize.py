import os
import shutil
import logging

logging.basicConfig(level=logging.INFO, format='%(message)s')

def clean_filename(filename):
    """Clean filename to match folder naming convention"""
    # Remove date suffix like _270525
    name = filename.replace('_270525', '')
    
    # Remove special characters
    name = name.replace(',', '').replace('(', '').replace(')', '')
    name = name.replace('-', ' ').replace('_', ' ')
    
    # Handle number prefixes (like "1-")
    if name[0].isdigit() and name[1] == ' ':
        name = name[2:]
    
    # Convert to title case and add hyphens
    name = '-'.join(word.capitalize() for word in name.split())
    
    return name

def organize_files():
    # Create a mapping of agent names to folder paths
    agent_folders = {
        # Writing-Editing agents
        "Academic-Tone-Writer": "AI-Specialist-Agents/Creative-Content-Creation/Writing-Editing/Academic-Tone-Writer",
        "Enthusiastic-Text": "AI-Specialist-Agents/Creative-Content-Creation/Writing-Editing/Enthusiastic-Text",
        # [All your other mappings here - same as before]
        "Adhd-Tech-Advisor": "AI-Specialist-Agents/Professional-Development-Career/Cognitive-Support/ADHD-Tech-Advisor",
        "Adhd-Treatment-News": "AI-Specialist-Agents/Professional-Development-Career/Cognitive-Support/ADHD-Treatment-News",
        "Zigbee-Hardware-Finder": "AI-Specialist-Agents/Home-Lifestyle/Household-Organization/ZigbeeHardwareFinder(MQTT)",
        "Zapier-Automation-Helper": "AI-Specialist-Agents/Technical-Development/Programming-Tools/ZapierAutomationHelper"
    }

    # Process JSON files
    if os.path.exists("json_agents"):
        json_files = [f for f in os.listdir("json_agents") if f.endswith(".json")]
        logging.info(f"Found {len(json_files)} JSON files to organize")
        
        for i, file_name in enumerate(json_files, 1):
            # Clean the filename to match folder naming convention
            clean_name = clean_filename(os.path.splitext(file_name)[0])
            
            if clean_name in agent_folders:
                dest_dir = agent_folders[clean_name]
                os.makedirs(dest_dir, exist_ok=True)
                shutil.move(os.path.join("json_agents", file_name), os.path.join(dest_dir, file_name))
                logging.info(f"({i}/{len(json_files)}) Moved {file_name} to {dest_dir}")
            else:
                logging.warning(f"({i}/{len(json_files)}) No matching folder for {file_name}")
    
    # Process Markdown files
    if os.path.exists("md_agents"):
        md_files = [f for f in os.listdir("md_agents") if f.endswith(".md")]
        logging.info(f"Found {len(md_files)} Markdown files to organize")
        
        for i, file_name in enumerate(md_files, 1):
            # Clean the filename to match folder naming convention
            clean_name = clean_filename(os.path.splitext(file_name)[0])
            
            if clean_name in agent_folders:
                dest_dir = agent_folders[clean_name]
                os.makedirs(dest_dir, exist_ok=True)
                shutil.move(os.path.join("md_agents", file_name), os.path.join(dest_dir, file_name))
                logging.info(f"({i}/{len(md_files)}) Moved {file_name} to {dest_dir}")
            else:
                logging.warning(f"({i}/{len(md_files)}) No matching folder for {file_name}")

    logging.info("Organization complete!")

if __name__ == "__main__":
    organize_files()