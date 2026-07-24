# syntax=docker/dockerfile:1

# =============================================================================
# BudgetHub - Production Docker image
#
# This is a single Flask application (server-rendered templates + static
# assets, no separate Node/React build), so a multi-stage *single* Dockerfile
# is the most suitable approach:
#   - Stage 1 ("builder") installs Python dependencies into an isolated venv,
#     including build tools that are NOT needed at runtime.
#   - Stage 2 ("final") copies only the built venv + application source into
#     a clean, slim runtime image, keeping the final image small and free of
#     compilers/build headers.
# =============================================================================

# ---------------------------------------------------------------------------
# Stage 1: builder - install dependencies
# ---------------------------------------------------------------------------
FROM python:3.12-slim AS builder

# Prevent Python from writing .pyc files / buffer stdout (useful even at build time)
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Build tools needed only to compile some Python wheels (e.g. on slim images
# without prebuilt wheels available). Removed automatically since this stage
# is discarded from the final image.
RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Create an isolated virtual environment so we can copy it wholesale into
# the final stage without dragging along build tools.
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install dependencies first (better Docker layer caching: this layer only
# rebuilds when requirements.txt changes, not on every source code change).
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ---------------------------------------------------------------------------
# Stage 2: final - minimal runtime image
# ---------------------------------------------------------------------------
FROM python:3.12-slim AS final

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/opt/venv/bin:$PATH" \
    PORT=5000

# Runtime configuration defaults (overridable via `docker run -e` or
# docker-compose `environment:` / `env_file:`). These are NOT secrets.
ENV FLASK_DEBUG=false \
    DATABASE_URL=sqlite:///budget_tracker.db \
    GUNICORN_WORKERS=2 \
    GUNICORN_TIMEOUT=120

# Create a non-root user to run the application (security best practice)
RUN groupadd --system app && useradd --system --gid app --home-dir /app --create-home app

WORKDIR /app

# Bring in the pre-built virtual environment from the builder stage
COPY --from=builder /opt/venv /opt/venv

# Copy application source code
# (.dockerignore keeps out .git, venv, __pycache__, local db files, .env, etc.)
COPY --chown=app:app . .

# Ensure the SQLite instance folder exists and is writable by the app user.
# This directory is also declared as a volume so data survives container
# restarts/recreation (see docker-compose.yml for the named volume mount).
RUN mkdir -p /app/instance && chown -R app:app /app/instance
VOLUME ["/app/instance"]

USER app

EXPOSE 5000

# Basic container healthcheck against the login page (does not require auth)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD python -c "import urllib.request,os,sys; \
    urllib.request.urlopen(f'http://127.0.0.1:{os.environ.get(\"PORT\",5000)}/login', timeout=3)" || exit 1

# Run with Gunicorn (production WSGI server) instead of Flask's dev server.
# Shell form is used so environment variables are expanded at container start.
CMD gunicorn --preload --bind 0.0.0.0:${PORT} \
    --workers ${GUNICORN_WORKERS} \
    --timeout ${GUNICORN_TIMEOUT} \
    --access-logfile - \
    --error-logfile - \
    app:app