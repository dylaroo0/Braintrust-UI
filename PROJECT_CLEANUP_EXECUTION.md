# Project Cleanup Execution Plan

## IMMEDIATE ACTIONS NEEDED

### Phase 1: Remove Duplicate Directories Inside BrainTrust_circle-main/
These are causing the most confusion:

1. **Remove BrainTrust_circle-main/.kiro/** (already copied specs to root)
2. **Remove BrainTrust_circle-main/.bmad-core/** (duplicate of root)
3. **Remove BrainTrust_circle-main/.windsurf/** (duplicate of root)
4. **Remove BrainTrust_circle-main/.snapshots/** (duplicate of root)

### Phase 2: Consolidate IDE Configuration Directories
Keep only ONE set of IDE configs at root level:
- Keep: `.windsurf/rules/` (most complete)
- Remove: `.cursor/rules/`, `.clinerules/`, `.claude/commands/`, `.github/chatmodes/`, `.gemini/bmad-method/`

### Phase 3: Consolidate .bmad-core Directories
- Keep: Root `.bmad-core/` (most complete)
- Remove: `.bmad-infrastructure-devops/` (subset of main bmad-core)
- Remove: `.bmad-core/bmad-core/` (nested duplicate)

### Phase 4: Clean Project Structure
The main React project should be easily accessible, not buried in nested folders.

## EXECUTION COMMANDS

### Step 1: Remove duplicates inside BrainTrust_circle-main/
```cmd
rmdir /s /q "BrainTrust_circle-main\.kiro"
rmdir /s /q "BrainTrust_circle-main\.bmad-core" 
rmdir /s /q "BrainTrust_circle-main\.windsurf"
rmdir /s /q "BrainTrust_circle-main\.snapshots"
```

### Step 2: Remove duplicate IDE configs
```cmd
rmdir /s /q ".cursor"
rmdir /s /q ".clinerules"
rmdir /s /q ".claude"
rmdir /s /q ".github"
rmdir /s /q ".gemini"
```

### Step 3: Remove duplicate bmad directories
```cmd
rmdir /s /q ".bmad-infrastructure-devops"
rmdir /s /q ".bmad-core\bmad-core"
```

### Step 4: Remove other duplicates
```cmd
del ".roomodes"
```

## RESULT: Clean Structure
```
BrainTrust_circle-main/
├── .bmad-core/              # Single bmad directory
├── .kiro/                   # Single kiro directory with all specs
├── .windsurf/               # Single IDE config directory
├── .snapshots/              # Single snapshots directory
├── components/              # React components
├── services/                # Services
├── stores/                  # State management
├── App.tsx                  # Main React app
├── package.json             # Dependencies
└── README.md                # Documentation
```