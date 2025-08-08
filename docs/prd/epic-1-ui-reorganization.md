---

**Epic Title**

UI Panel Reorganization - Brownfield Enhancement

**Epic Goal**

To reorganize the main UI panels to improve user experience and align with the new flexible agent system architecture. This will involve renaming the "Command Center" to "Organizer Panel" and moving the "Project Brief" to a more logical location.

**Epic Description**

**Existing System Context:**

*   Current relevant functionality: The application has a three-panel layout with a "Project Hub" on the left, a central chat area, and an "Organizer Panel" on the right. The "Command Center" is a section within the "Organizer Panel", and the "Project Brief" is located in the "Project Hub".
*   Technology stack: React, TypeScript, Zustand
*   Integration points: The changes will affect the `App.tsx`, `OrganizerPanel.tsx`, and `TaskSidebar.tsx` components.

**Enhancement Details:**

*   What's being added/changed:
    *   The "Command Center" will be renamed to "Organizer Panel".
    *   The "Project Brief" will be moved from the "Project Hub" (left panel) to the "Organizer Panel" (right panel).
*   How it integrates: The changes will be made directly to the relevant React components.
*   Success criteria:
    *   The "Command Center" is consistently referred to as "Organizer Panel" throughout the application.
    *   The "Project Brief" is accessible from the "Organizer Panel".
    *   The "Project Hub" no longer displays the "Project Brief".

**Stories**

1.  **Story 1:** Reorganize UI Panels - Rename "Command Center" and move "Project Brief".

**Compatibility Requirements**

*   [x] Existing APIs remain unchanged
*   [x] Database schema changes are backward compatible
*   [x] UI changes follow existing patterns
*   [x] Performance impact is minimal

**Risk Mitigation**

*   **Primary Risk:** Minimal risk, as this is primarily a UI reorganization.
*   **Mitigation:** Changes will be tested to ensure no loss of functionality.
*   **Rollback Plan:** Revert the changes in the affected components.

**Definition of Done**

*   [ ] All stories completed with acceptance criteria met
*   [ ] Existing functionality verified through testing
*   [ ] Integration points working correctly
*   [ ] Documentation updated appropriately
*   [ ] No regression in existing features

---