-- Base pour l'application
CREATE USER pme_user WITH PASSWORD 'pme_password';
CREATE DATABASE pme_db OWNER pme_user;
GRANT ALL PRIVILEGES ON DATABASE pme_db TO pme_user;

-- Base séparée pour Keycloak
CREATE DATABASE keycloak_db OWNER postgres;
