# Overview

This is a full-stack e-commerce web application for Standfit Premium Concept, a wholesale food distribution and retail business based in Abuja, Nigeria. The application serves as both a company showcase and an online store where customers can browse products, view weekly deals, and contact the business for wholesale and retail orders. The platform emphasizes Nigerian-made products and provides direct WhatsApp integration for order placement.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing
- **UI Components**: Radix UI primitives with shadcn/ui design system
- **Styling**: Tailwind CSS with custom design tokens for consistent branding
- **State Management**: TanStack Query for server state management
- **Forms**: React Hook Form with Zod validation for type-safe form handling

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database ORM**: Drizzle ORM with PostgreSQL as the database
- **API Design**: RESTful API endpoints for CRUD operations
- **Database Connection**: Neon serverless PostgreSQL with connection pooling
- **Development**: Hot module reloading with Vite integration for full-stack development

## Data Model
The application uses a comprehensive schema including:
- **Users**: Customer profiles with wholesale/retail classification
- **Categories**: Product categorization system
- **Products**: Inventory management with pricing and Nigerian-made indicators
- **Weekly Deals**: Time-limited discount system
- **Store Locations**: Multiple outlet management
- **Blog Posts**: Content management for news and updates
- **Contact Messages**: Customer inquiry handling

## Key Features
- **Product Catalog**: Searchable and filterable product listings with category-based organization
- **Weekly Deals**: Promotional pricing with discount calculations
- **WhatsApp Integration**: Direct order placement through WhatsApp with pre-formatted messages
- **Multi-location Support**: Information for 6 physical store locations across Abuja
- **Content Management**: Blog system for company updates and promotions
- **Responsive Design**: Mobile-first approach with progressive enhancement

## Authentication & Session Management
- Session-based authentication using PostgreSQL session storage
- User profiles with wholesale customer classification
- Contact form with validation and storage

# External Dependencies

## Database & Storage
- **Neon Database**: Serverless PostgreSQL hosting with WebSocket support
- **Drizzle Kit**: Database migrations and schema management

## UI & Styling
- **Radix UI**: Accessible component primitives for complex UI elements
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Lucide Icons**: Consistent iconography throughout the application

## Development & Build Tools
- **Vite**: Fast build tool with hot module reloading and development server
- **TypeScript**: Type safety across the entire application stack
- **ESBuild**: Production bundling for server-side code

## Third-party Integrations
- **WhatsApp Business API**: Direct customer communication for order placement
- **Google Fonts**: Custom typography with Inter font family
- **Replit Integration**: Development environment with live preview capabilities

## Form Handling & Validation
- **React Hook Form**: Performant form management with minimal re-renders
- **Zod**: Schema validation for both client and server-side data validation
- **Hookform Resolvers**: Integration between React Hook Form and Zod schemas