# Coding Standards

## React/TypeScript Standards

### Component Structure
- Use functional components with TypeScript
- Implement proper prop typing with interfaces
- Use React hooks for state management
- Follow component composition patterns

### State Management
- Use Zustand for global state management
- Keep component state local when possible
- Implement proper error boundaries

### Code Style
- Use TypeScript strict mode
- Implement proper error handling
- Follow ESLint and Prettier configurations
- Use meaningful variable and function names

### Testing
- Write unit tests for components and services
- Use React Testing Library for component tests
- Implement integration tests for critical workflows
- Maintain test coverage above 80%

## File Organization
- Components in `/components` directory
- Services in `/services` directory
- Types in `/types.ts` or dedicated type files
- Hooks in `/hooks` directory
- Stores in `/stores` directory

## Performance
- Implement proper memoization where needed
- Use lazy loading for large components
- Optimize bundle size with proper imports
- Implement proper error boundaries