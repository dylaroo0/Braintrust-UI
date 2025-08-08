import os
import shutil
import logging
import json

logging.basicConfig(level=logging.INFO, format='%(message)s')

def clean_filename(filename):
    """Clean filename to match folder naming convention"""
    # Remove date suffix like _270525
    name = filename.replace('_270525', '').replace('_010825', '').replace('_040625', '').replace('_050625', '').replace('_100725', '').replace('_110725', '').replace('_170725', '').replace('_220725', '').replace('_240725', '').replace('_270625', '').replace('_280725', '').replace('_290525', '')
    
    # Remove special characters
    name = name.replace(',', '').replace('(', '').replace(')', '').replace('&', 'And').replace("'", '').replace('!', '').replace('?', '').replace('.', '')
    name = name.replace('-', ' ').replace('_', ' ')
    
    # Handle number prefixes (like "1-")
    if len(name) > 1 and name[0].isdigit() and name[1] == ' ':
        name = name[2:]
    
    # Convert to title case and add hyphens
    name = '-'.join(word.capitalize() for word in name.split())
    
    return name

def categorize_agent(agent_name, agent_content=""):
    """Categorize agent based on name and content"""
    name_lower = agent_name.lower()
    
    # Creative Content Creation
    if any(word in name_lower for word in ['writing', 'text', 'editor', 'blog', 'content', 'creative', 'story', 'document', 'email', 'formal', 'academic', 'enthusiastic', 'prompt', 'generator', 'writer', 'draft', 'template', 'format', 'style', 'tone', 'shakespeare', 'medieval', 'archaic']):
        if any(word in name_lower for word in ['audio', 'voice', 'speech', 'sound', 'video', 'movie', 'documentary', 'animation', 'multimedia']):
            return "AI-Specialist-Agents/Creative-Content-Creation/Audio-Multimedia"
        elif any(word in name_lower for word in ['visual', 'design', 'graphic', 'ux', 'ui', 'dashboard', 'image', 'spec', 'sheet']):
            return "AI-Specialist-Agents/Creative-Content-Creation/Visual-Design"
        elif any(word in name_lower for word in ['web', 'website', 'docs', 'swagger', 'google', 'digital']):
            return "AI-Specialist-Agents/Creative-Content-Creation/Web-Digital-Design"
        else:
            return "AI-Specialist-Agents/Creative-Content-Creation/Writing-Editing"
    
    # Technical Development
    elif any(word in name_lower for word in ['ai', 'agent', 'llm', 'model', 'prompt', 'system', 'ml', 'vision', 'local', 'fine', 'tune', 'embedding', 'rag', 'vector', 'multimodal', 'experiment', 'orchestration']):
        return "AI-Specialist-Agents/Technical-Development/AI-Development"
    elif any(word in name_lower for word in ['script', 'code', 'programming', 'python', 'javascript', 'json', 'csv', 'api', 'database', 'sql', 'mongodb', 'neo4j', 'postgres', 'docker', 'github', 'git', 'ide', 'tech', 'tool', 'debug', 'automation', 'zapier', 'n8n', 'workflow', 'browser', 'peripheral', 'adb', 'secrets', 'pii', 'synthetic', 'data']):
        return "AI-Specialist-Agents/Technical-Development/Programming-Tools"
    elif any(word in name_lower for word in ['aws', 'cloud', 'google', 'platform', 'web', 'infrastructure', 'server', 'hosting', 'deployment']):
        return "AI-Specialist-Agents/Technical-Development/Web-Infrastructure"
    
    # Organization & Productivity
    elif any(word in name_lower for word in ['document', 'folder', 'organize', 'file', 'workflow', 'sop', 'documentation', 'knowledge', 'base', 'scope', 'statement', 'work', 'technical', 'awesome', 'list']):
        return "AI-Specialist-Agents/Organization-Productivity/Information-Management"
    elif any(word in name_lower for word in ['task', 'todo', 'calendar', 'morning', 'email', 'summary', 'chore', 'household', 'househunting', 'automation', 'streamline', 'grocery', 'packing', 'imposter', 'syndrome', 'productivity']):
        return "AI-Specialist-Agents/Organization-Productivity/Personal-Productivity"
    
    # Home & Lifestyle
    elif any(word in name_lower for word in ['home', 'assistant', 'entity', 'smart', 'technology', 'household', 'zigbee', 'mqtt']):
        return "AI-Specialist-Agents/Home-Lifestyle/Smart-Home-Management"
    elif any(word in name_lower for word in ['household', 'inventory', 'manual', 'storage', 'minimalist', 'rugged', 'product', 'image', 'analysis']):
        return "AI-Specialist-Agents/Home-Lifestyle/Household-Organization"
    
    # Professional Development & Career
    elif any(word in name_lower for word in ['professional', 'career', 'job', 'development', 'navigator', 'tech', 'pathfinder', 'branding', 'conference', 'description', 'application', 'good']):
        return "AI-Specialist-Agents/Professional-Development-Career/Career-Building"
    elif any(word in name_lower for word in ['adhd', 'neurodivergence', 'imposter', 'syndrome', 'cognitive', 'treatment', 'news']):
        return "AI-Specialist-Agents/Professional-Development-Career/Cognitive-Support"
    
    # Security & Privacy
    elif any(word in name_lower for word in ['secrets', 'pii', 'filter', 'encryption', 'osint', 'email', 'geolocate', 'nfc', 'security']):
        return "AI-Specialist-Agents/Security-Privacy/Data-Protection"
    elif any(word in name_lower for word in ['self', 'hosted', 'open', 'source', 'software', 'finder', 'browser', 'advice', 'professional', 'tool', 'saas', 'privacy']):
        return "AI-Specialist-Agents/Security-Privacy/Privacy-Management"
    
    # AI Development & Ideation
    elif any(word in name_lower for word in ['ideator', 'assistant', 'audio', 'capable', 'vision', 'capable', 'dictation', 'dummy', 'tech', 'project', 'creative', 'naming', 'name', 'good']):
        return "AI-Specialist-Agents/AI-Development-Ideation/Concept-Generation"
    elif any(word in name_lower for word in ['agent', 'tool', 'developer', 'coach', 'builder', 'hardware', 'assessor', 'expert', 'tech', 'product', 'finder', 'spec', 'requirements', 'planner', 'technical', 'documentation']):
        return "AI-Specialist-Agents/AI-Development-Ideation/System-Design"
    
    # Default fallback - try to categorize by keywords
    else:
        # Default to Creative Content Creation for general text/content tools
        return "AI-Specialist-Agents/Creative-Content-Creation/Writing-Editing"

def organize_files():
    """Organize all JSON files into the proper folder structure"""
    
    if not os.path.exists("json_agents"):
        logging.error("json_agents folder not found!")
        return
    
    json_files = [f for f in os.listdir("json_agents") if f.endswith(".json")]
    logging.info(f"Found {len(json_files)} JSON files to organize")
    
    organized_count = 0
    failed_count = 0
    
    for i, file_name in enumerate(json_files, 1):
        try:
            # Clean the filename to get agent name
            clean_name = clean_filename(os.path.splitext(file_name)[0])
            
            # Try to read the JSON content for better categorization
            try:
                with open(os.path.join("json_agents", file_name), 'r', encoding='utf-8') as f:
                    agent_content = json.load(f)
                    content_str = str(agent_content).lower()
            except:
                content_str = ""
            
            # Categorize the agent
            category_path = categorize_agent(clean_name, content_str)
            
            # Create the full destination directory
            dest_dir = category_path
            os.makedirs(dest_dir, exist_ok=True)
            
            # Move the file
            source_path = os.path.join("json_agents", file_name)
            dest_path = os.path.join(dest_dir, file_name)
            
            shutil.move(source_path, dest_path)
            organized_count += 1
            
            logging.info(f"({i}/{len(json_files)}) ✓ {file_name} → {category_path}")
            
        except Exception as e:
            failed_count += 1
            logging.error(f"({i}/{len(json_files)}) ✗ Failed to move {file_name}: {str(e)}")
    
    logging.info(f"\n🎉 Organization complete!")
    logging.info(f"✅ Successfully organized: {organized_count} files")
    logging.info(f"❌ Failed: {failed_count} files")
    
    # Show summary by category
    logging.info(f"\n📊 Files organized by category:")
    for root, dirs, files in os.walk("AI-Specialist-Agents"):
        if files:  # Only show directories with files
            json_count = len([f for f in files if f.endswith('.json')])
            if json_count > 0:
                category = root.replace("AI-Specialist-Agents/", "").replace("AI-Specialist-Agents\\", "")
                logging.info(f"   {category}: {json_count} agents")

if __name__ == "__main__":
    organize_files()