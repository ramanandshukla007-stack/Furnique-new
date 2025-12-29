# Furnique - Luxury Furniture & Soft-Furnishing eCommerce Platform

A production-ready Next.js application for furniture visualization, configuration, and sales. Includes AI-powered fabric visualization, real-time calculator tools, and comprehensive admin features.

## 🎯 Key Features

### 1. **Fabric Visualizer** (NEW 🚀)
- **Upload** furniture photos (JPEG, PNG)
- **AI Detection** automatically identifies furniture items (sofa, armchair, ottoman, etc.)
- **Instant Preview** of different fabrics in real-time using WebGL
- **Smart Masking** ensures fabric stays on furniture only
- **Manual Refinement** with brush tools (add/erase fabric area)
- **6+ Sample Fabrics** pre-loaded with PBR materials
- **Responsive Design** works on mobile, tablet, desktop

[📖 Visualizer Quick Start](./VISUALIZER_QUICKSTART.md) | [📚 Architecture](./VISUALIZER_ARCHITECTURE.md) | [🧪 Testing Guide](./VISUALIZER_TESTING.md)

### 2. **Curtain Calculator**
- Inch-based measurements (no unit toggles)
- 13-step exact calculation spec
- Pattern repeat matching
- Allowances for hems and headings
- Per-meter and sqft outputs
- Real-time cost estimation

### 3. **Furniture Yardage System**
- Per-item fabric requirements (sofas, chairs, cushions, etc.)
- 54" fabric width + 0.25yd rounding
- Dimension-based formulas for custom items
- Per-meter pricing conversions

### 4. **Admin Dashboard**
- Product management
- Order tracking
- Analytics & reports
- User management

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### Installation

1. **Clone and setup**
   ```bash
   git clone <repo>
   cd furnique-new
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your DATABASE_URL and NEXTAUTH_SECRET
   ```

3. **Initialize database**
   ```bash
   npm run prisma:migrate
   npm run prisma:seed
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   - Main app: http://localhost:3000
   - Visualizer: http://localhost:3000/visualizer
   - Login: demo@furnique.test / changeme

## 📁 Project Structure

```
/app                          # Next.js 14 App Router
  /api/visualizer/           # Fabric visualizer API endpoints
    ├─ upload/               # Image upload
    ├─ detect/               # Furniture detection (mock)
    ├─ fabrics/              # Fabric library
    ├─ apply-fabric/         # Compositing params
    ├─ mask-edit/            # Mask refinement
    └─ project/              # Project save/load
  /visualizer                # Visualizer page
  /calculator                # Curtain calculator page
  /admin                     # Admin dashboard
  ...

/components                   # React components
  ├─ VisualizerWorkflow.tsx   # Main visualizer orchestrator
  ├─ StepIndicator.tsx        # Progress indicator
  ├─ FabricSelector.tsx       # Fabric browser/filter
  ├─ MaskEditor.tsx           # Manual mask editing
  ├─ PreviewCanvas.tsx        # Canvas wrapper
  ...

/lib
  ├─ types/visualizer.ts      # TypeScript type definitions
  ├─ webgl-compositor.ts      # WebGL rendering engine
  ├─ calculator.ts            # Calculation utilities
  ├─ prisma.ts                # Prisma client instance
  ...

/prisma
  ├─ schema.prisma            # Database schema
  └─ seed.ts                  # Sample data seeding

/public
  ├─ /uploads/visualizer/     # User uploaded images
  ├─ /masks/visualizer/       # Generated alpha masks
  ├─ /textures/               # Fabric textures
  └─ /images/                 # Static images

/styles
  └─ globals.css              # Tailwind + custom styles

VISUALIZER_ARCHITECTURE.md    # Detailed visualizer architecture
VISUALIZER_QUICKSTART.md      # API reference & usage guide
VISUALIZER_TESTING.md         # Testing & demo scenarios
CURTAIN_CALCULATOR_SPEC.md    # Curtain calculation specification
```

## 🔑 Key Technologies

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes, Prisma ORM, PostgreSQL
- **Rendering**: WebGL 2.0 with custom shader support
- **Auth**: NextAuth with credentials provider
- **Image Processing**: Sharp for server-side optimization
- **Testing**: Vitest for unit tests

## 📖 Documentation

### For Developers

- **[Visualizer Architecture](./VISUALIZER_ARCHITECTURE.md)** – System design, APIs, WebGL pipeline, extension points for AR
- **[Visualizer Quick Start](./VISUALIZER_QUICKSTART.md)** – Setup, API reference, workflow, configuration
- **[Visualizer Testing](./VISUALIZER_TESTING.md)** – Manual testing, API testing, performance benchmarks, demo scenarios
- **[Curtain Calculator Spec](./CURTAIN_CALCULATOR_SPEC.md)** – 13-step calculation specification, formulas, examples

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Manual Testing
See [VISUALIZER_TESTING.md](./VISUALIZER_TESTING.md) for comprehensive test scenarios

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm run start
```

## �� Notes

- **Authentication**: NextAuth credentials provider. Demo user: `demo@furnique.test` / `changeme`
- **Passwords**: Hashed with bcrypt
- **Database**: Prisma ORM with PostgreSQL
- **Image Storage**: Local filesystem in `/public/uploads/` (swap for S3/CDN in production)

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/name`
2. Commit changes: `git commit -m "feat: description"`
3. Push to remote: `git push origin feature/name`
4. Open a Pull Request

## 📄 License

See LICENSE file

---

Built with ❤️ for luxury furniture ecommerce
