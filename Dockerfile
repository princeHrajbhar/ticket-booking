# --- 1. Base image ---
FROM node:22-alpine

# --- 2. Set working directory ---
WORKDIR /app

# --- 3. Copy package files ---
COPY package*.json tsconfig.json ./

# --- 4. Copy prisma folder early so postinstall can run ---
COPY prisma ./prisma

# --- 5. Install dependencies (postinstall will run prisma generate now) ---
RUN npm install

# --- 6. Copy source code ---
COPY ./src ./src

# --- NEW: copy lib folder ---
COPY ./lib ./lib

# --- 7. Copy .env ---
COPY .env ./

# --- 8. Expose port ---
EXPOSE 3000

# --- 9. Start server ---
CMD ["npx", "tsx", "src/server.ts"]