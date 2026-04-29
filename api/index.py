"""
BHAT OVERSEAS — Vercel Python serverless function inside Prime-Link.

This is a single ASGI/FastAPI app that runs alongside Prime-Link's Next.js.
Vercel sees it as just one Python function (api/index.py); all helper code
lives in api/_lib/ which Vercel treats as plain modules, not separate
functions.

URL flow (configured in next.config.js rewrites):
    user URL                           -> Next.js rewrites to    -> Python sees
    primelinkhumancapital.com/bhat     /api/index                 /
    primelinkhumancapital.com/bhat/*   /api/index/*               /*
    primelinkhumancapital.com/turkey   /api/index/login?country=TR/login?country=TR
    primelinkhumancapital.com/turkey/* /api/index/*               /*
    primelinkhumancapital.com/romania  /api/index/login?country=RO/login?country=RO
    primelinkhumancapital.com/romania/* /api/index/*              /*

The outer wrapper strips the /api/index prefix so the inner FastAPI app's
routes (defined as /login, /pipeline, etc.) receive the right paths.
"""
import sys
from pathlib import Path

# Make the helper package importable
LIB_DIR = Path(__file__).resolve().parent / "_lib"
sys.path.insert(0, str(LIB_DIR))

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from database import init_db
from routes import (
    auth_routes, client_routes, document_routes, cv_routes,
    overview_routes, user_routes, subadmin_routes, views,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    import os
    try:
        os.makedirs("/tmp/storage/clients", exist_ok=True)
        os.makedirs("/tmp/storage/cv",      exist_ok=True)
    except Exception:
        pass
    yield


# Inner FastAPI app — the "real" BHAT Overseas application.
# root_path="/bhat" tells FastAPI it lives under /bhat from the user's
# perspective. url_for() generates URLs like /bhat/login, /bhat/static/...
inner = FastAPI(
    title="Bhat Overseas",
    version="2.0.0",
    lifespan=lifespan,
    root_path="/bhat",
)

inner.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"],
)

inner.mount("/static", StaticFiles(directory=str(LIB_DIR / "static")), name="static")

inner.include_router(views.router)
inner.include_router(auth_routes.admin_router,    prefix="/api/admin/auth")
inner.include_router(client_routes.router,        prefix="/api/admin/clients")
inner.include_router(document_routes.router,      prefix="/api/admin/documents")
inner.include_router(cv_routes.router,            prefix="/api/admin/cv")
inner.include_router(overview_routes.router,      prefix="/api/admin/overview")
inner.include_router(user_routes.router,          prefix="/api/admin/users")
inner.include_router(auth_routes.subadmin_router, prefix="/api/subadmin/auth")
inner.include_router(subadmin_routes.router,      prefix="/api/subadmin")


@inner.get("/api/health")
def health():
    return {"status": "ok", "system": "Bhat Overseas v2 (mounted in Prime-Link)"}


# Outer ASGI wrapper — Vercel routes any request that starts with /api/index
# here. We strip that prefix so the inner app sees clean paths (/, /login, ...).
class StripPrefix:
    def __init__(self, app, prefix: str):
        self.app = app
        self.prefix = prefix

    async def __call__(self, scope, receive, send):
        if scope.get("type") in ("http", "websocket"):
            path = scope.get("path", "")
            if path.startswith(self.prefix):
                stripped = path[len(self.prefix):]
                scope = {**scope, "path": stripped or "/", "raw_path": (stripped or "/").encode("utf-8")}
        await self.app(scope, receive, send)


# Vercel exposes this `app` as the serverless function handler.
app = StripPrefix(inner, "/api/index")
