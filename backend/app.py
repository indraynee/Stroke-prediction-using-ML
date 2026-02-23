from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from auth import auth_bp
from predictor_routes import predictor_bp

def create_app():
    app = Flask(__name__)
    app.url_map.strict_slashes = False
    app.config.from_object(Config)

    # Enable CORS for API
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    JWTManager(app)

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(predictor_bp, url_prefix='/api')

    @app.route('/')
    def index():
        return {"msg": "StrokeNova API is running"}, 200

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)
