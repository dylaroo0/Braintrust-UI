import os
import shutil
import json

def create_folder_structure():
    """Create the complete AI-Specialist-Agents folder structure"""
    
    base_path = "AI-Specialist-Agents"
    
    # Define the complete folder structure
    folders = [
        # Creative Content Creation
        "Creative-Content-Creation/Writing-Editing/Academic-Tone-Writer",
        "Creative-Content-Creation/Writing-Editing/Enthusiastic-Text", 
        "Creative-Content-Creation/Writing-Editing/Text-Editor-Emotional-Amplifier",
        "Creative-Content-Creation/Writing-Editing/Formal-Writing-Generator",
        "Creative-Content-Creation/Writing-Editing/Dejargonizer",
        "Creative-Content-Creation/Writing-Editing/Blog-Outline-Generator",
        "Creative-Content-Creation/Writing-Editing/Project-Idea-Formatter",
        "Creative-Content-Creation/Writing-Editing/Idea-Notepad",
        "Creative-Content-Creation/Writing-Editing/Document-My-Writing-Style",
        "Creative-Content-Creation/Writing-Editing/The-Eccentrics-Thesaurus",
        "Creative-Content-Creation/Writing-Editing/Writing-Prompt-Editor",
        "Creative-Content-Creation/Writing-Editing/Assistant-Ideator-Writing-Editing",
        "Creative-Content-Creation/Writing-Editing/Technical-Writing-Questions",
        
        # Visual Design
        "Creative-Content-Creation/Visual-Design/Spec-Sheet-Simplifier",
        "Creative-Content-Creation/Visual-Design/UX-Streamliner", 
        "Creative-Content-Creation/Visual-Design/Home-Assistant-Dashboard-Editor",
        "Creative-Content-Creation/Visual-Design/Vision-Capable-Assistant-Ideator",
        "Creative-Content-Creation/Visual-Design/Start-Page-Guru",
        
        # Audio Multimedia
        "Creative-Content-Creation/Audio-Multimedia/Simple-Voice-Note-Transcriber",
        "Creative-Content-Creation/Audio-Multimedia/Voice-Transformation-Ideator",
        "Creative-Content-Creation/Audio-Multimedia/Assistant-Ideator-Audio-Capable",
        "Creative-Content-Creation/Audio-Multimedia/Dictation-Assistant-Ideator",
        "Creative-Content-Creation/Audio-Multimedia/Video-Formats-Codecs",
        "Creative-Content-Creation/Audio-Multimedia/Audio-Formats-Codecs",
        "Creative-Content-Creation/Audio-Multimedia/Movie-Binge-Strategist",
        "Creative-Content-Creation/Audio-Multimedia/Documentary-Finder",
        "Creative-Content-Creation/Audio-Multimedia/If-You-Liked-This",
        "Creative-Content-Creation/Audio-Multimedia/AI-Animation-Video-Guide",
        
        # Web Digital Design
        "Creative-Content-Creation/Web-Digital-Design/Website-Builders-Finder",
        "Creative-Content-Creation/Web-Digital-Design/Web-3-0-Demystifier",
        "Creative-Content-Creation/Web-Digital-Design/Swagger-Docs",
        "Creative-Content-Creation/Web-Digital-Design/Docs-Wizard",
        "Creative-Content-Creation/Web-Digital-Design/Google-Docs-Wizard",
        
        # Technical Development - AI Development
        "Technical-Development/AI-Development/Agent-Assistants-How-To",
        "Technical-Development/AI-Development/Multi-Agent-Frameworks-Guide",
        "Technical-Development/AI-Development/Agent-Plan-Document-Generator",
        "Technical-Development/AI-Development/Agent-Workflow-Spec-Generator",
        "Technical-Development/AI-Development/AI-Agent-Orchestration-Assistant",
        "Technical-Development/AI-Development/Orchestration-Agent-Manager",
        "Technical-Development/AI-Development/Vision-Language-Models",
        "Technical-Development/AI-Development/Local-LLM-Explainer",
        "Technical-Development/AI-Development/LLM-Approach-Guide",
        "Technical-Development/AI-Development/LLM-Expert",
        "Technical-Development/AI-Development/LLM-Fine-Tune-Guide",
        "Technical-Development/AI-Development/AI-Engineering-Expert",
        "Technical-Development/AI-Development/Experiment-Planner-Villages",
        "Technical-Development/AI-Development/How-To-Build-This",
        "Technical-Development/AI-Development/That-s-A-Good-AI-Question",
        
        # Programming Tools
        "Technical-Development/Programming-Tools/Script-Generation-Agent",
        "Technical-Development/Programming-Tools/IDE-App-Finder",
        "Technical-Development/Programming-Tools/Tech-Tool-Finder",
        "Technical-Development/Programming-Tools/Is-There-A-Tech-For-That",
        "Technical-Development/Programming-Tools/Writing-Editing-App-Finder",
        "Technical-Development/Programming-Tools/Secrets-Parser",
        "Technical-Development/Programming-Tools/PII-Filter-List-Creator",
        "Technical-Development/Programming-Tools/ADB-Assistant",
        "Technical-Development/Programming-Tools/Neo4j-Help",
        "Technical-Development/Programming-Tools/Browser-Automation-Guide",
        "Technical-Development/Programming-Tools/VOIP-Solutions-Finder",
        "Technical-Development/Programming-Tools/Peripheral-Finder",
        "Technical-Development/Programming-Tools/Tech-Diagnostic-Utility",
        "Technical-Development/Programming-Tools/Synthetic-Data-Creation-Assistant",
        "Technical-Development/Programming-Tools/Documents-To-JSON",
        "Technical-Development/Programming-Tools/Zapier-Automation-Helper",
        
        # Web Infrastructure
        "Technical-Development/Web-Infrastructure/AWS-Advisor",
        "Technical-Development/Web-Infrastructure/Google-Cloud-Platform",
        "Technical-Development/Web-Infrastructure/Website-Builders-Finder",
        "Technical-Development/Web-Infrastructure/Web-3-0-Demystifier",
        "Technical-Development/Web-Infrastructure/Swagger-Docs",
        "Technical-Development/Web-Infrastructure/Browser-Use-Agents",
        "Technical-Development/Web-Infrastructure/Custom-Tech-Doc-Creator",
        
        # Organization Productivity - Information Management
        "Organization-Productivity/Information-Management/Document-Workflow-Expert",
        "Organization-Productivity/Information-Management/Organise-My-Folders",
        "Organization-Productivity/Information-Management/File-Folder-Organisation",
        "Organization-Productivity/Information-Management/Document-My-Stack",
        "Organization-Productivity/Information-Management/Scope-Of-Service-Outliner-SLA",
        "Organization-Productivity/Information-Management/Statement-Of-Work-Generator",
        "Organization-Productivity/Information-Management/SOP-Documentation-Generator",
        "Organization-Productivity/Information-Management/Technical-Documentation-Generator",
        "Organization-Productivity/Information-Management/Documentation-Generator-General-Purpose",
        "Organization-Productivity/Information-Management/The-Documentation-Ally",
        "Organization-Productivity/Information-Management/Knowledge-Base-Documentation-Software-Finder",
        "Organization-Productivity/Information-Management/Awesome-List-Builder",
        
        # Personal Productivity
        "Organization-Productivity/Personal-Productivity/Task-Manager-Setup",
        "Organization-Productivity/Personal-Productivity/Morning-Email-Calendar-Summary",
        "Organization-Productivity/Personal-Productivity/Chore-Documentation-Generator",
        "Organization-Productivity/Personal-Productivity/Household-Documentation-Helper",
        "Organization-Productivity/Personal-Productivity/Househunting-Wishlist-Creator",
        "Organization-Productivity/Personal-Productivity/Automation-Workflow-Apps-Finder",
        "Organization-Productivity/Personal-Productivity/Streamline-My-Tech-Stack",
        "Organization-Productivity/Personal-Productivity/Data-Clustering-Assistant-Entity-Grouping",
        "Organization-Productivity/Personal-Productivity/To-Do-List-App-Finder",
        "Organization-Productivity/Personal-Productivity/The-Grocery-Helper",
        "Organization-Productivity/Personal-Productivity/Packing-List-Checker",
        "Organization-Productivity/Personal-Productivity/Imposter-Syndrome-Ally",
        
        # Home Lifestyle - Smart Home Management
        "Home-Lifestyle/Smart-Home-Management/Home-Assistant-Dashboard-Editor",
        "Home-Lifestyle/Smart-Home-Management/Home-Assistant-Entity-Organiser",
        "Home-Lifestyle/Smart-Home-Management/Entity-Organiser",
        "Home-Lifestyle/Smart-Home-Management/Home-Technology-Helper",
        "Home-Lifestyle/Smart-Home-Management/Under-The-Hood",
        
        # Household Organization
        "Home-Lifestyle/Household-Organization/Household-Digital-Organiser",
        "Home-Lifestyle/Household-Organization/Image-Analysis-Inventory-Assistant",
        "Home-Lifestyle/Household-Organization/User-Manual-Image-To-Text",
        "Home-Lifestyle/Household-Organization/Image-To-Text-Document-Processor",
        "Home-Lifestyle/Household-Organization/Manual-Reconstructor",
        "Home-Lifestyle/Household-Organization/User-Manual-Locator",
        "Home-Lifestyle/Household-Organization/Storage-Solution-Ideator",
        "Home-Lifestyle/Household-Organization/Storage-Recs-From-Photos",
        "Home-Lifestyle/Household-Organization/The-Overly-Dogmatic-Minimalist",
        "Home-Lifestyle/Household-Organization/Rugged-Product-Locator",
        "Home-Lifestyle/Household-Organization/ZigbeeHardwareFinder(MQTT)",
        
        # Professional Development Career - Career Building
        "Professional-Development-Career/Career-Building/Professional-Development-Navigator",
        "Professional-Development-Career/Career-Building/My-Ideal-Job-Documenter",
        "Professional-Development-Career/Career-Building/Tech-Career-Pathfinder",
        "Professional-Development-Career/Career-Building/Personal-Professional-Branding-Advisor",
        "Professional-Development-Career/Career-Building/Conference-Finder",
        "Professional-Development-Career/Career-Building/Job-Description-Analyst",
        "Professional-Development-Career/Career-Building/Outlandish-Job-Application-Ideator",
        "Professional-Development-Career/Career-Building/AI-Assistants-For-Good",
        
        # Cognitive Support
        "Professional-Development-Career/Cognitive-Support/Neurodivergence-Explorer",
        "Professional-Development-Career/Cognitive-Support/ADHD-Tech-Advisor",
        "Professional-Development-Career/Cognitive-Support/ADHD-Treatment-News",
        "Professional-Development-Career/Cognitive-Support/Imposter-Syndrome-Ally",
        
        # Security Privacy - Data Protection
        "Security-Privacy/Data-Protection/Secrets-Parser",
        "Security-Privacy/Data-Protection/PII-Filter-List-Creator",
        "Security-Privacy/Data-Protection/Encryption-Expert",
        "Security-Privacy/Data-Protection/OSINT-Tools-Explorer",
        "Security-Privacy/Data-Protection/Find-This-Persons-Email",
        "Security-Privacy/Data-Protection/Geolocate-This-Image",
        "Security-Privacy/Data-Protection/NFC-Expert",
        
        # Privacy Management
        "Security-Privacy/Privacy-Management/Tool-Finder-Self-Hosted-Only",
        "Security-Privacy/Privacy-Management/Open-Source-Software-Finder",
        "Security-Privacy/Privacy-Management/Workspace-Browser-Advice",
        "Security-Privacy/Privacy-Management/The-Professionals-Tool-Finder",
        "Security-Privacy/Privacy-Management/Tool-SaaS-Only",
        
        # AI Development Ideation - Concept Generation
        "AI-Development-Ideation/Concept-Generation/Assistant-Ideator-Writing-Editing",
        "AI-Development-Ideation/Concept-Generation/Assistant-Ideator-Audio-Capable",
        "AI-Development-Ideation/Concept-Generation/Vision-Capable-Assistant-Ideator",
        "AI-Development-Ideation/Concept-Generation/Dictation-Assistant-Ideator",
        "AI-Development-Ideation/Concept-Generation/Dummy-Tech-Project-Ideator",
        "AI-Development-Ideation/Concept-Generation/How-To-Build-This",
        "AI-Development-Ideation/Concept-Generation/Creative-Naming-Assistant",
        "AI-Development-Ideation/Concept-Generation/Project-Name-Ideator",
        "AI-Development-Ideation/Concept-Generation/AI-Assistants-For-Good",
        
        # System Design
        "AI-Development-Ideation/System-Design/Agent-Tool-Developer-Coach",
        "AI-Development-Ideation/System-Design/AI-Agent-Builders",
        "AI-Development-Ideation/System-Design/Local-LLM-Hardware-Assessor",
        "AI-Development-Ideation/System-Design/AI-Agents-Expert",
        "AI-Development-Ideation/System-Design/Tech-Product-Finder",
        "AI-Development-Ideation/System-Design/Spec-Requirements-Document-Generator",
        "AI-Development-Ideation/System-Design/Project-Planner",
        "AI-Development-Ideation/System-Design/Tech-Project-Planner",
        "AI-Development-Ideation/System-Design/Technical-Documentation-Generator"
    ]
    
    # Create all folders
    for folder in folders:
        full_path = os.path.join(base_path, folder)
        os.makedirs(full_path, exist_ok=True)
        print(f"Created: {full_path}")
    
    print(f"\nCreated {len(folders)} specialist agent folders!")

if __name__ == "__main__":
    create_folder_structure()