import os
from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from auth import auth_bp
from predictor_routes import predictor_bp
from admin_routes import admin_bp

def create_app():
    app = Flask(__name__, static_folder=None)
    app.url_map.strict_slashes = False
    app.config.from_object(Config)

    # Enable CORS for API
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    JWTManager(app)

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(predictor_bp, url_prefix='/api')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')

    # --- Serve frontend static build (for production / Render) ---
    DIST_DIR = os.path.join(os.path.dirname(__file__), 'dist')

    @app.route('/')
    def index():
        if os.path.exists(os.path.join(DIST_DIR, 'index.html')):
            return send_from_directory(DIST_DIR, 'index.html')
        return {"msg": "StrokeNova API is running"}, 200

    @app.route('/assets/<path:filename>')
    def serve_assets(filename):
        return send_from_directory(os.path.join(DIST_DIR, 'assets'), filename)

    # Catch-all for SPA client-side routing (e.g. /dashboard, /predict)
    @app.route('/<path:path>')
    def catch_all(path):
        # Don't hijack /api routes
        if path.startswith('api/'):
            return {"error": "Not found"}, 404
        # Serve static file if it exists
        full_path = os.path.join(DIST_DIR, path)
        if os.path.isfile(full_path):
            return send_from_directory(DIST_DIR, path)
        # Otherwise serve index.html for SPA routing
        if os.path.exists(os.path.join(DIST_DIR, 'index.html')):
            return send_from_directory(DIST_DIR, 'index.html')
        return {"error": "Not found"}, 404

    return app

# Create app at module level — gunicorn uses this as `app:app`
app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
