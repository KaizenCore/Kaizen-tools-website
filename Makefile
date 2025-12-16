.PHONY: help build up down restart logs shell test clean rebuild optimize

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

build: ## Build Docker image
	docker build -t laravel-app:latest .

build-no-cache: ## Build Docker image without cache
	docker build --no-cache -t laravel-app:latest .

up: ## Start all services with Docker Compose
	docker-compose up -d

down: ## Stop all services
	docker-compose down

restart: ## Restart all services
	docker-compose restart

logs: ## Show logs from all services
	docker-compose logs -f

logs-app: ## Show logs from app service only
	docker-compose logs -f app

shell: ## Open shell in app container
	docker-compose exec app /bin/sh

bash: ## Open bash in app container (if available)
	docker-compose exec app /bin/bash || docker-compose exec app /bin/sh

test: ## Run tests in container
	docker-compose exec app php artisan test

test-coverage: ## Run tests with coverage
	docker-compose exec app php artisan test --coverage

pint: ## Run Laravel Pint (code formatter)
	docker-compose exec app vendor/bin/pint

artisan: ## Run artisan command (usage: make artisan CMD="migrate")
	docker-compose exec app php artisan $(CMD)

tinker: ## Open Laravel Tinker
	docker-compose exec app php artisan tinker

migrate: ## Run database migrations
	docker-compose exec app php artisan migrate

migrate-fresh: ## Fresh migration with seed
	docker-compose exec app php artisan migrate:fresh --seed

seed: ## Run database seeders
	docker-compose exec app php artisan db:seed

cache-clear: ## Clear all caches
	docker-compose exec app php artisan cache:clear
	docker-compose exec app php artisan config:clear
	docker-compose exec app php artisan route:clear
	docker-compose exec app php artisan view:clear

optimize: ## Optimize application for production
	docker-compose exec app php artisan optimize
	docker-compose exec app php artisan config:cache
	docker-compose exec app php artisan route:cache
	docker-compose exec app php artisan view:cache

queue-work: ## Monitor queue worker logs
	docker-compose exec app supervisorctl tail -f queue-worker

queue-restart: ## Restart queue workers
	docker-compose exec app php artisan queue:restart

supervisor-status: ## Show supervisor process status
	docker-compose exec app supervisorctl status

supervisor-restart: ## Restart all supervisor processes
	docker-compose exec app supervisorctl restart all

npm-install: ## Install npm dependencies
	docker-compose exec app npm install

npm-dev: ## Run npm dev
	docker-compose exec app npm run dev

npm-build: ## Build frontend assets
	docker-compose exec app npm run build

composer-install: ## Install composer dependencies
	docker-compose exec app composer install

composer-update: ## Update composer dependencies
	docker-compose exec app composer update

clean: ## Remove containers, volumes, and images
	docker-compose down -v
	docker rmi laravel-app:latest || true

rebuild: clean build up ## Clean rebuild and start

health: ## Check application health
	@curl -f http://localhost/health && echo "\n✓ Application is healthy" || echo "\n✗ Application is unhealthy"

php-fpm-status: ## Check PHP-FPM status
	@docker-compose exec app wget -qO- http://localhost/fpm-status || echo "PHP-FPM status not available"

php-fpm-ping: ## Ping PHP-FPM
	@docker-compose exec app wget -qO- http://localhost/fpm-ping || echo "PHP-FPM ping failed"

stats: ## Show container stats
	docker stats --no-stream

ps: ## Show running containers
	docker-compose ps

backup-db: ## Backup database
	@mkdir -p backups
	@docker-compose exec -T app php artisan db:backup > backups/db-backup-$$(date +%Y%m%d-%H%M%S).sql
	@echo "Database backed up to backups/"

backup-storage: ## Backup storage directory
	@mkdir -p backups
	@docker run --rm -v $$(pwd)/storage:/data -v $$(pwd)/backups:/backup alpine tar czf /backup/storage-$$(date +%Y%m%d-%H%M%S).tar.gz -C /data .
	@echo "Storage backed up to backups/"

permissions: ## Fix permissions for storage and bootstrap/cache
	@sudo chown -R 33:33 storage database bootstrap/cache
	@sudo chmod -R 775 storage database bootstrap/cache
	@echo "Permissions fixed"

init: ## Initialize application (first time setup)
	@echo "Initializing application..."
	@cp -n .env.example .env || true
	@cp -n docker-compose.example.yml docker-compose.yml || true
	@echo "Please edit .env and docker-compose.yml with your settings"
	@echo "Then run: make build && make up"

prod-build: ## Build production image
	docker build \
		--build-arg APP_ENV=production \
		--tag laravel-app:$$(git rev-parse --short HEAD) \
		--tag laravel-app:latest \
		.

prod-push: ## Push production image to registry
	@echo "Tagging image..."
	docker tag laravel-app:latest $(REGISTRY)/laravel-app:$$(git rev-parse --short HEAD)
	docker tag laravel-app:latest $(REGISTRY)/laravel-app:latest
	@echo "Pushing to registry..."
	docker push $(REGISTRY)/laravel-app:$$(git rev-parse --short HEAD)
	docker push $(REGISTRY)/laravel-app:latest

scan: ## Scan image for vulnerabilities
	@command -v trivy >/dev/null 2>&1 && trivy image laravel-app:latest || echo "Trivy not installed. Install from: https://github.com/aquasecurity/trivy"

install-tools: ## Install development tools
	@echo "Installing Docker and Docker Compose..."
	@command -v docker >/dev/null 2>&1 || (echo "Please install Docker: https://docs.docker.com/get-docker/" && exit 1)
	@command -v docker-compose >/dev/null 2>&1 || (echo "Please install Docker Compose: https://docs.docker.com/compose/install/" && exit 1)
	@echo "✓ Docker tools are installed"
