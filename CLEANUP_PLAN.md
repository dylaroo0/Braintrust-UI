# Project Cleanup Plan

## Current Problem
- Nested directory structure: `BrainTrust_circle-main/BrainTrust_circle-main/`
- Multiple duplicate configuration directories
- Confusing structure for other developers

## Current Structure Issues
```
Root/
├── .bmad-core/           # DUPLICATE
├── .kiro/               # Has flexible-agent-system spec
├── .windsurf/           # DUPLICATE
├── .snapshots/          # DUPLICATE
├── BrainTrust_circle-main/
    ├── .bmad-core/      # DUPLICATE
    ├── .kiro/           # Has admin-assistant-memory-system & bmad-integration specs
    ├── .windsurf/       # DUPLICATE
    ├── .snapshots/      # DUPLICATE
    ├── components/      # ACTUAL PROJECT FILES
    ├── services/        # ACTUAL PROJECT FILES
    ├── App.tsx          # ACTUAL PROJECT FILES
    └── package.json     # ACTUAL PROJECT FILES
```

## Target Clean Structure
```
BrainTrust_circle-main/
├── .bmad-core/          # Single bmad-core directory
├── .kiro/               # Single kiro directory with ALL specs
│   └── specs/
│       ├── flexible-agent-system/
│       ├── admin-assistant-memory-system/
│       └── bmad-integration/
├── .windsurf/           # Single windsurf directory
├── components/          # React components
├── services/            # Services
├── App.tsx              # Main app
├── package.json         # Dependencies
└── README.md            # Documentation
```

## Cleanup Steps

### Step 1: Merge .kiro specs (COMPLETED)
- ✅ Copied admin-assistant-memory-system spec to root .kiro
- ✅ Copied bmad-integration spec to root .kiro

### Step 2: Remove duplicate directories inside BrainTrust_circle-main/
- [ ] Remove BrainTrust_circle-main/.kiro/
- [ ] Remove BrainTrust_circle-main/.bmad-core/
- [ ] Remove BrainTrust_circle-main/.windsurf/
- [ ] Remove BrainTrust_circle-main/.snapshots/

### Step 3: Move project files to proper location
- [ ] Move all React project files from BrainTrust_circle-main/ to root
- [ ] Update any path references in configuration files

### Step 4: Update documentation
- [ ] Update README.md with correct project structure
- [ ] Update DEVELOPER_GUIDE.md with correct paths
- [ ] Update steering documents if needed

## Benefits After Cleanup
- Clear, single-level directory structure
- No duplicate configuration directories
- Easy for new developers to understand
- All specs consolidated in one place
- Proper separation of project files and configuration