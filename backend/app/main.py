# FastAPI application entry point
# Creates FastAPI instance titled "PredictHealth API"
# Configures CORS middleware: allows http://localhost:5173, all methods and headers, credentials
# Auto-creates all SQLAlchemy tables via Base.metadata.create_all(bind=engine)
# Registers routers: auth (/api), predict (/api), history (/api), user (/api)
