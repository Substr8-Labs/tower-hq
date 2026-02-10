#!/usr/bin/env bash
set -e

echo "============================================"
echo "  TowerHQ - Setup & Start"
echo "============================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed. Please install Node.js 18+.${NC}"
    exit 1
fi

NODE_VERSION=$(node -v | sed 's/v//' | cut -d. -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}Error: Node.js 18+ required. Current version: $(node -v)${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node -v) detected${NC}"

# Check for .env file
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        echo -e "${YELLOW}No .env file found. Copying from .env.example...${NC}"
        cp .env.example .env
        echo -e "${YELLOW}⚠ Please update .env with your database URL and API keys.${NC}"
    else
        echo -e "${RED}Error: No .env or .env.example file found.${NC}"
        exit 1
    fi
fi
echo -e "${GREEN}✓ Environment file found${NC}"

# Install dependencies
echo ""
echo "Installing dependencies..."
npm install --legacy-peer-deps 2>&1 | tail -1
echo -e "${GREEN}✓ Dependencies installed${NC}"

# Generate Prisma client
echo ""
echo "Generating Prisma client..."
npx prisma generate 2>&1 | tail -1
echo -e "${GREEN}✓ Prisma client generated${NC}"

# Push database schema
echo ""
echo "Applying database schema..."
npx prisma db push --accept-data-loss 2>&1 | tail -3
echo -e "${GREEN}✓ Database schema applied${NC}"

# Start the development server
echo ""
echo "============================================"
echo -e "${GREEN}  Starting TowerHQ development server...${NC}"
echo "============================================"
echo ""
echo "  App:     http://localhost:3000"
echo "  Health:  http://localhost:3000/api/health"
echo ""
echo "  Press Ctrl+C to stop the server"
echo ""

npm run dev
